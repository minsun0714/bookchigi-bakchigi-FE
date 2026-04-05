import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  FileTextIcon,
  MessageCircleIcon,
  VideoIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchStudy } from "@/api/studies";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Tab = "chat" | "files" | "meeting";

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "chat", label: "채팅", icon: <MessageCircleIcon className="size-4" /> },
  { key: "files", label: "자료", icon: <FileTextIcon className="size-4" /> },
  { key: "meeting", label: "화상 모임", icon: <VideoIcon className="size-4" /> },
];

export default function Workspace() {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  const { data: study, isLoading } = useQuery({
    queryKey: ["study", studyId],
    queryFn: () => fetchStudy(Number(studyId)),
    enabled: !!studyId,
  });

  if (!studyId) return null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/studies/${studyId}`)}
        >
          <ArrowLeftIcon className="size-4" />
          스터디 상세로
        </Button>
        {isLoading ? (
          <Skeleton className="h-6 w-40" />
        ) : study ? (
          <h1 className="text-foreground m-0 text-lg font-bold tracking-tight">
            {study.name}
          </h1>
        ) : null}
      </div>

      {/* 탭 */}
      <div className="flex gap-1 rounded-lg border border-border/50 p-1">
        {tabs.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border-none px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === key
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-muted-foreground hover:bg-muted"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <Card className="flex-1">
        <CardContent className="flex h-full flex-col items-center justify-center gap-3 py-20 text-center">
          {activeTab === "chat" && (
            <>
              <MessageCircleIcon className="text-muted-foreground size-12 opacity-30" />
              <p className="text-muted-foreground text-sm">채팅 기능 준비 중</p>
            </>
          )}
          {activeTab === "files" && (
            <>
              <FileTextIcon className="text-muted-foreground size-12 opacity-30" />
              <p className="text-muted-foreground text-sm">자료 기능 준비 중</p>
            </>
          )}
          {activeTab === "meeting" && (
            <>
              <VideoIcon className="text-muted-foreground size-12 opacity-30" />
              <p className="text-muted-foreground text-sm">화상 모임 기능 준비 중</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
