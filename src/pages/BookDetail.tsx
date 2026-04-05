import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, LockIcon, PlusIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchBook } from "@/api/books";
import LoginModal from "@/components/LoginModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StudyList from "@/components/StudyList";
import { useAuth } from "@/hooks/useAuth";

export default function BookDetail() {
  const { isbn } = useParams<{ isbn: string }>();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", isbn],
    queryFn: () => fetchBook(isbn!),
    enabled: !!isbn,
  });

  if (!isbn) return null;

  const handleCreateStudy = () => {
    if (isLoggedIn) {
      navigate(`/books/${isbn}/studies/new`);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8">
      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        icon={<LockIcon className="text-muted-foreground size-12 opacity-40" />}
        message="스터디를 등록하려면 로그인이 필요합니다"
        redirectPath={`/books/${isbn}/studies/new`}
      />

      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="self-start"
      >
        <ArrowLeftIcon className="size-4" />
        돌아가기
      </Button>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col gap-6 p-6 sm:flex-row">
            <Skeleton className="mx-auto h-64 w-44 shrink-0 rounded-lg sm:mx-0" />
            <div className="flex flex-1 flex-col gap-3">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ) : book ? (
          <div className="flex flex-col sm:flex-row">
            <div className="bg-muted/50 flex shrink-0 items-center justify-center p-8">
              <img
                src={book.image}
                alt={book.title}
                className="h-64 w-auto rounded-lg object-contain drop-shadow-md"
              />
            </div>
            <div className="flex flex-col justify-center gap-3 p-6">
              <h1 className="text-foreground m-0 text-xl font-bold leading-tight tracking-tight">
                {book.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {book.author}
                </span>
                <span className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {book.publisher}
                </span>
                <span className="text-muted-foreground text-xs">
                  {book.pubDate}
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {book.description}
              </p>
            </div>
          </div>
        ) : null}
      </Card>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-foreground m-0 text-lg font-bold">스터디</h2>
          <Button size="sm" onClick={handleCreateStudy}>
            <PlusIcon className="size-4" />
            스터디 등록
          </Button>
        </div>
        <StudyList isbn={isbn} />
      </section>
    </div>
  );
}
