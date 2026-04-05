import { Link } from "react-router-dom";

import type { Book } from "@/api/books";
import { Card } from "@/components/ui/card";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link to={`/books/${book.isbn}`} className="group no-underline">
      <Card className="h-full overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="bg-muted/50 flex items-center justify-center p-6">
          <img
            src={book.image}
            alt={book.title}
            className="h-44 w-auto rounded object-contain drop-shadow-md transition-transform group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col gap-1.5 p-4">
          <h3 className="text-foreground truncate text-sm font-semibold">
            {book.title}
          </h3>
          <p className="text-muted-foreground truncate text-xs">
            {book.author} · {book.publisher}
          </p>
          <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
            {book.description}
          </p>
        </div>
      </Card>
    </Link>
  );
}
