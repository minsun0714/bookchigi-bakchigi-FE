import { BookOpenIcon } from "lucide-react";

import type { Book } from "@/api/books";
import { Card, CardContent } from "@/components/ui/card";

interface StudyBookCardProps {
  book: Book;
}

export default function StudyBookCard({ book }: StudyBookCardProps) {
  const { image, title, author, publisher } = book;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row">
        <div className="bg-muted/50 flex shrink-0 items-center justify-center rounded-lg p-6">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-52 w-auto rounded-lg object-contain drop-shadow-md"
            />
          ) : (
            <BookOpenIcon className="text-muted-foreground size-16" />
          )}
        </div>
        <div className="flex flex-col gap-1.5 text-center sm:text-left">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            스터디 도서
          </p>
          <h3 className="text-foreground text-base font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">
            {author} · {publisher}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
