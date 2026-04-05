import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, UsersIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchPendingMembers, fetchStudy } from "@/api/studies";
import PendingMembers from "@/components/PendingMembers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudyMembers() {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();

  const { data: study, isLoading } = useQuery({
    queryKey: ["study", studyId],
    queryFn: () => fetchStudy(Number(studyId)),
    enabled: !!studyId,
  });

  const { data: pending } = useQuery({
    queryKey: ["pendingMembers", Number(studyId)],
    queryFn: () => fetchPendingMembers(Number(studyId)),
    enabled: !!studyId,
  });

  if (!studyId) return null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(`/studies/${studyId}`)}
        className="self-start"
      >
        <ArrowLeftIcon className="size-4" />
        스터디 상세로
      </Button>

      <div>
        <h1 className="text-foreground m-0 text-xl font-bold tracking-tight">
          멤버 관리
        </h1>
        {study && (
          <p className="text-muted-foreground mt-1 text-sm">{study.name}</p>
        )}
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col gap-3 p-6">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 가입 신청 */}
          <section>
            <h2 className="text-foreground m-0 mb-4 flex items-center gap-2 text-base font-semibold">
              <UsersIcon className="size-4" />
              가입 신청
              {pending && pending.length > 0 && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                  {pending.length}
                </span>
              )}
            </h2>
            <PendingMembers studyId={Number(studyId)} />
            {(!pending || pending.length === 0) && (
              <Card>
                <CardContent className="text-muted-foreground py-8 text-center text-sm">
                  대기 중인 가입 신청이 없습니다
                </CardContent>
              </Card>
            )}
          </section>

          {/* 현재 멤버 */}
          {study && (
            <section>
              <h2 className="text-foreground m-0 mb-4 flex items-center gap-2 text-base font-semibold">
                <UsersIcon className="size-4" />
                현재 멤버
                <span className="text-muted-foreground text-sm font-normal">
                  ({study.members.length}/{study.maxMembers})
                </span>
              </h2>
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    {study.members.map(({ userId, nickname, isLeader }) => (
                      <div
                        key={userId}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                          isLeader
                            ? "bg-amber-50/50 dark:bg-amber-950/20"
                            : "bg-muted/40"
                        }`}
                      >
                        <div
                          className={`flex size-8 items-center justify-center rounded-full text-sm font-semibold ${
                            isLeader
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {nickname.charAt(0)}
                        </div>
                        <div className="flex min-w-0 flex-col">
                          <span className="text-foreground truncate text-sm font-medium">
                            {nickname}
                          </span>
                          <span className="text-muted-foreground text-[11px]">
                            {isLeader ? "방장" : "멤버"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </>
      )}
    </div>
  );
}
