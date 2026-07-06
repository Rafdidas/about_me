"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onChange?: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="c-pagination" aria-label="페이지네이션">
      <button type="button" onClick={() => onChange?.(currentPage - 1)} disabled={!onChange || currentPage <= 1}>
        이전
      </button>
      <div className="c-pagination__pages">
        {pages.map((page) => (
          <button type="button" key={page} aria-current={page === currentPage ? "page" : undefined} onClick={() => onChange?.(page)} disabled={!onChange}>
            {page}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => onChange?.(currentPage + 1)} disabled={!onChange || currentPage >= totalPages}>
        다음
      </button>
    </nav>
  );
}
