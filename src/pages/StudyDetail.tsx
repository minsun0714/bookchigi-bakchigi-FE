import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  ArrowLeftIcon,
  LockIcon,
  ShieldAlertIcon,
  UserPlusIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "sonner";

import { fetchStudy, joinStudy } from "@/api/studies";
import LoginModal from "@/components/LoginModal";
import StudyInfoCard from "@/components/StudyInfoCard";
import StudyMemberCard from "@/components/StudyMemberCard";
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
import { useAuth } from "@/hooks/useAuth";

export default function StudyDetail() {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { data: study, isLoading, error } = useQuery({
    queryKey: ["study", studyId],
    queryFn: () => fetchStudy(Number(studyId)),
    enabled: !!studyId,
  });

  const joinMutation = useMutation({
    mutationFn: () => joinStudy(Number(studyId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study", studyId] });
      toast.success("합류 신청이 완료되었습니다");
    },
    onError: () => toast.error("합류 신청에 실패했습니다"),
  });

  const status = error instanceof AxiosError ? error.response?.status : null;

  if (!studyId) return null;

  const handleJoin = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    joinMutation.mutate();
  };

  // 401: 비로그인
  if (status === 401) {
    return (
      <LoginModal
        open
        onOpenChange={() => navigate(-1)}
        icon={<LockIcon className="text-muted-foreground size-12 opacity-40" />}
        message="이 스터디는 멤버만 볼 수 있습니다. 멤버라면 로그인해주세요."
      />
    );
  }

  // 403: 권한 없음
  if (status === 403) {
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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        icon={
          <UserPlusIcon className="text-muted-foreground size-12 opacity-40" />
        }
        message="스터디에 합류하려면 로그인이 필요합니다"
      />

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
          <StudyInfoCard study={study} />
          <StudyMemberCard
            study={study}
            onJoin={handleJoin}
            joinMutation={joinMutation}
          />
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
