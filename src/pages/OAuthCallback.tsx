import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import client from "@/api/client";
import { useAuth } from "@/hooks/useAuth";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const exchanged = useRef(false);

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;

    const code = searchParams.get("code");
    if (!code) {
      navigate("/", { replace: true });
      return;
    }

    const exchangeCode = async () => {
      try {
        const res = await client.get("/auth/exchange", { params: { code } });
        const token = res.headers["authorization"]?.replace("Bearer ", "");
        if (token) {
          login(token);
        }
      } catch {
        // 토큰 교환 실패
      }

      const redirectPath =
        sessionStorage.getItem("redirect_after_login") || "/";
      sessionStorage.removeItem("redirect_after_login");
      navigate(redirectPath, { replace: true });
    };

    exchangeCode();
  }, [searchParams, navigate, login]);

  return null;
}
