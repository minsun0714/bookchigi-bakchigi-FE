import { useSyncExternalStore } from "react";

const TOKEN_KEY = "access_token";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return localStorage.getItem(TOKEN_KEY);
}

function notify() {
  listeners.forEach((l) => l());
}

export function useAuth() {
  const token = useSyncExternalStore(subscribe, getSnapshot);

  const login = (accessToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    notify();
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    notify();
  };

  return {
    isLoggedIn: !!token,
    token,
    login,
    logout,
  };
}
