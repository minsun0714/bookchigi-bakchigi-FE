const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Book {
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  image: string;
  description: string;
  pubDate: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

export async function fetchBooks(
  query: string,
  page: number,
  size: number = 12,
): Promise<PageResponse<Book>> {
  const params = new URLSearchParams({
    page: String(page || 0),
    size: String(size),
  });
  if (query) params.set("query", query);

  const res = await fetch(`${API_BASE_URL}/books?${params}`);
  if (!res.ok) throw new Error("책 목록을 불러오는데 실패했습니다");
  return res.json();
}
