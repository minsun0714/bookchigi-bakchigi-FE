import { LogInIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const GOOGLE_LOGIN_URL = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: ReactNode;
  message: string;
  redirectPath?: string;
}

export default function LoginModal({
  open,
  onOpenChange,
  icon,
  message,
  redirectPath,
}: LoginModalProps) {
  const handleLogin = () => {
    sessionStorage.setItem(
      "redirect_after_login",
      redirectPath ?? window.location.pathname,
    );
    window.location.href = GOOGLE_LOGIN_URL;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="-mx-4 -mt-4 rounded-t-xl border-b bg-muted/60 px-5 py-4">
          <DialogTitle className="flex items-center gap-2">
            <LogInIcon className="size-5" />
            로그인 필요
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          {icon}
          <p className="text-foreground text-sm font-medium">{message}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleLogin}>
            <LogInIcon className="size-4" />
            로그인하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
