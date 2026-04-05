import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronDownIcon } from "lucide-react";
import {
  BookOpenIcon,
  ClockIcon,
  CrownIcon,
  EyeIcon,
  MoreVerticalIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import type { MyStudy } from "@/api/studies";
import { fetchMyStudies } from "@/api/studies";
import EnrollmentStatusBadge from "@/components/EnrollmentStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

function StudyCard({
  study,
  showManage,
}: {
  study: MyStudy;
  showManage: boolean;
}) {
  const navigate = useNavigate();
  const { id, name, book, enrollmentStatus } = study;

  return (
    <div className="relative">
      <Link to={`/studies/${id}`} className="no-underline">
        <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
          <CardContent className="flex items-center gap-3 px-3 py-2.5">
            {book.image ? (
              <img
                src={book.image}
                alt={book.title}
                className="h-9 w-auto shrink-0 rounded object-contain"
              />
            ) : (
              <BookOpenIcon className="text-muted-foreground size-8 shrink-0" />
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-foreground min-w-0 truncate text-sm font-medium">
                  {name}
                </span>
                <EnrollmentStatusBadge status={enrollmentStatus} />
              </div>
              <span className="text-muted-foreground min-w-0 truncate text-xs">
                {book.title}
              </span>
            </div>
            {/* 드롭다운 자리 확보 */}
            {showManage && <div className="w-8 shrink-0" />}
          </CardContent>
        </Card>
      </Link>

      {showManage && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <DropdownMenu>
            <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md transition-colors hover:bg-muted focus:outline-none">
              <MoreVerticalIcon className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="!w-40">
              <DropdownMenuItem
                className="gap-2 px-3 py-2"
                onClick={() => navigate(`/studies/${id}`)}
              >
                <EyeIcon className="size-4" />
                상세보기
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 px-3 py-2"
                onClick={() => navigate(`/studies/${id}/edit`)}
              >
                <SettingsIcon className="size-4" />
                수정
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2 px-3 py-2"
                onClick={() => navigate(`/studies/${id}/members`)}
              >
                <UsersIcon className="size-4" />
                멤버 관리
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
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
  role: "LEADER" | "MEMBER" | "PENDING";
  title: string;
  icon: React.ReactNode;
  emptyMessage: string;
}) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["myStudies", role],
      queryFn: ({ pageParam }) => fetchMyStudies(role, pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage.page + 1 < lastPage.totalPages
          ? lastPage.page + 1
          : undefined,
    });

  const studies = data?.pages.flatMap((p) => p.content) ?? [];
  const total = data?.pages[0]?.totalElements ?? 0;

  return (
    <section>
      <h2 className="text-foreground m-0 mb-4 flex items-center gap-2 text-lg font-semibold">
        {icon}
        {title}
        {data && (
          <span className="text-muted-foreground text-sm font-normal">
            ({total})
          </span>
        )}
      </h2>
      {isLoading ? (
        <ListSkeleton />
      ) : studies.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="flex max-h-[32rem] flex-col gap-1.5 overflow-y-auto rounded-xl border border-border/50 p-3">
          {studies.map((study) => (
            <StudyCard
              key={study.id}
              study={study}
              showManage={role === "LEADER"}
            />
          ))}
          {hasNextPage && (
            <Button
              variant="ghost"
              className="text-muted-foreground mx-auto mt-2 shrink-0"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "불러오는 중..." : "더보기"}
              <ChevronDownIcon className="size-4" />
            </Button>
          )}
        </div>
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

      <MyStudySection
        role="PENDING"
        title="승인 대기 중"
        icon={<ClockIcon className="size-5" />}
        emptyMessage="승인 대기 중인 스터디가 없습니다"
      />
    </div>
  );
}
