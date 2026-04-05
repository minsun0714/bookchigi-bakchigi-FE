import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { fetchBooks } from "@/api/books";
import BookCard from "@/components/BookCard";
import BookCardSkeleton from "@/components/BookCardSkeleton";
import BookPagination from "@/components/BookPagination";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 0;

  const { data, isLoading } = useQuery({
    queryKey: ["books", query, page],
    queryFn: () => fetchBooks(query, page),
  });

  const handleSearch = (newQuery: string) => {
    setSearchParams(newQuery ? { query: newQuery } : {});
  };

  const handlePageChange = (newPage: number) => {
    const params: Record<string, string> = {};
    if (query) params.query = query;
    if (newPage > 0) params.page = String(newPage);
    setSearchParams(params);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 py-8">
      <SearchBar onSearch={handleSearch} defaultValue={query} />

      {isLoading ? (
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }, (_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : !data || data.content.length === 0 ? (
        <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-2">
          <span className="text-4xl">📚</span>
          <p className="text-lg">
            {query
              ? `"${query}"에 대한 검색 결과가 없습니다`
              : "책을 검색해보세요"}
          </p>
        </div>
      ) : (
        <>
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-3">
            {data.content.map((book) => (
              <BookCard key={book.isbn} book={book} />
            ))}
          </div>
          <BookPagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
