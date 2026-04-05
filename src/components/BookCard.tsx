import type { Book } from "@/api/books";
import { Card, CardContent } from "@/components/ui/card";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex flex-col p-4">
        <img
          src={book.image}
          alt={book.title}
          className="mx-auto h-48 w-auto rounded-md object-contain"
        />
        <div className="mt-3 flex min-w-0 flex-col text-left">
          <h3 className="truncate text-base font-semibold">{book.title}</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {book.author} · {book.publisher}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">{book.pubDate}</p>
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
            {book.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
