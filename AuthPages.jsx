import { useState } from "react";
import { ArrowRight, BookOpenCheck, Building2, Check, GraduationCap, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { DEMO_ACCOUNTS } from "./demo-accounts.js";

const portalCards = [
  { title: "Campus admin", text: "Manage resources, schedules, and final booking decisions.", icon: ShieldCheck },
  { title: "Department HOD", text: "Review requests from your department before campus approval.", icon: Building2 },
  { title: "Student", text: "Discover spaces, request bookings, and track every update.", icon: GraduationCap },
];

export function LandingPage({ onLogin }) {
  return (
    <main className="marketing-shell">
      <header className="marketing-header">
        <a className="marketing-brand" href="/" aria-label="Campus Resource Hub home">
          <span className="brand-mark">CR</span>
          <span><strong>Campus Resources</strong><small>RESOURCE HUB</small></span>
        </a>
        <nav className="marketing-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#portals">Portals</a>
        </nav>
        <button className="marketing-login-link" onClick={onLogin}>Sign in <ArrowRight size={15} aria-hidden="true" /></button>
      </header>

      <section className="landing-hero">
        <div className="landing-copy">
          <div className="landing-kicker"><span /> CAMPUS RESOURCE HUB</div>
          <h1>Campus resources,<br /><em>in sync.</em></h1>
          <p>One clear place to discover campus spaces, request what you need, and keep every approval moving.</p>
          <div className="landing-actions">
            <button className="button button-primary landing-primary" onClick={onLogin}>Sign in to your portal <ArrowRight size={15} aria-hidden="true" /></button>
            <a className="landing-secondary" href="#how-it-works">Explore the workflow</a>
          </div>
          <div className="landing-proof"><span className="proof-icon"><Check size={13} aria-hidden="true" /></span><span>Built for students, departments, and campus teams</span></div>
        </div>

        <div className="hero-preview" aria-label="Preview of the campus resource dashboard">
          <div className="preview-orbit orbit-one" /><div className="preview-orbit orbit-two" />
          <div className="preview-window">
            <div className="preview-window-top"><span className="preview-dots"><i /><i /><i /></span><span>North Campus · Resource Hub</span><span className="preview-live"><i /> LIVE</span></div>
            <div className="preview-window-body">
              <div className="preview-eyebrow">THURSDAY, NOV 05</div>
              <div className="preview-heading">Your campus, at a glance</div>
              <div className="preview-metrics">
                <div><span>Resources</span><strong>24</strong><small>Across campus</small></div>
                <div><span>Available now</span><strong>18</strong><small>Ready to request</small></div>
                <div><span>In review</span><strong>06</strong><small>Moving forward</small></div>
              </div>
              <div className="preview-request">
                <div className="preview-request-icon"><BookOpenCheck size={16} aria-hidden="true" /></div>
                <div className="preview-request-copy"><strong>AI &amp; Data Science Lab</strong><span>Nov 05 · 10:00 AM – 12:00 PM</span></div>
                <span className="status-badge hod-pending">Awaiting HOD</span>
              </div>
              <div className="preview-request preview-request-secondary">
                <div className="preview-request-icon"><Building2 size={16} aria-hidden="true" /></div>
                <div className="preview-request-copy"><strong>Seminar Room 3</strong><span>Nov 06 · 01:00 PM – 03:00 PM</span></div>
                <span className="status-badge approved">Approved</span>
              </div>
            </div>
            <div className="preview-window-footer"><span><i /> APPROVAL FLOW</span><div><b /><b /><b /></div><span>Student <ArrowRight size={11} aria-hidden="true" /> HOD <ArrowRight size={11} aria-hidden="true" /> Admin</span></div>
          </div>
          <div className="preview-float"><span className="preview-float-icon"><Check size={14} aria-hidden="true" /></span><span><strong>Request approved</strong><small>Everything in one flow</small></span></div>
        </div>
      </section>

      <section className="workflow-section" id="how-it-works">
        <div className="section-heading"><span className="section-kicker">A SHARED WORKFLOW</span><h2>From request to ready.</h2><p>Every person sees the next right step, with one connected view of campus resources.</p></div>
        <div className="workflow-steps">
          <article><span className="step-number">01</span><div className="step-icon"><UserRound size={17} aria-hidden="true" /></div><h3>Find what you need</h3><p>Students browse current spaces and equipment, then choose a time that works.</p></article>
          <article><span className="step-number">02</span><div className="step-icon"><GraduationCap size={17} aria-hidden="true" /></div><h3>Review together</h3><p>Department heads review requests first, keeping approvals in the right hands.</p></article>
          <article><span className="step-number">03</span><div className="step-icon"><ShieldCheck size={17} aria-hidden="true" /></div><h3>Keep campus moving</h3><p>Campus admins confirm schedules and students can follow the outcome.</p></article>
        </div>
      </section>

      <section className="portals-section" id="portals">
        <div className="section-heading portals-heading"><span className="section-kicker">THREE PURPOSE-BUILT SPACES</span><h2>One hub. The right view for everyone.</h2></div>
        <div className="portal-cards">{portalCards.map(({ title, text, icon: Icon }) => <article className="portal-card" key={title}><div className="portal-card-icon"><Icon size={18} aria-hidden="true" /></div><h3>{title}</h3><p>{text}</p><button onClick={onLogin}>Open portal <ArrowRight size={13} aria-hidden="true" /></button></article>)}</div>
      </section>

      <footer className="marketing-footer"><a className="marketing-brand" href="/" aria-label="Campus Resource Hub home"><span className="brand-mark">CR</span><span><strong>Campus Resources</strong><small>RESOURCE HUB</small></span></a><span>North Campus · Academic year 2026–27</span><span>Campus Resource Hub</span></footer>
    </main>
  );
}

export function LoginPage({ onLogin, onHome, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = (event) => {
    event.preventDefault();
    onLogin(email.trim().toLowerCase(), password);
  };

  return (
    <main className="auth-shell">
      <header className="auth-header">
        <button className="marketing-brand auth-brand-button" onClick={onHome} aria-label="Return to home"><span className="brand-mark">CR</span><span><strong>Campus Resources</strong><small>RESOURCE HUB</small></span></button>
        <span className="auth-header-note"><LockKeyhole size={14} aria-hidden="true" /> Mock prototype access</span>
      </header>
      <div className="auth-layout">
        <section className="auth-intro"><span className="section-kicker">WELCOME TO NORTH CAMPUS</span><h1>Your campus,<br /><em>in one place.</em></h1><p>Sign in to continue to your role-specific workspace. Use one of the demo accounts to explore the connected booking flow.</p><div className="auth-benefits"><span><Check size={14} aria-hidden="true" /> Shared resource availability</span><span><Check size={14} aria-hidden="true" /> Clear, role-based approvals</span><span><Check size={14} aria-hidden="true" /> Booking updates in one view</span></div><div className="auth-accent-line" /></section>
        <section className="login-card" aria-labelledby="login-title">
          <div className="login-card-heading"><span className="login-icon"><LockKeyhole size={17} aria-hidden="true" /></span><div><span className="section-kicker">PORTAL ACCESS</span><h2 id="login-title">Sign in</h2></div></div>
          <p className="login-description">Enter your demo credentials to open the matching dashboard.</p>
          <form className="login-form" onSubmit={submitLogin}>
            <label className="auth-field"><span>Email address</span><div><Mail size={15} aria-hidden="true" /><input type="email" autoComplete="username" placeholder="you@campus.edu" value={email} onChange={(event) => setEmail(event.target.value)} required /></div></label>
            <label className="auth-field"><span>Password</span><div><LockKeyhole size={15} aria-hidden="true" /><input type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div></label>
            {error && <p className="login-error" role="alert">{error}</p>}
            <button className="button button-primary login-submit" type="submit">Continue to dashboard <ArrowRight size={15} aria-hidden="true" /></button>
          </form>
          <div className="demo-access"><div className="demo-access-heading"><span>DEMO ACCOUNTS</span><small>Choose to fill the form</small></div>{DEMO_ACCOUNTS.map((account) => <button className="demo-account" type="button" key={account.role} onClick={() => { setEmail(account.email); setPassword(account.password); }}><span className="demo-role-icon">{account.role === "Admin" ? <ShieldCheck size={15} aria-hidden="true" /> : account.role === "HOD" ? <Building2 size={15} aria-hidden="true" /> : <GraduationCap size={15} aria-hidden="true" />}</span><span className="demo-account-copy"><strong>{account.role}</strong><small>{account.email}</small></span><span className="demo-use">Use demo <ArrowRight size={11} aria-hidden="true" /></span></button>)}</div>
          <p className="mock-disclaimer">Prototype only. These sample credentials are not connected to a real identity provider.</p>
        </section>
      </div>
      <footer className="auth-footer"><button onClick={onHome}>← Back to home</button><span>Campus Resource Hub · 2026</span></footer>
    </main>
  );
}
