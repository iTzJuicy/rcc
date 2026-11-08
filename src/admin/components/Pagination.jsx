export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
}) {
  if (totalPages <= 1 && !onPageSizeChange) return null;

  return (
    <div className="admin-pagination" aria-label="Pagination">
      <span className="admin-pagination-summary">
        {totalItems} item{totalItems === 1 ? "" : "s"}
      </span>
      {onPageSizeChange && (
        <label className="admin-pagination-size">
          Per page
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
            {[10, 20, 50].map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
      )}
      <div className="admin-pagination-controls">
        <button type="button" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} aria-label="Previous page">
          <i className="fa-solid fa-chevron-left" />
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button type="button" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)} aria-label="Next page">
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
    </div>
  );
}
