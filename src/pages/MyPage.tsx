import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpenIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  CrownIcon,
  EyeIcon,
  MoreVerticalIcon,
  PencilIcon,
  SettingsIcon,
  Trash2Icon,
  UserIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { MyStudy } from "@/api/studies";
import { toast } from "sonner";

import { deleteStudy, fetchMyStudies } from "@/api/studies";
import { fetchMe, updateNickname } from "@/api/user";
import EnrollmentStatusBadge from "@/components/EnrollmentStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const { id, name, book, enrollmentStatus } = study;

  const deleteMutation = useMutation({
    mutationFn: () => deleteStudy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myStudies"] });
      setShowDeleteDialog(false);
      toast.success("스터디가 삭제되었습니다");
    },
    onError: () => toast.error("스터디 삭제에 실패했습니다"),
  });

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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 px-3 py-2"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2Icon className="size-4" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader className="-mx-4 -mt-4 rounded-t-xl border-b bg-muted/60 px-5 py-4">
            <DialogTitle className="flex items-center gap-2">
              <Trash2Icon className="size-5" />
              스터디 삭제
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <p className="text-muted-foreground text-sm">
              스터디에 포함된 모든 자료와 데이터가 영구적으로 삭제됩니다.
              삭제하려면 아래에 스터디 이름을 정확히 입력해주세요.
            </p>
            <div className="flex flex-col gap-1.5">
              <p className="text-foreground text-sm font-medium">{name}</p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="스터디 이름을 입력하세요"
                className="border-input bg-background placeholder:text-muted-foreground focus:ring-ring/50 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteConfirm("");
              }}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteConfirm !== name || deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });

  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");

  const nicknameMutation = useMutation({
    mutationFn: () => updateNickname(nicknameInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setIsEditingNickname(false);
      toast.success("닉네임이 변경되었습니다");
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      toast.error(axiosError.response?.data?.message ?? "닉네임 변경에 실패했습니다");
    },
  });

  const startEditNickname = () => {
    setNicknameInput(user?.nickname ?? "");
    setIsEditingNickname(true);
  };

  const submitNickname = () => {
    if (!nicknameInput.trim()) return;
    nicknameMutation.mutate();
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      {/* 프로필 */}
      <div className="flex items-center gap-4">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.nickname}
            className="size-16 rounded-full object-cover"
          />
        ) : (
          <div className="bg-muted text-muted-foreground flex size-16 items-center justify-center rounded-full">
            <UserIcon className="size-8" />
          </div>
        )}
        <div>
          {isEditingNickname ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitNickname()}
                className="border-input bg-background focus:ring-ring/50 h-9 rounded-lg border px-3 text-lg font-bold outline-none focus:ring-2"
                autoFocus
              />
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={submitNickname}
                disabled={nicknameMutation.isPending}
                className="text-emerald-600"
              >
                <CheckIcon className="size-4" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setIsEditingNickname(false)}
              >
                <XIcon className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-foreground m-0 text-2xl font-bold tracking-tight">
                {user?.nickname ?? "마이페이지"}
              </h1>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={startEditNickname}
                className="text-muted-foreground"
              >
                <PencilIcon className="size-3.5" />
              </Button>
            </div>
          )}
          {user?.email && (
            <p className="text-muted-foreground mt-0.5 text-sm">{user.email}</p>
          )}
        </div>
      </div>

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
