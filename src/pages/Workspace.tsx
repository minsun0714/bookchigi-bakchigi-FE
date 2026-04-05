import { useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  FileTextIcon,
  MessageCircleIcon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchStudy } from "@/api/studies";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type MobileTab = "files" | "chat";

export default function Workspace() {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  const [mobileTab, setMobileTab] = useState<MobileTab>("files");
  const [chatOpen, setChatOpen] = useState(true);
  const [chatWidth, setChatWidth] = useState(384);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const newWidth = window.innerWidth - e.clientX;
      setChatWidth(Math.max(280, Math.min(newWidth, window.innerWidth - 200)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const { data: study, isLoading } = useQuery({
    queryKey: ["study", studyId],
    queryFn: () => fetchStudy(Number(studyId)),
    enabled: !!studyId,
  });

  if (!studyId) return null;

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-muted/30">
      {/* 헤더 */}
      <div className="bg-background flex items-center gap-3 border-b border-border/40 px-4 py-2.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/studies/${studyId}`)}
        >
          <ArrowLeftIcon className="size-4" />
          <span className="hidden sm:inline">스터디 상세로</span>
        </Button>

        <div className="bg-border mx-1 hidden h-5 w-px sm:block" />

        {isLoading ? (
          <Skeleton className="h-5 w-32" />
        ) : study ? (
          <span className="text-foreground truncate text-sm font-semibold">
            {study.name}
          </span>
        ) : null}

        <div className="ml-auto flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              window.open(
                `/studies/${studyId}/meeting`,
                `meeting-${studyId}`,
                "width=1024,height=768",
              )
            }
          >
            <VideoIcon className="size-4" />
            <span className="hidden sm:inline">화상 모임</span>
          </Button>
          <Button
            variant={chatOpen ? "default" : "outline"}
            size="sm"
            className="hidden gap-1.5 md:flex"
            onClick={() => setChatOpen(!chatOpen)}
          >
            {chatOpen ? (
              <PanelRightCloseIcon className="size-4" />
            ) : (
              <PanelRightOpenIcon className="size-4" />
            )}
            채팅
          </Button>
        </div>
      </div>

      {/* 모바일 탭 */}
      <div className="bg-background flex border-b border-border/40 md:hidden">
        {(
          [
            { key: "files", label: "자료", icon: <FileTextIcon className="size-4" /> },
            { key: "chat", label: "채팅", icon: <MessageCircleIcon className="size-4" /> },
          ] as const
        ).map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setMobileTab(key)}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 border-none border-b border-border/40-2 bg-transparent px-3 py-2.5 text-sm font-medium transition-colors ${
              mobileTab === key
                ? "text-foreground border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* 컨텐츠 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 메인 영역 */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex flex-1 flex-col md:hidden">
            {mobileTab === "files" && <FilesPlaceholder />}
            {mobileTab === "chat" && <ChatPlaceholder />}
          </div>
          <div className="hidden flex-1 md:flex">
            <FilesPlaceholder />
          </div>
        </div>

        {/* 데스크톱 채팅 사이드패널 */}
        {chatOpen && (
          <div
            className="bg-background relative hidden flex-col md:flex"
            style={{ width: chatWidth }}
          >
            {/* 리사이즈 핸들 */}
            <div
              className="group absolute inset-y-0 -left-2 z-10 flex w-4 cursor-col-resize items-center justify-center"
              onMouseDown={handleMouseDown}
            >
              <div className="h-10 w-1.5 rounded-full bg-border/60 transition-all group-hover:h-16 group-hover:bg-primary/40 group-active:bg-primary" />
            </div>

            {/* 채팅 헤더 */}
            <div className="flex items-center justify-between border-b border-border/40 border-l border-border/40 px-4 py-2.5">
              <span className="text-foreground flex items-center gap-2 text-sm font-semibold">
                <MessageCircleIcon className="size-4" />
                채팅
              </span>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setChatOpen(false)}
              >
                <XIcon className="size-4" />
              </Button>
            </div>

            {/* 채팅 컨텐츠 */}
            <div className="flex flex-1 flex-col overflow-hidden border-l border-border/40">
              <ChatPlaceholder />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilesPlaceholder() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <div className="bg-muted flex size-16 items-center justify-center rounded-2xl">
        <FileTextIcon className="text-muted-foreground size-8" />
      </div>
      <div className="text-center">
        <p className="text-foreground text-sm font-medium">자료 기능 준비 중</p>
        <p className="text-muted-foreground mt-1 text-xs">
          스터디 자료를 업로드하고 공유할 수 있습니다
        </p>
      </div>
    </div>
  );
}

function ChatPlaceholder() {
  return (
    <div className="flex flex-1 flex-col">
      {/* 메시지 영역 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto p-8">
        <div className="bg-muted flex size-16 items-center justify-center rounded-2xl">
          <MessageCircleIcon className="text-muted-foreground size-8" />
        </div>
        <div className="text-center">
          <p className="text-foreground text-sm font-medium">
            채팅 기능 준비 중
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            스터디원과 실시간으로 대화할 수 있습니다
          </p>
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="mt-auto border-t border-border/40 p-3">
        <div className="flex items-stretch gap-2">
          <textarea
            placeholder="메시지를 입력하세요"
            rows={3}
            className="border-input bg-background placeholder:text-muted-foreground focus:ring-ring/50 flex-1 resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2"
          />
          <button
            disabled
            className="bg-primary text-primary-foreground disabled:opacity-50 rounded-lg px-6 text-sm font-medium"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
