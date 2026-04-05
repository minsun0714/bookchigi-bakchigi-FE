import client from "@/api/client";

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
  const params: Record<string, string> = {
    page: String(page || 0),
    size: String(size),
  };
  if (query) params.query = query;

  const res = await client.get<PageResponse<Book>>("/books", { params });
  return res.data;
}

export async function fetchBook(isbn: string): Promise<Book> {
  const res = await client.get<Book>(`/books/${isbn}`);
  return res.data;
}
