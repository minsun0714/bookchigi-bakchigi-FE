import { UserPlusIcon, UsersIcon } from "lucide-react";
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
        <h2 className="text-foreground m-0 mb-4 flex items-center gap-2 text-base font-semibold">
          <UsersIcon className="size-4" />
          멤버 ({members.length}/{maxMembers})
        </h2>
        <div className="flex flex-col gap-2">
          {members.map(({ userId, nickname, isLeader }) => (
            <div
              key={userId}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-sm font-medium">
                  {nickname.charAt(0)}
                </div>
                <span className="text-foreground text-sm font-medium">
                  {nickname}
                </span>
              </div>
              <span className="text-muted-foreground text-xs">
                {isLeader ? "방장" : "멤버"}
              </span>
            </div>
          ))}
        </div>

        {!isCurrentUserMember && (
          <Button
            className="mt-4 w-full"
            onClick={onJoin}
            disabled={isPending}
          >
            <UserPlusIcon className="size-4" />
            {isPending ? "신청 중..." : "스터디 합류 신청"}
          </Button>
        )}
        {isSuccess && (
          <p className="mt-2 text-center text-sm text-emerald-600">
            합류 신청이 완료되었습니다
          </p>
        )}
        {isError && (
          <p className="text-destructive mt-2 text-center text-sm">
            합류 신청에 실패했습니다
          </p>
        )}
      </CardContent>
    </Card>
  );
}
