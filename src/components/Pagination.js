import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const handleFirst = () => onPageChange(1);
  const handlePrev = () => onPageChange(currentPage - 1);
  const handleNext = () => onPageChange(currentPage + 1);
  const handleLast = () => onPageChange(totalPages);

  const pageRangeDisplayed = 3;
  let start = Math.max(currentPage - Math.floor(pageRangeDisplayed / 2), 1);
  let end = start + pageRangeDisplayed - 1;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(end - pageRangeDisplayed + 1, 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="d-flex justify-content-center mt-3">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={handleFirst}>
            &laquo;
          </button>
        </li>
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={handlePrev}>
            &lt;
          </button>
        </li>

        {pages.map((page) => (
          <li
            key={page}
            className={`page-item ${currentPage === page ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={handleNext}>
            &gt;
          </button>
        </li>
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={handleLast}>
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
}