import './Sidebar.css';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: '▦' },
  { key: 'fleet', label: 'Fleet', icon: '▣', active: true },
  { key: 'maintenance', label: 'Maintenance', icon: '⌕' },
  { key: 'reports', label: 'Reports', icon: '□' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__brand-icon" aria-hidden="true">
          ▣
        </span>
        <div>
          <div className="sidebar__brand-title">VMS Pro</div>
          <div className="sidebar__brand-subtitle">Fleet Control Center</div>
        </div>
      </div>

      <button className="sidebar__new-entry" type="button">
        <span aria-hidden="true">+</span> New Entry
      </button>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`sidebar__nav-item ${item.active ? 'sidebar__nav-item--active' : ''}`}
          >
            <span className="sidebar__nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="sidebar__nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button type="button" className="sidebar__nav-item">
          <span className="sidebar__nav-icon" aria-hidden="true">
            ⚙
          </span>
          <span className="sidebar__nav-label">Settings</span>
        </button>
        <button type="button" className="sidebar__nav-item">
          <span className="sidebar__nav-icon" aria-hidden="true">
            ?
          </span>
          <span className="sidebar__nav-label">Support</span>
        </button>
      </div>
    </aside>
  );
}
