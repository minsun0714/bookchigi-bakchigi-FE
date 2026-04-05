import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, XIcon } from "lucide-react";

import {
  approveMember,
  fetchPendingMembers,
  rejectMember,
} from "@/api/studies";
import { Button } from "@/components/ui/button";

interface PendingMembersProps {
  studyId: number;
}

export default function PendingMembers({ studyId }: PendingMembersProps) {
  const queryClient = useQueryClient();

  const { data: pending } = useQuery({
    queryKey: ["pendingMembers", studyId],
    queryFn: () => fetchPendingMembers(studyId),
  });

  const approve = useMutation({
    mutationFn: (userId: number) => approveMember(studyId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingMembers", studyId] });
      queryClient.invalidateQueries({ queryKey: ["study", String(studyId)] });
    },
  });

  const reject = useMutation({
    mutationFn: (userId: number) => rejectMember(studyId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingMembers", studyId] });
    },
  });

  if (!pending || pending.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-foreground text-xs font-medium">
        가입 신청
        <span className="text-muted-foreground ml-1">({pending.length})</span>
      </p>
      {pending.map(({ userId, nickname }) => (
        <div
          key={userId}
          className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 dark:border-amber-900 dark:bg-amber-950/30"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
              {nickname.charAt(0)}
            </div>
            <span className="text-foreground text-sm">{nickname}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon-xs"
              variant="ghost"
              className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950"
              onClick={() => approve.mutate(userId)}
              disabled={approve.isPending || reject.isPending}
            >
              <CheckIcon className="size-3.5" />
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              className="hover:bg-destructive/10 text-destructive"
              onClick={() => reject.mutate(userId)}
              disabled={approve.isPending || reject.isPending}
            >
              <XIcon className="size-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
