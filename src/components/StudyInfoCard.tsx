import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  BookOpenIcon,
  CalendarIcon,
  DoorOpenIcon,
  GlobeIcon,
  LockIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";

import type { StudyDetail } from "@/api/studies";
import EnrollmentStatusBadge from "@/components/EnrollmentStatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function formatDateTime(iso: string) {
  return format(new Date(iso), "yyyy.MM.dd (EEE) HH:mm", { locale: ko });
}

interface StudyInfoCardProps {
  study: StudyDetail;
}

export default function StudyInfoCard({ study }: StudyInfoCardProps) {
  const navigate = useNavigate();
  const {
    id,
    name,
    isPublic,
    isCurrentUserLeader,
    members,
    maxMembers,
    enrollmentStart,
    enrollmentEnd,
    enrollmentStatus,
    description,
    createdAt,
    book,
  } = study;

  return (
    <Card className="overflow-hidden">
      {/* 책 표지 + 스터디 헤더 */}
      <div className="bg-muted/30 flex flex-col items-center gap-5 px-6 pt-8 pb-6 sm:flex-row sm:items-start">
        <div className="shrink-0">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="h-40 w-auto rounded-lg object-contain drop-shadow-lg"
            />
          ) : (
            <div className="bg-muted flex h-40 w-28 items-center justify-center rounded-lg">
              <BookOpenIcon className="text-muted-foreground size-10" />
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 text-center sm:text-left">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-foreground m-0 text-xl font-bold tracking-tight">
                {name}
              </h1>
              <p className="text-muted-foreground text-sm">
                {book.title} · {book.author}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {isCurrentUserLeader && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => navigate(`/studies/${id}/edit`)}
                >
                  <SettingsIcon className="size-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <EnrollmentStatusBadge status={enrollmentStatus} />
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                isPublic
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
              }`}
            >
              {isPublic ? (
                <GlobeIcon className="size-3" />
              ) : (
                <LockIcon className="size-3" />
              )}
              {isPublic ? "공개" : "비공개"}
            </span>
            <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              <UsersIcon className="size-3.5" />
              {members.length}/{maxMembers}명
            </span>
          </div>

          {enrollmentStart && enrollmentEnd && (
            <div className="text-muted-foreground mt-1 inline-flex items-center justify-center gap-1.5 text-xs sm:justify-start">
              <CalendarIcon className="size-3.5 shrink-0" />
              {formatDateTime(enrollmentStart)} ~ {formatDateTime(enrollmentEnd)}
            </div>
          )}
        </div>
      </div>

      {/* 설명 */}
      {description && (
        <div className="px-6 py-5">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Markdown>{description}</Markdown>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <div className="flex items-center justify-between px-6 pb-5">
        <span className="text-muted-foreground text-xs">
          생성일: {formatDateTime(createdAt)}
        </span>
        {study.isCurrentUserMember && (
          <Button
            onClick={() => navigate(`/studies/${id}/workspace`)}
          >
            <DoorOpenIcon className="size-5" />
            워크스페이스 입장
          </Button>
        )}
      </div>
    </Card>
  );
}
