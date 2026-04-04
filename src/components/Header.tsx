import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GOOGLE_LOGIN_URL = `${API_BASE_URL}/oauth2/authorization/google`;

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, token, logout } = useAuth();

  const handleLogin = () => {
    sessionStorage.setItem("redirect_after_login", window.location.pathname);
    window.location.href = GOOGLE_LOGIN_URL;
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // 로그아웃 요청 실패해도 로컬 토큰은 삭제
    }
    logout();
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between border-b border-[var(--border)] px-6 py-3">
      <a href="/" className="group flex items-center gap-2 no-underline">
        <span className="text-2xl">📚</span>
        <span className="bg-gradient-to-r from-[var(--accent)] to-purple-400 bg-clip-text text-lg font-bold tracking-tight text-transparent transition-opacity group-hover:opacity-80">
          북치기 박치기
        </span>
      </a>

      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className="cursor-pointer rounded-lg border border-[var(--border)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--text-h)] transition-colors hover:bg-[var(--accent-bg)]"
        >
          로그아웃
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="flex cursor-pointer items-center gap-2 rounded-lg border-none bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <GoogleIcon />
          로그인하기
        </button>
      )}
    </header>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
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
