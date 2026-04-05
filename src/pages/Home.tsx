import { useQuery } from "@tanstack/react-query";
import { BookOpenIcon } from "lucide-react";
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
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10">
      <div className="text-center">
        <h1 className="text-foreground m-0 text-2xl font-bold tracking-tight md:text-3xl">
          어떤 책을 찾고 계신가요?
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          함께 읽고 토론할 스터디를 만들어보세요
        </p>
      </div>

      <SearchBar onSearch={handleSearch} defaultValue={query} />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }, (_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : !data || data.content.length === 0 ? (
        <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-3 py-20">
          <BookOpenIcon className="size-12 opacity-30" />
          <p className="text-base">
            {query
              ? `"${query}"에 대한 검색 결과가 없습니다`
              : "책을 검색해보세요"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
