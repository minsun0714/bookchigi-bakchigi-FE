import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  CalendarIcon,
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
import { Card, CardContent } from "@/components/ui/card";

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
  } = study;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-foreground m-0 text-xl font-bold tracking-tight">
            {name}
          </h1>
          <div className="flex shrink-0 items-center gap-2">
            {isCurrentUserLeader && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => navigate(`/studies/${id}/edit`)}
              >
                <SettingsIcon className="size-4" />
              </Button>
            )}
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
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <EnrollmentStatusBadge status={enrollmentStatus} />
          <span className="text-muted-foreground inline-flex items-center gap-1.5">
            <UsersIcon className="size-4" />
            {members.length} / {maxMembers}명
          </span>
        </div>

        {enrollmentStart && enrollmentEnd && (
          <div className="bg-muted/50 mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm">
            <CalendarIcon className="text-muted-foreground size-4 shrink-0" />
            <span>
              <span className="text-muted-foreground">모집 기간</span>{" "}
              <span className="text-foreground font-medium">
                {formatDateTime(enrollmentStart)} ~{" "}
                {formatDateTime(enrollmentEnd)}
              </span>
            </span>
          </div>
        )}

        {description && (
          <div className="prose prose-sm dark:prose-invert mt-5 max-w-none border-t pt-5">
            <Markdown>{description}</Markdown>
          </div>
        )}

        <p className="text-muted-foreground mt-4 text-xs">
          생성일: {formatDateTime(createdAt)}
        </p>
      </CardContent>
    </Card>
  );
}
