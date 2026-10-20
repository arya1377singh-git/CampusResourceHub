import os
from datetime import date, datetime, timedelta
from functools import wraps

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
from werkzeug.security import check_password_hash

from config import Config
from models.booking import Booking
from models.department import Department
from models.maintenance import Maintenance
from models.resource import Resource
from models.user import User, db

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")

if not app.config["JWT_SECRET_KEY"]:
    raise RuntimeError("JWT_SECRET_KEY environment variable is not set")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)


def admin_required(fn):
    """Require a valid JWT belonging to an administrator."""
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()
        try:
            user_id = int(identity)
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid authentication token"}), 401

        user = db.session.get(User, user_id)
        if not user or str(user.role).lower() != "admin":
            return jsonify({"error": "Admin access required"}), 403

        return fn(*args, **kwargs)

    return wrapper


# LOGIN
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email", "")
    password = data.get("password", "")

    if not isinstance(email, str) or not isinstance(password, str):
        return jsonify({"error": "Email and password are required"}), 400

    email = email.strip().lower()
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
    )

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
        },
    }), 200


# HOME
@app.route("/")
def home():
    return "Campus Resource Backend is running!"


# DATABASE HEALTH CHECK
@app.route("/api/health", methods=["GET"])
def health_check():
    try:
        db.session.execute(db.text("SELECT 1"))
        return jsonify({"backend": "running", "database": "connected"}), 200
    except Exception:
        db.session.rollback()
        app.logger.exception("Database health check failed")
        return jsonify({"backend": "running", "database": "disconnected"}), 503


# GET ALL USERS (currently public; restrict before real deployment)

@app.route("/api/users", methods=["GET"])
@admin_required
def get_users():
    users = User.query.all()

    return jsonify([
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role
        }
        for u in users
    ]), 200



# GET ALL RESOURCES
@app.route("/api/resources", methods=["GET"])
def get_resources():
    resources = Resource.query.all()
    return jsonify([
        {
            "id": r.id,
            "name": r.name,
            "category": r.category,
            "location": r.location,
            "status": r.status,
            "department_id": r.department_id,
        }
        for r in resources
    ])


# GET ALL BOOKINGS (currently public; restrict before real deployment)

@app.route("/api/bookings", methods=["GET"])
@jwt_required()
def get_bookings():
    current_user_id = int(get_jwt_identity())
    current_user = db.session.get(User, current_user_id)

    if not current_user:
        return jsonify({"error": "User not found"}), 404

    # Admins can view all bookings; students see only their own.
    if current_user.role.lower() == "admin":
        bookings = Booking.query.all()
    else:
        bookings = Booking.query.filter_by(
            user_id=current_user_id
        ).all()

    return jsonify([
        {
            "id": b.id,
            "user_id": b.user_id,
            "resource_id": b.resource_id,
            "booking_date": b.booking_date.isoformat(),
            "day": b.day,
            "start_time": b.start_time.strftime("%H:%M:%S"),
            "duration": float(b.duration),
            "status": b.status,
        }
        for b in bookings
    ]), 200



# CREATE A BOOKING (authentication/ownership checks still need to be added)
@app.route("/api/bookings", methods=["POST"])
@jwt_required()
def create_booking():
    data = request.get_json(silent=True) or {}
    required = ["resource_id", "booking_date", "start_time", "duration"]
    if any(field not in data for field in required):
        return jsonify({"error": "Missing required booking fields"}), 400

    try:
        user_id = int(get_jwt_identity())
        resource_id = int(data["resource_id"])
        duration = float(data["duration"])
        booking_date = date.fromisoformat(data["booking_date"])
        start_time = datetime.strptime(data["start_time"], "%H:%M").time()
        if duration <= 0 or duration > 24:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({
            "error": "Invalid input. Use YYYY-MM-DD for date, HH:MM for time, and duration between 0 and 24."
        }), 400

    user = db.session.get(User, user_id)
    resource = db.session.get(Resource, resource_id)
    if not user or not resource:
        return jsonify({"error": "User or resource not found"}), 404
    if str(resource.status).lower() != "available":
        return jsonify({"error": "Resource is not available"}), 409

    start_dt = datetime.combine(booking_date, start_time)
    end_dt = start_dt + timedelta(hours=duration)
    if end_dt.date() != booking_date:
        return jsonify({"error": "Booking must end on the same date"}), 400

    existing_bookings = Booking.query.filter_by(
        resource_id=resource_id, booking_date=booking_date, status="Confirmed"
    ).all()
    for booking in existing_bookings:
        old_start = datetime.combine(booking_date, booking.start_time)
        old_end = old_start + timedelta(hours=float(booking.duration))
        if start_dt < old_end and old_start < end_dt:
            return jsonify({"error": "This resource is already booked during that time"}), 409

    maintenance_records = Maintenance.query.filter_by(
        resource_id=resource_id, status="Ongoing"
    ).all()
    for record in maintenance_records:
        if record.start_date and record.end_date and record.start_date <= booking_date <= record.end_date:
            return jsonify({"error": "Resource is under maintenance"}), 409

    booking = Booking(
        user_id=user_id,
        resource_id=resource_id,
        booking_date=booking_date,
        day=booking_date.strftime("%A"),
        start_time=start_time,
        duration=duration,
        status="Confirmed",
    )
    db.session.add(booking)
    db.session.commit()
    return jsonify({"message": "Booking created successfully", "booking_id": booking.id}), 201


# CANCEL A BOOKING (ownership/authentication checks still need to be added)

@app.route("/api/bookings/<int:booking_id>", methods=["DELETE"])
@jwt_required()
def cancel_booking(booking_id):
    booking = db.session.get(Booking, booking_id)

    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    # Get the ID of the logged-in user from their token.
    current_user_id = int(get_jwt_identity())

    # Only the booking owner or an admin can cancel it.
    current_user = db.session.get(User, current_user_id)

    if not current_user:
        return jsonify({"error": "User not found"}), 404

    if current_user.role.lower() != "admin" and booking.user_id != current_user_id:
        return jsonify({"error": "You can only cancel your own bookings"}), 403

    if booking.status != "Confirmed":
        return jsonify({"error": "Only confirmed bookings can be cancelled"}), 409

    booking.status = "Cancelled"
    db.session.commit()

    return jsonify({"message": "Booking cancelled successfully"}), 200


# CHECK RESOURCE AVAILABILITY
@app.route("/api/resources/<int:resource_id>/availability", methods=["GET"])
@jwt_required()
def check_availability(resource_id):
    resource = db.session.get(Resource, resource_id)
    if not resource:
        return jsonify({"error": "Resource not found"}), 404

    booking_date_str = request.args.get("date")
    start_time_str = request.args.get("start_time")
    duration_str = request.args.get("duration")

    if not booking_date_str or not start_time_str or not duration_str:
        return jsonify({
            "error": "Provide date, start_time and duration"
        }), 400

    try:
        booking_date = date.fromisoformat(booking_date_str)
        start_time = datetime.strptime(start_time_str, "%H:%M").time()
        duration = float(duration_str)

        if duration <= 0 or duration > 24:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({
            "error": "Invalid input. Use date=YYYY-MM-DD, start_time=HH:MM, and duration between 0 and 24."
        }), 400

    if str(resource.status).lower() != "available":
        return jsonify({
            "resource_id": resource_id,
            "available": False,
            "reason": "Resource is not available"
        }), 200

    start_dt = datetime.combine(booking_date, start_time)
    end_dt = start_dt + timedelta(hours=duration)

    if end_dt.date() != booking_date:
        return jsonify({
            "resource_id": resource_id,
            "available": False,
            "reason": "Booking must end on the same date"
        }), 200

    bookings = Booking.query.filter_by(
        resource_id=resource_id,
        booking_date=booking_date,
        status="Confirmed"
    ).all()

    for booking in bookings:
        old_start = datetime.combine(booking_date, booking.start_time)
        old_end = old_start + timedelta(hours=float(booking.duration))

        if start_dt < old_end and old_start < end_dt:
            return jsonify({
                "resource_id": resource_id,
                "available": False,
                "reason": "Time slot conflicts with an existing booking"
            }), 200

    maintenance_records = Maintenance.query.filter_by(
        resource_id=resource_id,
        status="Ongoing"
    ).all()

    for record in maintenance_records:
        if (
            record.start_date
            and record.end_date
            and record.start_date <= booking_date <= record.end_date
        ):
            return jsonify({
                "resource_id": resource_id,
                "available": False,
                "reason": "Resource is under maintenance"
            }), 200

    return jsonify({
        "resource_id": resource_id,
        "available": True,
        "date": booking_date.isoformat(),
        "start_time": start_time.strftime("%H:%M"),
        "duration": duration
    }), 200




# GET ALL MAINTENANCE RECORDS
@app.route("/api/maintenance", methods=["GET"])
@jwt_required()
def get_maintenance():
    current_user_id = int(get_jwt_identity())
    current_user = db.session.get(User, current_user_id)

    if not current_user:
        return jsonify({"error": "User not found"}), 404

    records = Maintenance.query.all()

    return jsonify([
        {
            "id": m.id,
            "resource_id": m.resource_id,
            "reason": m.reason,
            "start_date": m.start_date.isoformat() if m.start_date else None,
            "end_date": m.end_date.isoformat() if m.end_date else None,
            "status": m.status,
        }
        for m in records
    ]), 200


# ADD A RESOURCE — ADMIN ONLY
@app.route("/api/resources", methods=["POST"])
@admin_required
def add_resource():
    data = request.get_json(silent=True) or {}
    required = ["name", "category", "location", "department_id"]
    if any(not data.get(k) for k in required):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        department_id = int(data["department_id"])
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid department_id"}), 400
    if not db.session.get(Department, department_id):
        return jsonify({"error": "Department not found"}), 404

    resource = Resource(
        name=data["name"],
        category=data["category"],
        location=data["location"],
        department_id=department_id,
        status="Available",
    )
    db.session.add(resource)
    db.session.commit()
    return jsonify({"message": "Resource added successfully", "resource_id": resource.id}), 201


# EDIT A RESOURCE — ADMIN ONLY
@app.route("/api/resources/<int:resource_id>", methods=["PUT"])
@admin_required
def update_resource(resource_id):
    resource = db.session.get(Resource, resource_id)
    if not resource:
        return jsonify({"error": "Resource not found"}), 404

    data = request.get_json(silent=True) or {}
    for field in ["name", "category", "location"]:
        if field in data:
            if not isinstance(data[field], str) or not data[field].strip():
                return jsonify({"error": field + " cannot be empty"}), 400
            setattr(resource, field, data[field].strip())

    if "status" in data:
        if data["status"] not in ["Available", "Unavailable", "Under Maintenance"]:
            return jsonify({"error": "Invalid status"}), 400
        resource.status = data["status"]

    if "department_id" in data:
        try:
            department_id = int(data["department_id"])
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid department_id"}), 400
        if not db.session.get(Department, department_id):
            return jsonify({"error": "Department not found"}), 404
        resource.department_id = department_id

    db.session.commit()
    return jsonify({"message": "Resource updated successfully"})


# DELETE A RESOURCE — ADMIN ONLY
@app.route("/api/resources/<int:resource_id>", methods=["DELETE"])
@admin_required
def delete_resource(resource_id):
    resource = db.session.get(Resource, resource_id)
    if not resource:
        return jsonify({"error": "Resource not found"}), 404
    if Booking.query.filter_by(resource_id=resource_id).first():
        return jsonify({"error": "Resource has booking history; mark it Unavailable instead"}), 409
    if Maintenance.query.filter_by(resource_id=resource_id).first():
        return jsonify({"error": "Resource has maintenance history; mark it Unavailable instead"}), 409

    db.session.delete(resource)
    db.session.commit()
    return jsonify({"message": "Resource deleted successfully"})


if __name__ == "__main__":
    app.run(debug=True)
