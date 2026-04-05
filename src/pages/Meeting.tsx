import { VideoIcon } from "lucide-react";
import { useParams } from "react-router-dom";

export default function Meeting() {
  const { studyId } = useParams<{ studyId: string }>();

  if (!studyId) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
      <VideoIcon className="size-16 opacity-30" />
      <h1 className="m-0 text-xl font-bold">화상 모임</h1>
      <p className="text-sm text-slate-400">화상 모임 기능 준비 중</p>
    </div>
  );
}
