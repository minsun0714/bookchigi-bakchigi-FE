import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  CalendarIcon,
  GlobeIcon,
  LockIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import Markdown from "react-markdown";
import { Link, useSearchParams } from "react-router-dom";

import { fetchStudies } from "@/api/studies";
import BookPagination from "@/components/BookPagination";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StudyListProps {
  isbn: string;
}

function formatDateTime(iso: string) {
  return format(new Date(iso), "yyyy.MM.dd HH:mm", { locale: ko });
}

export default function StudyList({ isbn }: StudyListProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 0;

  const { data, isLoading } = useQuery({
    queryKey: ["studies", isbn, page],
    queryFn: () => fetchStudies(isbn, page),
  });

  const handlePageChange = (newPage: number) => {
    const params: Record<string, string> = {};
    if (newPage > 0) params.page = String(newPage);
    setSearchParams(params);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i}>
            <CardContent className="flex flex-col gap-3 p-5">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data || data.content.length === 0) {
    return (
      <Card>
        <CardContent className="text-muted-foreground flex flex-col items-center gap-2 py-12 text-center">
          <UsersIcon className="size-8 opacity-30" />
          <p className="text-sm">아직 등록된 스터디가 없습니다</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {data.content.map((study) => (
        <Link
          key={study.id}
          to={`/studies/${study.id}`}
          className="no-underline"
        >
          <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-5">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-foreground text-base font-semibold">
                {study.name}
              </h4>
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  study.isPublic
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                }`}
              >
                {study.isPublic ? (
                  <GlobeIcon className="size-3" />
                ) : (
                  <LockIcon className="size-3" />
                )}
                {study.isPublic ? "공개" : "비공개"}
              </span>
            </div>
            {study.description && (
              <div className="text-muted-foreground prose prose-sm dark:prose-invert mt-2 line-clamp-2 max-w-none">
                <Markdown>{study.description}</Markdown>
              </div>
            )}
            <div className="text-muted-foreground mt-3 flex flex-wrap gap-4 text-xs">
              <span className="inline-flex items-center gap-1">
                <UserIcon className="size-3.5" />
                {study.creatorNickname}
              </span>
              <span className="inline-flex items-center gap-1">
                <UsersIcon className="size-3.5" />
                최대 {study.maxMembers}명
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarIcon className="size-3.5" />
                {formatDateTime(study.enrollmentStart)} ~{" "}
                {formatDateTime(study.enrollmentEnd)}
              </span>
            </div>
          </CardContent>
          </Card>
        </Link>
      ))}
      <BookPagination
        currentPage={data.page}
        totalPages={data.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
