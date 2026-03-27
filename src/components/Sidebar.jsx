export default function Sidebar({ user, view, onNavigate, onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">Invoicer</div>
        <div className="sidebar-user">{user.email}</div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${view === "dashboard" ? "active" : ""}`}
          onClick={() => onNavigate("dashboard")}
        >
          <span className="nav-icon">◈</span> Dashboard
        </button>
        <button className="nav-item" onClick={() => onNavigate("new")}>
          <span className="nav-icon">✦</span> New Invoice
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="btn-logout" onClick={onLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
