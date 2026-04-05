import { Button } from "@/components/ui/button";

interface BookPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number, maxVisible: number) {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(0, current - half);
  let end = start + maxVisible - 1;

  if (end >= total) {
    end = total - 1;
    start = end - maxVisible + 1;
  }

  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
}

function PageButtons({
  pages,
  currentPage,
  onPageChange,
}: {
  pages: number[];
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <>
      {pages.map((p) => (
        <Button
          key={p}
          variant={p === currentPage ? "default" : "ghost"}
          size="icon"
          onClick={() => onPageChange(p)}
        >
          {p + 1}
        </Button>
      ))}
    </>
  );
}

export default function BookPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BookPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <>
      {/* 모바일: 3개 */}
      <nav className="flex items-center justify-center gap-1 py-4 md:hidden">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          이전
        </Button>
        <PageButtons
          pages={getPageNumbers(currentPage, totalPages, 3)}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          다음
        </Button>
      </nav>

      {/* 데스크톱: 5개 */}
      <nav className="hidden items-center justify-center gap-1 py-4 md:flex">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          이전
        </Button>
        <PageButtons
          pages={getPageNumbers(currentPage, totalPages, 5)}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          다음
        </Button>
      </nav>
    </>
  );
}
