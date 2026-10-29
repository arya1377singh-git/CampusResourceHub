import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Bell, Building2, Camera, Check, CircuitBoard, Clock3, Cpu, FlaskConical, Info, LayoutDashboard, ListOrdered, LogOut, MapPin, MoreHorizontal, Plus, Projector, Search, X } from "lucide-react";
import { LandingPage, LoginPage } from "./AuthPages.jsx";
import { DEMO_ACCOUNTS } from "./demo-accounts.js";
import "./App.css";

const glyphs = {
  "⌘": Cpu,
  "▣": Projector,
  "◉": CircuitBoard,
  "▤": Building2,
  "◎": Camera,
  "⌬": FlaskConical,
  "▦": LayoutDashboard,
  "⌕": Search,
  "◷": Clock3,
  "✓": Check,
  "≋": ListOrdered,
  "⌖": MapPin,
  "↗": ArrowUpRight,
  "♧": Bell,
  "＋": Plus,
  "→": ArrowRight,
  "i": Info,
  "×": X,
  "⋯": MoreHorizontal,
};

function Glyph({ symbol, size = 15 }) {
  const Icon = glyphs[symbol] ?? Building2;
  return <Icon aria-hidden="true" size={size} strokeWidth={1.8} />;
}

const initialResources = [
  { id: 1, name: "AI & Data Science Lab", type: "Laboratory", location: "Block A · Floor 2", capacity: "40 seats", icon: "⌘", state: "Available" },
  { id: 2, name: "Electronics Lab 02", type: "Laboratory", location: "Block B · Floor 1", capacity: "32 seats", icon: "⌘", state: "Available" },
  { id: 3, name: "Projector · Epson EB-X06", type: "Equipment", location: "Learning Commons", capacity: "1 unit", icon: "▣", state: "Available" },
  { id: 4, name: "Arduino Starter Kit", type: "Equipment", location: "IoT Lab · Block B", capacity: "1 kit", icon: "◉", state: "Available" },
  { id: 5, name: "Seminar Room 3", type: "Classroom", location: "Block C · Floor 1", capacity: "60 seats", icon: "▤", state: "Available" },
  { id: 6, name: "Media Production Room", type: "Studio", location: "Block C · Ground", capacity: "8 seats", icon: "◎", state: "In use" },
  { id: 7, name: "Canon DSLR Camera", type: "Equipment", location: "Media Department", capacity: "1 unit", icon: "◎", state: "Available" },
  { id: 8, name: "Chemistry Lab 01", type: "Laboratory", location: "Block D · Floor 1", capacity: "28 seats", icon: "⌬", state: "Maintenance" },
];

const initialRequests = [
  { id: "BR-2048", student: "Nina Patel", initials: "NP", department: "Computer Science", resource: "AI & Data Science Lab", date: "Nov 05, 2026", slot: "10:00 AM – 12:00 PM", purpose: "Capstone model evaluation", status: "Awaiting HOD", submitted: "12 min ago" },
  { id: "BR-2047", student: "Marcus Chen", initials: "MC", department: "Computer Science", resource: "Arduino Starter Kit", date: "Nov 05, 2026", slot: "01:00 PM – 03:00 PM", purpose: "Embedded systems lab work", status: "Awaiting admin", submitted: "38 min ago" },
  { id: "BR-2046", student: "Aisha Rahman", initials: "AR", department: "Design & Media", resource: "Media Production Room", date: "Nov 06, 2026", slot: "09:00 AM – 11:00 AM", purpose: "Documentary interview recording", status: "Approved", submitted: "Yesterday" },
  { id: "BR-2045", student: "Leo Martin", initials: "LM", department: "Computer Science", resource: "AI & Data Science Lab", date: "Nov 05, 2026", slot: "10:00 AM – 12:00 PM", purpose: "Group project session", status: "Waitlisted", submitted: "Yesterday", queue: 1 },
  { id: "BR-2044", student: "Sara Okafor", initials: "SO", department: "Engineering", resource: "Projector · Epson EB-X06", date: "Nov 07, 2026", slot: "02:00 PM – 04:00 PM", purpose: "Robotics design review", status: "Rejected", submitted: "Oct 27" },
];

const initialSlots = [
  { id: 1, start: "09:00", end: "10:00", label: "09:00 AM – 10:00 AM", enabled: true },
  { id: 2, start: "10:00", end: "11:00", label: "10:00 AM – 11:00 AM", enabled: true },
  { id: 3, start: "11:00", end: "12:00", label: "11:00 AM – 12:00 PM", enabled: true },
  { id: 4, start: "12:00", end: "13:00", label: "12:00 PM – 01:00 PM", enabled: true },
  { id: 5, start: "13:00", end: "14:00", label: "01:00 PM – 02:00 PM", enabled: true },
  { id: 6, start: "14:00", end: "15:00", label: "02:00 PM – 03:00 PM", enabled: true },
  { id: 7, start: "15:00", end: "16:00", label: "03:00 PM – 04:00 PM", enabled: true },
  { id: 8, start: "16:00", end: "17:00", label: "04:00 PM – 05:00 PM", enabled: true },
];

const roleDetails = {
  Student: { name: "Jordan Lee", initials: "JL", department: "Computer Science", subtitle: "Student workspace" },
  HOD: { name: "Dr. Priya Sharma", initials: "PS", department: "Computer Science", subtitle: "Department approvals" },
  Admin: { name: "Alex Morgan", initials: "AM", department: "Campus operations", subtitle: "Administrator workspace" },
};

const roleRoutes = { Admin: "admin", HOD: "hod", Student: "student" };

const roleFromPath = (path) => Object.entries(roleRoutes).find(([, slug]) => path === `/dashboard/${slug}`)?.[0] ?? null;

const navByRole = {
  Student: [
    { id: "overview", label: "Overview", icon: "▦" },
    { id: "resources", label: "Browse resources", icon: "⌕" },
    { id: "bookings", label: "My bookings", icon: "◷" },
    { id: "waitlist", label: "Waiting list", icon: "≋" },
  ],
  HOD: [
    { id: "overview", label: "Overview", icon: "▦" },
    { id: "requests", label: "Department requests", icon: "◷" },
    { id: "bookings", label: "Approval history", icon: "✓" },
  ],
  Admin: [
    { id: "overview", label: "Overview", icon: "▦" },
    { id: "requests", label: "Booking requests", icon: "◷" },
    { id: "resources", label: "Resources", icon: "⌘" },
    { id: "waitlist", label: "Waiting list", icon: "≋" },
    { id: "schedule", label: "Time slots", icon: "▤" },
    { id: "bookings", label: "All bookings", icon: "✓" },
  ],
};

const statusClass = (status) => {
  if (status === "Approved") return "approved";
  if (status === "Awaiting admin") return "admin-pending";
  if (status === "Awaiting HOD") return "hod-pending";
  if (status === "Waitlisted") return "waitlisted";
  if (status === "Rejected") return "rejected";
  if (status === "Cancelled") return "cancelled";
  return "neutral";
};

function App() {
  const [route, setRoute] = useState(() => window.location.pathname);
  const [authenticatedRole, setAuthenticatedRole] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [activePage, setActivePage] = useState("overview");
  const [resources] = useState(initialResources);
  const [requests, setRequests] = useState(initialRequests);
  const [slots, setSlots] = useState(initialSlots);
  const [selectedResource, setSelectedResource] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [notice, setNotice] = useState("");
  const [inspectedRequest, setInspectedRequest] = useState(null);

  useEffect(() => {
    const syncRoute = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  useEffect(() => {
    const requestedRole = roleFromPath(route);
    if (requestedRole && authenticatedRole !== requestedRole) {
      window.history.replaceState({}, "", "/login");
    }
  }, [route, authenticatedRole]);

  const role = roleFromPath(route) ?? authenticatedRole ?? "Admin";
  const user = roleDetails[role];
  const pendingHod = requests.filter((item) => item.status === "Awaiting HOD").length;
  const pendingAdmin = requests.filter((item) => item.status === "Awaiting admin").length;
  const waitingCount = requests.filter((item) => item.status === "Waitlisted").length;
  const approvedCount = requests.filter((item) => item.status === "Approved").length;
  const availableResources = resources.filter((resource) => resource.state === "Available");
  const visibleResources = useMemo(() => resources.filter((resource) => {
    const matchesSearch = `${resource.name} ${resource.location} ${resource.type}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (typeFilter === "All types" || resource.type === typeFilter);
  }), [resources, search, typeFilter]);

  const filteredRequests = useMemo(() => requests.filter((item) => {
    if (role === "HOD") return item.department === user.department;
    return true;
  }), [requests, role, user.department]);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  const handleLogin = (email, password) => {
    const account = DEMO_ACCOUNTS.find((demoAccount) => demoAccount.email === email && demoAccount.password === password);
    if (!account) {
      setLoginError("Those demo credentials don’t match. Choose an account below or try again.");
      return;
    }
    setAuthenticatedRole(account.role);
    setLoginError("");
    setActivePage("overview");
    setNotice("");
    navigate(`/dashboard/${roleRoutes[account.role]}`);
  };

  const openPage = (page) => {
    setActivePage(page);
    setNotice("");
  };

  const signOut = () => {
    setAuthenticatedRole(null);
    setActivePage("overview");
    setNotice("");
    navigate("/");
  };

  const decideRequest = (id, nextStatus) => {
    setRequests((current) => current.map((item) => {
      if (item.id !== id) return item;
      if (nextStatus === "Approved" && role === "HOD") return { ...item, status: "Awaiting admin", hodRemark: "Approved by department" };
      return { ...item, status: nextStatus, ...(role === "HOD" ? { hodRemark: "Rejected by department" } : { adminRemark: nextStatus === "Approved" ? "Approved by campus admin" : "Rejected by campus admin" }) };
    }));
    setNotice(nextStatus === "Rejected" ? "Request rejected. The student can see the decision in My bookings." : role === "HOD" ? "HOD approval recorded. This request is now with the campus admin." : "Booking approved. The student can now see it as confirmed.");
  };

  const submitBooking = (event) => {
    event.preventDefault();
    if (!selectedResource) return;
    const form = new FormData(event.currentTarget);
    const requestedDate = new Date(`${form.get("date")}T00:00:00`);
    const readableDate = requestedDate.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    const selectedSlot = form.get("time");
    const startMinutes = clockToMinutes(selectedSlot.split("–")[0].trim());
    const duration = Number(form.get("duration"));
    const endMinutes = startMinutes + duration * 60;
    const requestedSlot = `${formatClock(startMinutes)} – ${formatClock(endMinutes)}`;
    const collision = requests.some((item) => {
      if (item.resource !== selectedResource.name || item.date !== readableDate || !["Approved", "Awaiting admin"].includes(item.status)) return false;
      const existingRange = parseSlotRange(item.slot);
      return existingRange && existingRange.start < endMinutes && startMinutes < existingRange.end;
    });
    const nextId = `BR-${2050 + requests.length}`;
    const entry = {
      id: nextId,
      student: user.name,
      initials: user.initials,
      department: user.department,
      resource: selectedResource.name,
      date: readableDate,
      slot: requestedSlot,
      purpose: form.get("purpose"),
      status: collision ? "Waitlisted" : "Awaiting HOD",
      submitted: "Just now",
      ...(collision ? { queue: requests.filter((item) => item.status === "Waitlisted" && item.resource === selectedResource.name && item.date === readableDate && item.slot === requestedSlot).length + 1 } : {}),
    };
    setRequests((current) => [entry, ...current]);
    setShowBookingModal(false);
    setSelectedResource(null);
    setActivePage(collision ? "waitlist" : "bookings");
    setNotice(collision ? "That time is already confirmed. You have been added to the waiting list." : "Request submitted. It is now awaiting HOD approval.");
  };

  const cancelRequest = (id) => {
    setRequests((current) => current.map((item) => item.id === id ? { ...item, status: "Cancelled" } : item));
    setNotice("Request cancelled.");
  };

  const toggleSlot = (id) => setSlots((current) => current.map((slot) => slot.id === id ? { ...slot, enabled: !slot.enabled } : slot));
  const currentNav = navByRole[role];
  const pageHeading = currentNav.find((item) => item.id === activePage)?.label ?? "Overview";

  if (route === "/" || route === "/index.html") return <LandingPage onLogin={() => navigate("/login")} />;
  const routeRole = roleFromPath(route);
  if (!routeRole || authenticatedRole !== routeRole) return <LoginPage onLogin={handleLogin} onHome={() => navigate("/")} error={loginError} />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate("/"); }} aria-label="Campus Resources home">
          <span className="brand-mark">CR</span>
          <span className="brand-copy"><strong>Campus Resources</strong><small>RESOURCE HUB</small></span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav" aria-label={`${role} navigation`}>
          {currentNav.map((item) => (
            <button className={`side-link ${activePage === item.id ? "selected" : ""}`} key={item.id} onClick={() => openPage(item.id)}>
              <span className="side-icon"><Glyph symbol={item.icon} /></span><span>{item.label}</span>
              {item.id === "requests" && (role === "HOD" ? pendingHod : pendingAdmin) > 0 && <span className="nav-count">{role === "HOD" ? pendingHod : pendingAdmin}</span>}
              {item.id === "waitlist" && waitingCount > 0 && role !== "Student" && <span className="nav-count muted-count">{waitingCount}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="campus-card"><span className="campus-glyph"><Glyph symbol="⌖" /></span><span><strong>North Campus</strong><small>Academic year 2026–27</small></span><span className="chevron">⌄</span></div>
          <div className="sidebar-user"><span className="avatar avatar-small">{user.initials}</span><span className="user-copy"><strong>{user.name}</strong><small>{role} · {user.department}</small></span><button className="more-button" aria-label="More profile options"><Glyph symbol="⋯" /></button></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Campus</span><span className="breadcrumb-separator">/</span><strong>{pageHeading}</strong></div>
          <div className="topbar-actions">
            <span className="role-context">{role} portal</span>
            <button className="logout-button" onClick={signOut}><LogOut size={14} aria-hidden="true" /> Sign out</button>
            <button className="icon-button notification-button" aria-label="Notifications"><Glyph symbol="♧" />{pendingHod + pendingAdmin > 0 && <i />}</button>
            <span className="avatar avatar-top">{user.initials}</span>
          </div>
        </header>

        <div className="content-area">
          <div className="prototype-note"><span className="note-dot" /><span><strong>Interactive prototype</strong> · sample records only; changes reset when this page reloads</span></div>
          {notice && <div className="notice" role="status"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss message"><Glyph symbol="×" size={14} /></button></div>}
          {activePage === "overview" && <Overview role={role} user={user} requests={requests} resources={resources} pendingHod={pendingHod} pendingAdmin={pendingAdmin} waitingCount={waitingCount} approvedCount={approvedCount} availableResources={availableResources} onNavigate={openPage} onDecision={decideRequest} onInspect={setInspectedRequest} onBook={(resource) => { setSelectedResource(resource); setShowBookingModal(true); }} />}
          {activePage === "requests" && <RequestsPage role={role} requests={filteredRequests} onDecision={decideRequest} onInspect={setInspectedRequest} />}
          {activePage === "resources" && <ResourcesPage role={role} resources={visibleResources} search={search} setSearch={setSearch} typeFilter={typeFilter} setTypeFilter={setTypeFilter} onBook={(resource) => { setSelectedResource(resource); setShowBookingModal(true); }} />}
          {activePage === "bookings" && <BookingsPage role={role} requests={role === "HOD" ? filteredRequests : requests} onCancel={cancelRequest} />}
          {activePage === "waitlist" && <WaitlistPage role={role} requests={requests} onCancel={cancelRequest} />}
          {activePage === "schedule" && <SchedulePage slots={slots} onToggle={toggleSlot} />}
          <footer className="page-footer"><span>Campus Resource Hub</span><span>Preview workspace · 2026</span></footer>
        </div>
      </main>

      {showBookingModal && selectedResource && <BookingModal resource={selectedResource} slots={slots} onClose={() => { setShowBookingModal(false); setSelectedResource(null); }} onSubmit={submitBooking} />}
      {inspectedRequest && <RequestDetailModal request={inspectedRequest} onClose={() => setInspectedRequest(null)} />}
    </div>
  );
}

function Overview({ role, user, requests, resources, pendingHod, pendingAdmin, waitingCount, approvedCount, availableResources, onNavigate, onDecision, onInspect, onBook }) {
  const isStudent = role === "Student";
  const isHod = role === "HOD";
  const pending = isHod ? pendingHod : pendingAdmin;
  const roleRequests = isHod ? requests.filter((item) => item.department === user.department) : requests;
  const reviewQueue = isHod ? roleRequests.filter((item) => item.status === "Awaiting HOD") : roleRequests.filter((item) => item.status === "Awaiting admin");
  const personalRequests = requests.filter((item) => item.student === user.name);
  const metrics = isStudent
    ? [
        { label: "Total resources", value: resources.length, icon: "⌘", tone: "sage", caption: "Across campus" },
        { label: "Available now", value: availableResources.length, icon: "✓", tone: "mint", caption: "Ready to request" },
        { label: "My active requests", value: personalRequests.filter((item) => !["Cancelled", "Rejected"].includes(item.status)).length, icon: "◷", tone: "blue", caption: "Across all stages" },
        { label: "Waitlist positions", value: personalRequests.filter((item) => item.status === "Waitlisted").length, icon: "≋", tone: "amber", caption: "Queue updates" },
      ]
    : [
        { label: "Total resources", value: resources.length, icon: "⌘", tone: "sage", caption: `${resources.filter((item) => item.state === "Maintenance").length} in maintenance` },
        { label: isHod ? "Awaiting your review" : "Awaiting admin", value: pending, icon: "◷", tone: "amber", caption: isHod ? "Your department" : "HOD approved" },
        { label: "Confirmed bookings", value: approvedCount, icon: "✓", tone: "mint", caption: "This week" },
        { label: "Waiting list", value: waitingCount, icon: "≋", tone: "blue", caption: "Across campus" },
      ];
  const tableRows = isStudent ? personalRequests : reviewQueue;
  const panelTitle = isStudent ? "My recent requests" : isHod ? "Needs your review" : "Admin review queue";

  return (
    <>
      <section className="welcome-row">
        <div><div className="eyebrow">{isStudent ? "STUDENT PORTAL" : isHod ? "DEPARTMENT WORKSPACE" : "CAMPUS OPERATIONS"}</div><h1>{isStudent ? `Good morning, ${user.name.split(" ")[0]}` : isHod ? "Department overview" : "Operations overview"}</h1><p>{isStudent ? "Find a space, make a request, and follow every approval in one place." : isHod ? `Review booking requests from ${user.department} before they reach campus administration.` : "A clear view of campus resources, approvals, and what needs attention."}</p></div>
        <div className="welcome-actions">{isStudent && <button className="button button-primary" onClick={() => onNavigate("resources")}><Glyph symbol="＋" /> Find a resource</button>}<span className="date-pill"><Glyph symbol="◷" /> Thursday, Nov 5</span></div>
      </section>
      <section className="metric-grid" aria-label="Workspace statistics">{metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}</section>
      <section className="availability-banner"><div className="availability-symbol"><Glyph symbol="✓" /></div><div className="availability-copy"><strong>{availableResources.length} resources available for booking</strong><span>Availability varies by selected date and time. Choose a slot to see live options.</span></div><button className="text-action" onClick={() => onNavigate("resources")}>Check availability <Glyph symbol="→" size={12} /></button><div className="availability-pattern" aria-hidden="true" /></section>
      <div className="dashboard-grid">
        <section className="panel request-panel"><div className="panel-heading"><div><h2>{panelTitle}</h2><p>{isStudent ? "Follow each request through the approval process." : isHod ? "Computer Science requests awaiting a decision." : "HOD-approved requests ready for final review."}</p></div><button className="subtle-link" onClick={() => onNavigate(isStudent ? "bookings" : "requests")}>View all <Glyph symbol="→" size={12} /></button></div>
          {tableRows.length ? <RequestTable requests={tableRows.slice(0, 4)} role={role} onDecision={onDecision} onInspect={onInspect} /> : <div className="empty-inline"><span className="empty-symbol"><Glyph symbol="✓" /></span><div><strong>{isStudent ? "No requests yet" : "You’re all caught up"}</strong><span>{isStudent ? "Browse resources to start a booking request." : "There are no requests waiting for your review."}</span></div></div>}
        </section>
        <section className="panel side-panel"><div className="panel-heading"><div><h2>{isStudent ? "Quick reserve" : "Resource status"}</h2><p>{isStudent ? "Popular spaces with availability today." : "Current campus availability snapshot."}</p></div>{!isStudent && <button className="more-button" aria-label="Resource panel options"><Glyph symbol="⋯" /></button>}</div>
          {isStudent ? <div className="quick-resources">{resources.filter((item) => item.state === "Available").slice(0, 3).map((resource) => <button className="quick-resource" key={resource.id} onClick={() => onBook(resource)}><span className="quick-icon"><Glyph symbol={resource.icon} /></span><span className="quick-resource-copy"><strong>{resource.name}</strong><small>{resource.location}</small></span><span className="quick-arrow"><Glyph symbol="↗" size={14} /></span></button>)}<button className="view-resources" onClick={() => onNavigate("resources")}>Browse all resources <Glyph symbol="→" size={12} /></button></div> : <div className="resource-health"><div className="health-stat"><span className="health-dot green-dot" /><span>Available</span><strong>{resources.filter((item) => item.state === "Available").length}</strong></div><div className="health-stat"><span className="health-dot amber-dot" /><span>In use</span><strong>{resources.filter((item) => item.state === "In use").length}</strong></div><div className="health-stat"><span className="health-dot gray-dot" /><span>Maintenance</span><strong>{resources.filter((item) => item.state === "Maintenance").length}</strong></div><button className="view-resources" onClick={() => onNavigate("resources")}>Manage resources <Glyph symbol="→" size={12} /></button></div>}
        </section>
      </div>
    </>
  );
}

function MetricCard({ metric }) {
  return <article className="metric-card"><span className={`metric-icon ${metric.tone}`}><Glyph symbol={metric.icon} /></span><div className="metric-content"><span className="metric-label">{metric.label}</span><strong>{metric.value}</strong><small>{metric.caption}</small></div><span className="metric-trend"><Glyph symbol="↗" size={13} /></span></article>;
}

function RequestTable({ requests, role, onDecision, onInspect, showStudent = true }) {
  return <div className="table-scroll"><table className="request-table"><thead><tr>{showStudent && <th>REQUESTED BY</th>}<th>RESOURCE</th><th>DATE &amp; TIME</th><th>STATUS</th>{role !== "Student" && <th>ACTION</th>}</tr></thead><tbody>{requests.map((item) => <tr key={item.id}>{showStudent && <td><div className="student-cell"><span className="avatar table-avatar">{item.initials}</span><span><strong>{item.student}</strong><small>{item.department}</small></span></div></td>}<td><div className="resource-cell"><strong>{item.resource}</strong><small>{item.purpose}</small></div></td><td><div className="date-cell"><strong>{item.date}</strong><small>{item.slot}</small></div></td><td><StatusBadge status={item.status} queue={item.queue} /></td>{role !== "Student" && <td><div className="row-actions">{(role === "HOD" ? item.status === "Awaiting HOD" : item.status === "Awaiting admin") ? <><button className="approve-button" onClick={() => onDecision(item.id, "Approved")}>Approve</button><button className="reject-button" onClick={() => onDecision(item.id, "Rejected")}>Reject</button></> : <button className="review-button" onClick={() => onInspect(item)}>Details</button>}</div></td>}</tr>)}</tbody></table></div>;
}

function StatusBadge({ status, queue }) {
  const label = status === "Waitlisted" && queue ? `Waitlist · #${queue}` : status;
  return <span className={`status-badge ${statusClass(status)}`}><i />{label}</span>;
}

function RequestsPage({ role, requests, onDecision, onInspect }) {
  const pending = requests.filter((item) => item.status === (role === "HOD" ? "Awaiting HOD" : "Awaiting admin"));
  const allShown = role === "HOD" ? requests : requests;
  return <PageShell eyebrow={role === "HOD" ? "FIRST-STAGE REVIEW" : "CAMPUS-WIDE APPROVALS"} title={role === "HOD" ? "Department requests" : "Booking requests"} description={role === "HOD" ? "Requests are limited to your assigned department." : "Review bookings that have passed department approval."}>
    <div className="filter-row"><span className="filter-summary"><strong>{pending.length}</strong> waiting for your decision</span><span className="filter-tag">{role === "HOD" ? "Computer Science" : "All departments"}</span></div>
    <section className="panel full-panel">{allShown.length ? <RequestTable requests={allShown} role={role} onDecision={onDecision} onInspect={onInspect} /> : <div className="empty-inline"><span className="empty-symbol"><Glyph symbol="✓" /></span><div><strong>Nothing to review</strong><span>New requests will appear here when they reach this approval stage.</span></div></div>}</section>
  </PageShell>;
}

function ResourcesPage({ role, resources, search, setSearch, typeFilter, setTypeFilter, onBook }) {
  const resourceTypes = ["All types", "Laboratory", "Classroom", "Equipment", "Studio"];
  return <PageShell eyebrow="CAMPUS INVENTORY" title={role === "Student" ? "Browse resources" : "Resource directory"} description={role === "Student" ? "Choose a date and time to check availability before requesting." : "Monitor current status and explore each resource’s schedule."}>
    <div className="catalog-toolbar"><label className="search-field"><Glyph symbol="⌕" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or location" aria-label="Search resources" /></label><div className="filter-buttons" aria-label="Filter resource type">{resourceTypes.map((type) => <button key={type} className={typeFilter === type ? "filter-button active-filter" : "filter-button"} onClick={() => setTypeFilter(type)}>{type}</button>)}</div></div>
    <div className="resource-grid">{resources.map((resource) => <ResourceCard key={resource.id} resource={resource} onBook={onBook} />)}</div>{resources.length === 0 && <div className="empty-inline"><strong>No matching resources</strong><span>Try a different name or category.</span></div>}
  </PageShell>;
}

function ResourceCard({ resource, onBook }) {
  const bookable = resource.state !== "Maintenance";
  return <article className="catalog-card"><div className="catalog-top"><span className="catalog-icon"><Glyph symbol={resource.icon} /></span><span className={`resource-state ${resource.state === "Available" ? "state-available" : resource.state === "Maintenance" ? "state-maintenance" : "state-busy"}`}><i />{resource.state}</span></div><span className="catalog-type">{resource.type}</span><h3>{resource.name}</h3><p className="catalog-location"><Glyph symbol="⌖" /> {resource.location}</p><div className="catalog-meta"><span>{resource.capacity}</span><span>Availability by time slot</span></div><button className={`catalog-book ${bookable ? "" : "disabled-book"}`} disabled={!bookable} onClick={() => onBook(resource)}>{bookable ? "Check availability" : "Under maintenance"}<span>{bookable ? "→" : "·"}</span></button></article>;
}

function BookingsPage({ role, requests, onCancel }) {
  const visible = role === "Student" ? requests.filter((item) => item.student === roleDetails.Student.name) : role === "HOD" ? requests.filter((item) => ["Awaiting admin", "Approved", "Rejected", "Cancelled"].includes(item.status)) : requests;
  return <PageShell eyebrow={role === "Student" ? "YOUR ACTIVITY" : "BOOKING RECORDS"} title={role === "Student" ? "My bookings" : role === "HOD" ? "Approval history" : "All bookings"} description={role === "Student" ? "Every request, approval, and queue position in one place." : "Track requests across every department and approval stage."}>
    <div className="booking-list">{visible.map((item) => <article className="booking-row" key={item.id}><span className="booking-resource-symbol"><Glyph symbol="⌘" /></span><div className="booking-main"><div className="booking-title-row"><h3>{item.resource}</h3><StatusBadge status={item.status} queue={item.queue} /></div><div className="booking-details"><span><Glyph symbol="◷" size={12} /> {item.date}</span><span><Glyph symbol="◷" size={12} /> {item.slot}</span>{role !== "Student" && <span>{item.student} · {item.department}</span>}</div><p className="booking-purpose">Purpose: {item.purpose}</p><ApprovalTrack status={item.status} /></div>{role === "Student" && !["Cancelled", "Rejected"].includes(item.status) && <button className="cancel-button" onClick={() => onCancel(item.id)}>Cancel request</button>}</article>)}{visible.length === 0 && <div className="empty-inline"><strong>No bookings to show</strong><span>Submit a resource request to see it here.</span></div>}</div>
  </PageShell>;
}

function ApprovalTrack({ status }) {
  const stages = ["Submitted", "HOD review", "Admin review", "Confirmed"];
  const active = status === "Awaiting HOD" ? 1 : status === "Awaiting admin" ? 2 : status === "Approved" ? 4 : status === "Rejected" ? 0 : status === "Waitlisted" ? 1 : 1;
  if (["Rejected", "Cancelled"].includes(status)) return <div className={`terminal-note ${statusClass(status)}`}>{status === "Rejected" ? "Request was declined" : "Request cancelled"}</div>;
  if (status === "Waitlisted") return <div className="terminal-note waitlisted">Waiting for a slot · approval begins when available</div>;
  return <div className="approval-track" aria-label={`Approval progress: ${status}`}><span className="track-label">APPROVAL PROGRESS</span><div className="track-steps">{stages.map((stage, index) => <div className={`track-step ${index < active ? "done" : index === active ? "current" : ""}`} key={stage}><i />{stage}</div>)}</div></div>;
}

function WaitlistPage({ role, requests, onCancel }) {
  const waiting = role === "Student" ? requests.filter((item) => item.student === roleDetails.Student.name && item.status === "Waitlisted") : requests.filter((item) => item.status === "Waitlisted");
  const grouped = Object.groupBy ? Object.groupBy(waiting, (item) => `${item.resource}|${item.date}|${item.slot}`) : waiting.reduce((groups, item) => { const key = `${item.resource}|${item.date}|${item.slot}`; groups[key] = [...(groups[key] || []), item]; return groups; }, {});
  return <PageShell eyebrow="SLOT QUEUE" title={role === "Student" ? "My waiting list" : "Waiting list"} description={role === "Student" ? "See your queue position and withdraw at any time." : "Queue order is preserved for each resource and requested time."}>
    <div className="waitlist-summary"><div className="queue-summary-icon"><Glyph symbol="≋" /></div><div><strong>{waiting.length} {role === "Student" ? "requests" : "students"} in the queue</strong><span>Students are not auto-confirmed when a slot opens. Each request returns to HOD review.</span></div></div>
    <div className="queue-groups">{Object.entries(grouped).map(([key, items]) => { const [resource, date, slot] = key.split("|"); return <section className="panel queue-panel" key={key}><div className="queue-heading"><div><span className="catalog-type">RESOURCE &amp; SLOT</span><h2>{resource}</h2><p>{date} · {slot}</p></div><span className="queue-count">{items.length} in queue</span></div><div className="queue-rows">{items.map((item, index) => <div className="queue-row" key={item.id}><span className={`queue-position ${index === 0 ? "first-position" : ""}`}>{index + 1}</span><span className="avatar table-avatar">{item.initials}</span><span className="queue-person"><strong>{item.student}</strong><small>{item.department} · {item.submitted}</small></span>{role !== "Student" && <StatusBadge status="Waitlisted" queue={index + 1} />}{role === "Student" && <button className="cancel-button" onClick={() => onCancel(item.id)}>Leave queue</button>}</div>)}</div></section>; })}
    {waiting.length === 0 && <div className="empty-inline"><span className="empty-symbol"><Glyph symbol="✓" /></span><div><strong>No one is waiting</strong><span>When a requested slot is full, students can join its queue instead.</span></div></div>}</div>
  </PageShell>;
}

function SchedulePage({ slots, onToggle }) {
  return <PageShell eyebrow="OPERATING HOURS" title="Time slot schedule" description="Manage the standard campus booking windows. Disabled slots won’t be offered to students.">
    <div className="schedule-toolbar"><div><span className="schedule-date-icon"><Glyph symbol="▤" /></span><span><strong>North Campus · Standard day</strong><small>Monday – Friday · 09:00 AM – 05:00 PM</small></span></div><span className="filter-tag">{slots.filter((slot) => slot.enabled).length} active slots</span></div>
    <section className="panel schedule-panel"><div className="schedule-table-wrap"><table className="schedule-table"><thead><tr><th>SLOT</th><th>START</th><th>END</th><th>AVAILABILITY</th><th>STATUS</th></tr></thead><tbody>{slots.map((slot, index) => <tr key={slot.id}><td><span className="slot-number">{String(index + 1).padStart(2, "0")}</span>{slot.label}</td><td>{formatTime(slot.start)}</td><td>{formatTime(slot.end)}</td><td><span className={`slot-enabled ${slot.enabled ? "enabled" : "disabled"}`}><i />{slot.enabled ? "Available to request" : "Not offered"}</span></td><td><button className={`toggle-switch ${slot.enabled ? "on" : ""}`} onClick={() => onToggle(slot.id)} role="switch" aria-checked={slot.enabled} aria-label={`${slot.enabled ? "Disable" : "Enable"} ${slot.label}`}><i /></button></td></tr>)}</tbody></table></div><div className="schedule-footnote"><span>i</span><p>These are example campus hours. Resource-specific schedules and maintenance blocks can be configured in a connected backend.</p></div></section>
  </PageShell>;
}

function clockToMinutes(value) {
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hours += 12;
  return hours * 60 + Number(match[2]);
}

function formatClock(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return new Date(2026, 0, 1, hours, minutes).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function parseSlotRange(slot) {
  const [start, end] = slot.split("–").map((value) => value.trim());
  if (!start || !end) return null;
  const startMinutes = clockToMinutes(start);
  const endMinutes = clockToMinutes(end);
  return endMinutes > startMinutes ? { start: startMinutes, end: endMinutes } : null;
}

function formatTime(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return formatClock(hours * 60 + minutes);
}

function PageShell({ eyebrow, title, description, children }) {
  return <section className="page-shell"><div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div></div>{children}</section>;
}

function BookingModal({ resource, slots, onClose, onSubmit }) {
  const activeSlots = slots.filter((slot) => slot.enabled);
  const defaultSlot = activeSlots.find((slot) => slot.label === "10:00 AM – 11:00 AM")?.label ?? activeSlots[0]?.label;
  const [selectedStart, setSelectedStart] = useState(defaultSlot?.split("–")[0]?.trim() ?? "09:00 AM");
  const maxDuration = Math.max(1, Math.min(4, Math.floor((17 * 60 - clockToMinutes(selectedStart)) / 60)));
  return <div className="modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title"><button className="modal-close" onClick={onClose} aria-label="Close booking form"><Glyph symbol="×" size={15} /></button><span className="catalog-icon modal-resource-icon"><Glyph symbol={resource.icon} /></span><div className="eyebrow">NEW BOOKING REQUEST</div><h2 id="booking-modal-title">{resource.name}</h2><p className="modal-description">This request will be sent to your department HOD before it reaches campus administration.</p><div className="modal-resource-meta"><span><Glyph symbol="⌖" size={12} /> {resource.location}</span><span>{resource.capacity}</span></div><form onSubmit={onSubmit}><label className="form-field">Date<input name="date" type="date" min="2026-10-29" defaultValue="2026-11-05" required /></label><div className="time-choice-row"><label className="form-field">Start time<select name="time" value={activeSlots.find((slot) => slot.label.startsWith(selectedStart))?.label ?? defaultSlot} onChange={(event) => setSelectedStart(event.target.value.split("–")[0].trim())} required>{activeSlots.map((slot) => <option key={slot.id} value={slot.label}>{slot.label.split("–")[0].trim()}</option>)}</select></label><label className="form-field">Duration<select name="duration" defaultValue="1">{Array.from({ length: maxDuration }, (_, index) => index + 1).map((hours) => <option key={hours} value={hours}>{hours} {hours === 1 ? "hour" : "hours"}</option>)}</select></label></div><label className="form-field">Purpose<textarea name="purpose" placeholder="Briefly describe what you need the resource for" minLength="8" required /></label><div className="approval-explainer"><span>1</span><span>Your HOD reviews the request</span><span className="explainer-arrow">→</span><span>2</span><span>Admin confirms availability</span></div><button className="button button-primary submit-request" type="submit">Submit for approval <Glyph symbol="→" size={12} /></button></form></section></div>;
}

function RequestDetailModal({ request, onClose }) {
  const hodApproved = request.hodRemark || ["Awaiting admin", "Approved"].includes(request.status);
  const adminApproved = request.adminRemark || request.status === "Approved";
  return <div className="modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="booking-modal detail-modal" role="dialog" aria-modal="true" aria-labelledby="request-detail-title"><button className="modal-close" onClick={onClose} aria-label="Close request details"><Glyph symbol="×" size={15} /></button><div className="eyebrow">BOOKING REQUEST · {request.id}</div><h2 id="request-detail-title">{request.resource}</h2><div className="detail-status"><StatusBadge status={request.status} queue={request.queue} /></div><div className="detail-grid"><div><span>Requested by</span><strong>{request.student}</strong></div><div><span>Department</span><strong>{request.department}</strong></div><div><span>Date</span><strong>{request.date}</strong></div><div><span>Time slot</span><strong>{request.slot}</strong></div><div className="detail-purpose"><span>Purpose</span><strong>{request.purpose}</strong></div></div><div className="detail-history"><span className="track-label">APPROVAL HISTORY</span><div className="history-stage"><i className="history-done" /><div><strong>Request submitted</strong><small>{request.submitted}</small></div><span className="history-state">Received</span></div><div className="history-stage"><i className={hodApproved ? "history-done" : ""} /><div><strong>Department HOD</strong><small>{request.hodRemark || (request.status === "Awaiting HOD" ? "Decision pending" : "Waiting for HOD review")}</small></div><span className="history-state">{request.status === "Awaiting HOD" ? "Pending" : hodApproved ? "Reviewed" : "—"}</span></div><div className="history-stage"><i className={adminApproved ? "history-done" : ""} /><div><strong>Campus admin</strong><small>{request.adminRemark || (request.status === "Awaiting admin" ? "Decision pending" : "After HOD approval")}</small></div><span className="history-state">{request.status === "Awaiting admin" ? "Pending" : adminApproved ? "Reviewed" : "—"}</span></div></div><button className="button button-primary detail-close" onClick={onClose}>Done</button></section></div>;
}

export default App;
