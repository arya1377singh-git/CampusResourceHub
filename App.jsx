import { useState } from "react";
import "./App.css";

const resources = [
  {
    id: 1,
    name: "AI & Data Science Lab",
    category: "Lab",
    location: "Block A · 2nd Floor",
    capacity: 40,
    status: "Available",
    icon: "⌘",
    description:
      "Computer laboratory equipped for AI, Data Science and programming projects.",
  },
  {
    id: 2,
    name: "Projector - Epson EB-X06",
    category: "Equipment",
    location: "Seminar Hall",
    capacity: 1,
    status: "Available",
    icon: "▣",
    description:
      "Portable projector suitable for presentations, seminars and classroom demonstrations.",
  },
  {
    id: 3,
    name: "Arduino Starter Kit",
    category: "Equipment",
    location: "IoT Lab · Block B",
    capacity: 1,
    status: "Available",
    icon: "◉",
    description:
      "Arduino development kit with sensors and components for hardware projects.",
  },
  {
    id: 4,
    name: "Media Production Room",
    category: "Room",
    location: "Block C · Ground Floor",
    capacity: 8,
    status: "Booked",
    icon: "▤",
    description:
      "Small production space suitable for filming, editing and creative projects.",
  },
  {
    id: 5,
    name: "DSA Computer Lab",
    category: "Lab",
    location: "Block A · 1st Floor",
    capacity: 35,
    status: "Available",
    icon: "⌘",
    description:
      "Computer lab designed for programming, algorithms and technical coursework.",
  },
  {
    id: 6,
    name: "Canon DSLR Camera",
    category: "Equipment",
    location: "Media Department",
    capacity: 1,
    status: "Available",
    icon: "◎",
    description:
      "DSLR camera available for academic events, filmmaking and student projects.",
  },
];

const initialBookings = [
  {
    id: 101,
    resource: "AI & Data Science Lab",
    date: "08 Oct 2026",
    time: "10:00 AM - 12:00 PM",
    status: "Confirmed",
  },
  {
    id: 102,
    resource: "Arduino Starter Kit",
    date: "10 Oct 2026",
    time: "02:00 PM - 04:00 PM",
    status: "Confirmed",
  },
];

function App() {
  const [activePage, setActivePage] = useState("home");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedResource, setSelectedResource] = useState(null);
  const [bookings, setBookings] = useState(initialBookings);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const categories = ["All", "Lab", "Room", "Equipment"];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.name.toLowerCase().includes(search.toLowerCase()) ||
      resource.location.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || resource.category === category;

    return matchesSearch && matchesCategory;
  });

  const openBookingModal = (resource) => {
    setSelectedResource(resource);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (!selectedResource) return;

    const newBooking = {
      id: Date.now(),
      resource: selectedResource.name,
      date: "15 Oct 2026",
      time: "10:00 AM - 12:00 PM",
      status: "Confirmed",
    };

    setBookings([...bookings, newBooking]);
    setShowBookingModal(false);
    setActivePage("bookings");
    setSelectedResource(null);
  };

  const cancelBooking = (bookingId) => {
    setBookings(bookings.filter((booking) => booking.id !== bookingId));
  };

  return (
    <div className="app">
      {/* Navigation */}
      <header className="navbar">
        <div
          className="brand"
          onClick={() => setActivePage("home")}
        >
          <div className="brand-mark">CR</div>

          <div>
            <div className="brand-name">Campus Resources</div>
            <div className="brand-subtitle">Resource Management System</div>
          </div>
        </div>

        <nav className="nav-links">
          <button
            className={activePage === "home" ? "nav-link active" : "nav-link"}
            onClick={() => setActivePage("home")}
          >
            Home
          </button>

          <button
            className={
              activePage === "resources"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => setActivePage("resources")}
          >
            Resources
          </button>

          <button
            className={
              activePage === "bookings"
                ? "nav-link active"
                : "nav-link"
            }
            onClick={() => setActivePage("bookings")}
          >
            My Bookings
          </button>
        </nav>

        <button className="profile-button">
          <span className="profile-avatar">S</span>
          Student
        </button>
      </header>

      {/* Main Content */}
      <main>
        {activePage === "home" && (
          <>
            {/* Hero */}
            <section className="hero">
              <div className="hero-content">
                <div className="eyebrow">CAMPUS RESOURCE PORTAL</div>

                <h1>
                  Find what you need.
                  <br />
                  <span>Book it when you need it.</span>
                </h1>

                <p>
                  Discover and reserve labs, classrooms, equipment and
                  other campus resources from one simple platform.
                </p>

                <button
                  className="primary-button"
                  onClick={() => setActivePage("resources")}
                >
                  Explore Resources
                  <span>→</span>
                </button>
              </div>

              <div className="hero-card">
                <div className="hero-card-top">
                  <span>RESOURCE OVERVIEW</span>
                  <span className="live-indicator">
                    <span></span>
                    Live
                  </span>
                </div>

                <div className="hero-stat-main">
                  <strong>24</strong>
                  <span>Resources available today</span>
                </div>

                <div className="mini-stats">
                  <div>
                    <strong>18</strong>
                    <span>Available</span>
                  </div>

                  <div>
                    <strong>6</strong>
                    <span>In use</span>
                  </div>

                  <div>
                    <strong>92%</strong>
                    <span>System uptime</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Stats */}
            <section className="stats-section">
              <div className="stat-card">
                <div className="stat-icon">▦</div>
                <div>
                  <strong>32</strong>
                  <span>Total Resources</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">✓</div>
                <div>
                  <strong>24</strong>
                  <span>Available Now</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon blue">◷</div>
                <div>
                  <strong>{bookings.length}</strong>
                  <span>My Bookings</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">↗</div>
                <div>
                  <strong>78%</strong>
                  <span>Avg. Utilization</span>
                </div>
              </div>
            </section>

            {/* Popular Resources */}
            <section className="section">
              <div className="section-heading">
                <div>
                  <div className="section-label">DISCOVER</div>
                  <h2>Popular Resources</h2>
                  <p>Frequently used resources across campus.</p>
                </div>

                <button
                  className="text-button"
                  onClick={() => setActivePage("resources")}
                >
                  View all →
                </button>
              </div>

              <div className="resource-grid">
                {resources.slice(0, 3).map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onBook={openBookingModal}
                  />
                ))}
              </div>
            </section>

            {/* How It Works */}
            <section className="how-section">
              <div className="section-heading centered">
                <div>
                  <div className="section-label">SIMPLE PROCESS</div>
                  <h2>How it works</h2>
                  <p>Reserve a campus resource in three simple steps.</p>
                </div>
              </div>

              <div className="steps">
                <div className="step">
                  <div className="step-number">01</div>
                  <h3>Find</h3>
                  <p>
                    Search for the lab, room or equipment you need.
                  </p>
                </div>

                <div className="step-line"></div>

                <div className="step">
                  <div className="step-number">02</div>
                  <h3>Check</h3>
                  <p>
                    View availability and choose a suitable time.
                  </p>
                </div>

                <div className="step-line"></div>

                <div className="step">
                  <div className="step-number">03</div>
                  <h3>Book</h3>
                  <p>
                    Confirm your booking and receive instant confirmation.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Resources Page */}
        {activePage === "resources" && (
          <section className="page-section">
            <div className="page-header">
              <div>
                <div className="section-label">CAMPUS CATALOGUE</div>
                <h1>All Resources</h1>
                <p>
                  Browse available campus facilities and equipment.
                </p>
              </div>
            </div>

            <div className="resource-controls">
              <div className="search-box">
                <span>⌕</span>
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="category-buttons">
                {categories.map((item) => (
                  <button
                    key={item}
                    className={
                      category === item
                        ? "category-button selected"
                        : "category-button"
                    }
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="resource-grid full-grid">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onBook={openBookingModal}
                />
              ))}
            </div>

            {filteredResources.length === 0 && (
              <div className="empty-state">
                <div>⌕</div>
                <h3>No resources found</h3>
                <p>Try changing your search or category filter.</p>
              </div>
            )}
          </section>
        )}

        {/* Bookings Page */}
        {activePage === "bookings" && (
          <section className="page-section">
            <div className="page-header">
              <div>
                <div className="section-label">PERSONAL DASHBOARD</div>
                <h1>My Bookings</h1>
                <p>
                  View and manage your current resource reservations.
                </p>
              </div>
            </div>

            {bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div className="booking-card" key={booking.id}>
                    <div className="booking-resource-icon">▦</div>

                    <div className="booking-info">
                      <h3>{booking.resource}</h3>
                      <div className="booking-details">
                        <span>◷ {booking.date}</span>
                        <span>◴ {booking.time}</span>
                      </div>
                    </div>

                    <div className="booking-actions">
                      <span className="status-badge">
                        {booking.status}
                      </span>

                      <button
                        className="cancel-button"
                        onClick={() => cancelBooking(booking.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div>▦</div>
                <h3>No bookings yet</h3>
                <p>
                  Explore the resource catalogue and make your first
                  booking.
                </p>

                <button
                  className="primary-button"
                  onClick={() => setActivePage("resources")}
                >
                  Browse Resources
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div>
          <strong>Campus Resources</strong>
          <span>
            Cloud-Based Campus Resource Management & Utilization
            Analytics System
          </span>
        </div>

        <div className="footer-right">
          <span>Student Portal</span>
          <span>•</span>
          <span>2026</span>
        </div>
      </footer>

      {/* Booking Modal */}
      {showBookingModal && selectedResource && (
        <div
          className="modal-overlay"
          onClick={() => setShowBookingModal(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowBookingModal(false)}
            >
              ×
            </button>

            <div className="modal-icon">{selectedResource.icon}</div>

            <div className="section-label">BOOK RESOURCE</div>

            <h2>{selectedResource.name}</h2>

            <p className="modal-description">
              {selectedResource.description}
            </p>

            <div className="modal-info">
              <div>
                <span>Location</span>
                <strong>{selectedResource.location}</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>{selectedResource.category}</strong>
              </div>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input type="date" defaultValue="2026-10-15" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Time</label>
                <select defaultValue="10:00">
                  <option value="10:00">10:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="02:00">2:00 PM</option>
                  <option value="04:00">4:00 PM</option>
                </select>
              </div>

              <div className="form-group">
                <label>Duration</label>
                <select defaultValue="2">
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                </select>
              </div>
            </div>

            <button
              className="confirm-button"
              onClick={confirmBooking}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResourceCard({ resource, onBook }) {
  const isAvailable = resource.status === "Available";

  return (
    <article className="resource-card">
      <div className="resource-card-top">
        <div className="resource-icon">{resource.icon}</div>

        <span
          className={
            isAvailable
              ? "availability available"
              : "availability booked"
          }
        >
          <span></span>
          {resource.status}
        </span>
      </div>

      <div className="resource-category">
        {resource.category}
      </div>

      <h3>{resource.name}</h3>

      <p>{resource.description}</p>

      <div className="resource-meta">
        <span>⌖ {resource.location}</span>
        <span>◉ {resource.capacity}</span>
      </div>

      <button
        className={
          isAvailable
            ? "resource-button"
            : "resource-button disabled"
        }
        disabled={!isAvailable}
        onClick={() => onBook(resource)}
      >
        {isAvailable ? "Book Resource" : "Currently Unavailable"}
        {isAvailable && <span>→</span>}
      </button>
    </article>
  );
}

export default App;