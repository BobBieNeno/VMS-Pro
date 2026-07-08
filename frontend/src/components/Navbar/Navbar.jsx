import './Navbar.css';

export default function Navbar({ search, onSearchChange, onAddClick }) {
  return (
    <header className="navbar">
      <div className="navbar__mobile-profile" aria-hidden="true">
        <span>👤</span>
      </div>

      <div className="navbar__mobile-title">VMS Pro</div>

      <div className="navbar__search">
        <span className="navbar__search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ค้นหาทะเบียนรถ หรือ ยี่ห้อ..."
          aria-label="ค้นหารถยนต์"
        />
      </div>

      <nav className="navbar__tabs" aria-label="Section navigation">
        <span className="navbar__tab navbar__tab--active">Fleet</span>
        <span className="navbar__tab">Logistics</span>
        <span className="navbar__tab">Staff</span>
      </nav>

      <button type="button" className="navbar__add-btn" onClick={onAddClick}>
        <span aria-hidden="true">+</span> เพิ่มรถยนต์ใหม่
      </button>

      <button type="button" className="navbar__mobile-bell" aria-label="การแจ้งเตือน">
        ♡
      </button>
    </header>
  );
}
