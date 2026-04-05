import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  CalendarIcon,
  GlobeIcon,
  LockIcon,
  LogInIcon,
  SettingsIcon,
  ShieldAlertIcon,
  UsersIcon,
} from "lucide-react";
import Markdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";

import { fetchStudy } from "@/api/studies";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const GOOGLE_LOGIN_URL = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;

function formatDateTime(iso: string) {
  return format(new Date(iso), "yyyy.MM.dd (EEE) HH:mm", { locale: ko });
}

export default function StudyDetail() {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();

  const { data: study, isLoading, error } = useQuery({
    queryKey: ["study", studyId],
    queryFn: () => fetchStudy(Number(studyId)),
    enabled: !!studyId,
  });

  const status = error instanceof AxiosError ? error.response?.status : null;
  const is401 = status === 401;
  const is403 = status === 403;

  if (!studyId) return null;

  const handleLogin = () => {
    sessionStorage.setItem("redirect_after_login", window.location.pathname);
    window.location.href = GOOGLE_LOGIN_URL;
  };

  if (is401) {
    return (
      <Dialog open onOpenChange={() => navigate(-1)}>
        <DialogContent>
          <DialogHeader className="-mx-4 -mt-4 rounded-t-xl border-b bg-muted/60 px-5 py-4">
            <DialogTitle className="flex items-center gap-2">
              <LogInIcon className="size-5" />
              로그인 필요
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <LockIcon className="text-muted-foreground size-12 opacity-40" />
            <p className="text-foreground text-sm font-medium">
              비공개 스터디입니다
            </p>
            <p className="text-muted-foreground text-sm">
              이 스터디는 멤버만 볼 수 있습니다.
              <br />
              멤버라면 로그인해주세요.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => navigate(-1)}>
              돌아가기
            </Button>
            <Button onClick={handleLogin}>
              <LogInIcon className="size-4" />
              로그인하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (is403) {
    return (
      <Dialog open onOpenChange={() => navigate(-1)}>
        <DialogContent>
          <DialogHeader className="-mx-4 -mt-4 rounded-t-xl border-b bg-muted/60 px-5 py-4">
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlertIcon className="size-5" />
              접근 권한 없음
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <ShieldAlertIcon className="text-muted-foreground size-12 opacity-40" />
            <p className="text-foreground text-sm font-medium">
              이 스터디의 멤버만 볼 수 있습니다
            </p>
            <p className="text-muted-foreground text-sm">
              스터디에 참여한 멤버만 접근할 수 있는 비공개 스터디입니다
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => navigate(-1)}>돌아가기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

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
                <div className="flex shrink-0 items-center gap-2">
                  {study.isCurrentUserLeader && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => navigate(`/studies/${studyId}/edit`)}
                    >
                      <SettingsIcon className="size-4" />
                    </Button>
                  )}
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
              </div>

              {/* 메타 정보 */}
              <div className="text-muted-foreground mt-4 flex flex-wrap gap-4 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <UsersIcon className="size-4" />
                  {study.members.length} / {study.maxMembers}명
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

          {/* 멤버 목록 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-foreground m-0 mb-4 flex items-center gap-2 text-base font-semibold">
                <UsersIcon className="size-4" />
                멤버 ({study.members.length}/{study.maxMembers})
              </h2>
              <div className="flex flex-col gap-2">
                {study.members.map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between rounded-lg border px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-sm font-medium">
                        {member.nickname.charAt(0)}
                      </div>
                      <span className="text-foreground text-sm font-medium">
                        {member.nickname}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {member.isLeader ? "방장" : "멤버"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : error ? (
        <Card>
          <CardContent className="text-muted-foreground flex flex-col items-center gap-2 py-12 text-center">
            <p className="text-sm">스터디를 찾을 수 없습니다</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
