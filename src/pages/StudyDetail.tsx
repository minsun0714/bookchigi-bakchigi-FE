import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  CalendarIcon,
  GlobeIcon,
  LockIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import Markdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";

import { fetchStudy } from "@/api/studies";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function formatDateTime(iso: string) {
  return format(new Date(iso), "yyyy.MM.dd (EEE) HH:mm", { locale: ko });
}

export default function StudyDetail() {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();

  const { data: study, isLoading } = useQuery({
    queryKey: ["study", studyId],
    queryFn: () => fetchStudy(Number(studyId)),
    enabled: !!studyId,
  });

  if (!studyId) return null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="self-start"
      >
        <ArrowLeftIcon className="size-4" />
        돌아가기
      </Button>

      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <Skeleton className="h-7 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ) : study ? (
        <>
          {/* 스터디 정보 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-foreground m-0 text-xl font-bold tracking-tight">
                  {study.name}
                </h1>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
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

              {/* 메타 정보 */}
              <div className="text-muted-foreground mt-4 flex flex-wrap gap-4 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <UserIcon className="size-4" />
                  {study.creatorNickname}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <UsersIcon className="size-4" />
                  최대 {study.maxMembers}명
                </span>
              </div>

              {/* 모집 기간 */}
              {study.enrollmentStart && study.enrollmentEnd && (
                <div className="bg-muted/50 mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm">
                  <CalendarIcon className="text-muted-foreground size-4 shrink-0" />
                  <span>
                    <span className="text-muted-foreground">모집 기간</span>{" "}
                    <span className="text-foreground font-medium">
                      {formatDateTime(study.enrollmentStart)} ~{" "}
                      {formatDateTime(study.enrollmentEnd)}
                    </span>
                  </span>
                </div>
              )}

              {/* 설명 */}
              {study.description && (
                <div className="prose prose-sm dark:prose-invert mt-5 max-w-none border-t pt-5">
                  <Markdown>{study.description}</Markdown>
                </div>
              )}

              <p className="text-muted-foreground mt-4 text-xs">
                생성일: {formatDateTime(study.createdAt)}
              </p>
            </CardContent>
          </Card>

          {/* 연결된 책 */}
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row">
              <div className="bg-muted/50 flex shrink-0 items-center justify-center rounded-lg p-6">
                {study.book.image ? (
                  <img
                    src={study.book.image}
                    alt={study.book.title}
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
                <h3 className="text-foreground text-base font-semibold">
                  {study.book.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {study.book.author} · {study.book.publisher}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
