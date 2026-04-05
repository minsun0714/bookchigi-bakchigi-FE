import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  BookOpenIcon,
  CalendarIcon,
  CrownIcon,
  GlobeIcon,
  LockIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { MyStudy } from "@/api/studies";
import { fetchMyStudies } from "@/api/studies";
import EnrollmentStatusBadge from "@/components/EnrollmentStatusBadge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : format(d, "yyyy.MM.dd HH:mm", { locale: ko });
}

function StudyAccordion({
  studies,
  showEdit,
}: {
  studies: MyStudy[];
  showEdit: boolean;
}) {
  const navigate = useNavigate();

  return (
    <Accordion className="flex flex-col gap-2">
      {studies.map((study) => {
        const {
          id,
          name,
          isPublic,
          maxMembers,
          book,
          enrollmentStart,
          enrollmentEnd,
          enrollmentStatus,
        } = study;

        return (
          <AccordionItem
            key={id}
            value={String(id)}
            className="overflow-hidden rounded-lg border px-4"
          >
            <AccordionTrigger className="min-w-0 gap-3 py-3 hover:no-underline">
              <div className="flex min-w-0 items-center gap-3 overflow-hidden">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-10 w-auto shrink-0 rounded object-contain"
                  />
                ) : (
                  <BookOpenIcon className="text-muted-foreground size-8 shrink-0" />
                )}
                <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                  <div className="flex w-full min-w-0 items-center gap-2">
                    <span className="text-foreground min-w-0 truncate text-sm font-medium">
                      {name}
                    </span>
                    <EnrollmentStatusBadge status={enrollmentStatus} />
                  </div>
                  <span className="text-muted-foreground w-full min-w-0 truncate text-xs">
                    {book.title}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-3 pb-2 pt-1">

                <div className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-2 text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    {isPublic ? (
                      <GlobeIcon className="size-3.5" />
                    ) : (
                      <LockIcon className="size-3.5" />
                    )}
                    {isPublic ? "공개" : "비공개"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <UsersIcon className="size-3.5" />
                    최대 {maxMembers}명
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarIcon className="size-3.5" />
                    {enrollmentStart && enrollmentEnd
                      ? `${formatDate(enrollmentStart)} ~ ${formatDate(enrollmentEnd)}`
                      : "상시 모집"}
                  </span>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/studies/${id}`)}
                  >
                    상세보기
                  </Button>
                  {showEdit && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/studies/${id}/edit`)}
                      >
                        <SettingsIcon className="size-3.5" />
                        수정
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/studies/${id}/members`)}
                      >
                        <UsersIcon className="size-3.5" />
                        멤버 관리
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function AccordionSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="text-muted-foreground flex flex-col items-center gap-2 py-12 text-center">
        <BookOpenIcon className="size-8 opacity-30" />
        <p className="text-sm">{message}</p>
      </CardContent>
    </Card>
  );
}

function MyStudySection({
  role,
  title,
  icon,
  emptyMessage,
}: {
  role: "LEADER" | "MEMBER";
  title: string;
  icon: React.ReactNode;
  emptyMessage: string;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["myStudies", role],
    queryFn: () => fetchMyStudies(role, 0),
  });

  return (
    <section>
      <h2 className="text-foreground m-0 mb-4 flex items-center gap-2 text-lg font-semibold">
        {icon}
        {title}
        {data && (
          <span className="text-muted-foreground text-sm font-normal">
            ({data.totalElements})
          </span>
        )}
      </h2>
      {isLoading ? (
        <AccordionSkeleton />
      ) : !data || data.content.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <StudyAccordion
          studies={data.content}
          showEdit={role === "LEADER"}
        />
      )}
    </section>
  );
}

export default function MyPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <h1 className="text-foreground m-0 text-2xl font-bold tracking-tight">
        마이페이지
      </h1>

      <MyStudySection
        role="LEADER"
        title="내가 만든 스터디"
        icon={<CrownIcon className="size-5" />}
        emptyMessage="아직 만든 스터디가 없습니다"
      />

      <MyStudySection
        role="MEMBER"
        title="참여 중인 스터디"
        icon={<UsersIcon className="size-5" />}
        emptyMessage="아직 참여 중인 스터디가 없습니다"
      />
    </div>
  );
}
