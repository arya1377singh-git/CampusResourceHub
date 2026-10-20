
from models.user import db


class Maintenance(db.Model):
    __tablename__ = "maintenance"

    id = db.Column(db.Integer, primary_key=True)
    resource_id = db.Column(db.Integer, nullable=False)
    reason = db.Column(db.String(255))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    status = db.Column(db.String(30), default="Ongoing")
