import { HomeIcon, SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-20">
      <p className="text-muted-foreground text-8xl font-bold opacity-20">404</p>
      <div className="text-center">
        <h1 className="text-foreground m-0 text-xl font-bold">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate("/")}>
          <HomeIcon className="size-4" />
          홈으로
        </Button>
        <Button onClick={() => navigate("/")}>
          <SearchIcon className="size-4" />
          책 검색하기
        </Button>
      </div>
    </div>
  );
}
