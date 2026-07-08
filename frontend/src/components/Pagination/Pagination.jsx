import './Pagination.css';

export default function Pagination({ currentPage, totalPages, totalItems, pageSize, onPageChange }) {
  if (totalItems === 0) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="pagination">
      <span className="pagination__summary">
        แสดง {start}-{end} จาก {totalItems} รายการ
      </span>

      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="หน้าก่อนหน้า"
        >
          ‹
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            type="button"
            className={`pagination__btn ${page === currentPage ? 'pagination__btn--active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          className="pagination__btn"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="หน้าถัดไป"
        >
          ›
        </button>
      </div>
    </div>
  );
}
