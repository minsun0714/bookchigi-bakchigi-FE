import { BookOpenIcon, LogOutIcon, UserCircleIcon, UserIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import client from "@/api/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

const GOOGLE_LOGIN_URL = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const handleLogin = () => {
    sessionStorage.setItem("redirect_after_login", window.location.pathname);
    window.location.href = GOOGLE_LOGIN_URL;
  };

  const handleLogout = async () => {
    try {
      await client.post("/auth/logout");
    } catch {
      // 로그아웃 요청 실패해도 로컬 토큰은 삭제
    }
    logout();
    navigate("/");
  };

  return (
    <header className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <BookOpenIcon className="text-primary size-6" />
          <span className="text-foreground text-lg font-bold tracking-tight">
            북치기 박치기
          </span>
        </Link>

        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="bg-muted text-foreground flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted/70">
                <UserIcon className="size-5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="!w-48">
              <DropdownMenuItem
                className="gap-2 px-3 py-2.5"
                onClick={() => navigate("/mypage")}
              >
                <UserCircleIcon className="size-4" />
                마이페이지
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 px-3 py-2.5"
                variant="destructive"
                onClick={handleLogout}
              >
                <LogOutIcon className="size-4" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button size="sm" onClick={handleLogin}>
            <GoogleIcon />
            로그인
          </Button>
        )}
      </div>
    </header>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}
