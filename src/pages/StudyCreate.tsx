import { ArrowLeftIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import StudyCreateForm from "@/components/StudyCreateForm";

export default function StudyCreate() {
  const { isbn } = useParams<{ isbn: string }>();
  const navigate = useNavigate();

  if (!isbn) return null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
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
          스터디 등록
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          새로운 스터디를 만들어 함께 공부할 멤버를 모집하세요
        </p>
      </div>
      <StudyCreateForm isbn={isbn} />
    </div>
  );
}
