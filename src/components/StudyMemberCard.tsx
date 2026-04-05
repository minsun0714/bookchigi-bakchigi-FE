import { CrownIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import type { UseMutationResult } from "@tanstack/react-query";

import type { StudyDetail } from "@/api/studies";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface StudyMemberCardProps {
  study: StudyDetail;
  onJoin: () => void;
  joinMutation: UseMutationResult<void, Error, void, unknown>;
}

export default function StudyMemberCard({
  study,
  onJoin,
  joinMutation,
}: StudyMemberCardProps) {
  const { members, maxMembers, isCurrentUserMember } = study;
  const { isPending, isSuccess, isError } = joinMutation;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-foreground m-0 flex items-center gap-2 text-base font-semibold">
            <UsersIcon className="size-4" />
            멤버
          </h2>
          <span className="text-muted-foreground text-sm">
            {members.length}
            <span className="mx-0.5">/</span>
            {maxMembers}
          </span>
        </div>

        {/* 멤버 그리드 */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {members.map(({ userId, nickname, isLeader }) => (
            <div
              key={userId}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                isLeader ? "col-span-full bg-amber-50/50 dark:bg-amber-950/20" : "bg-muted/40"
              }`}
            >
              <div
                className={`flex size-9 items-center justify-center rounded-full text-sm font-semibold ${
                  isLeader
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {isLeader ? (
                  <CrownIcon className="size-4" />
                ) : (
                  nickname.charAt(0)
                )}
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

        {/* 합류 버튼 */}
        {!isCurrentUserMember && (
          <Button
            className="mt-5 w-full"
            size="lg"
            onClick={onJoin}
            disabled={isPending}
          >
            <UserPlusIcon className="size-4" />
            {isPending ? "신청 중..." : "스터디 합류 신청"}
          </Button>
        )}
        {isSuccess && (
          <p className="mt-3 text-center text-sm text-emerald-600">
            합류 신청이 완료되었습니다
          </p>
        )}
        {isError && (
          <p className="text-destructive mt-3 text-center text-sm">
            합류 신청에 실패했습니다
          </p>
        )}
      </CardContent>
    </Card>
  );
}
