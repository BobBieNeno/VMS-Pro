import './EmptyState.css';

export default function EmptyState({ hasSearch, onAddClick, onClearSearch }) {
  if (hasSearch) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon" aria-hidden="true">
          🔍
        </div>
        <h3 className="empty-state__title">ไม่พบข้อมูลที่ค้นหา</h3>
        <p className="empty-state__subtitle">ลองค้นหาด้วยคำอื่น หรือล้างคำค้นหา</p>
        <button type="button" className="empty-state__cta empty-state__cta--secondary" onClick={onClearSearch}>
          ล้างคำค้นหา
        </button>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        🚗
      </div>
      <h3 className="empty-state__title">ยังไม่มีข้อมูลรถยนต์</h3>
      <p className="empty-state__subtitle">เริ่มเพิ่มรถยนต์คันแรกของคุณได้เลย</p>
      <button type="button" className="empty-state__cta" onClick={onAddClick}>
        + เพิ่มรถยนต์คันแรก
      </button>
    </div>
  );
}
