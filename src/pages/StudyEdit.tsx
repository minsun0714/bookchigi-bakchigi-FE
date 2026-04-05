import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchStudy } from "@/api/studies";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StudyForm from "@/components/StudyForm";

export default function StudyEdit() {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();

  const { data: study, isLoading } = useQuery({
    queryKey: ["study", studyId],
    queryFn: () => fetchStudy(Number(studyId)),
    enabled: !!studyId,
  });

  if (!studyId) return null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="self-start"
      >
        <ArrowLeftIcon className="size-4" />
        돌아가기
      </Button>
      <div>
        <h1 className="text-foreground m-0 text-xl font-bold tracking-tight">
          스터디 수정
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          스터디 정보를 수정하세요
        </p>
      </div>
      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-11 w-32" />
          </CardContent>
        </Card>
      ) : study ? (
        <StudyForm
          isbn={study.book.isbn}
          studyId={Number(studyId)}
          initialData={study}
        />
      ) : null}
    </div>
  );
}
