"use client";

import {
  useEffect, useState, useCallback, useRef,
  createContext, useContext,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { theme } from "@/src/app/theming";

const SESSION_TIMEOUT = 30 * 60 * 1000;

interface AuthContextType {
  token: string | null;
  isLoggedIn: boolean;
  logout: () => void;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null, isLoggedIn: false, logout: () => {}, setToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}
function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading]  = useState(true);
  const router    = useRouter();
  const pathname  = usePathname();
  const timerRef  = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(() => {
    deleteCookie("token");
    localStorage.removeItem("token");
    setTokenState(null);
    router.push("/login");
  }, [router]);

  const setToken = useCallback((t: string) => {
    setCookie("token", t);
    localStorage.setItem("token", t);
    setTokenState(t);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (token) timerRef.current = setTimeout(logout, SESSION_TIMEOUT);
  }, [logout, token]);

  useEffect(() => {
    if (!token) return;
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [token, resetTimer]);

  useEffect(() => {
    const stored = getCookie("token") || localStorage.getItem("token");
    if (stored) { setCookie("token", stored); localStorage.setItem("token", stored); }
    setTokenState(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    const isPublic = ["/", "/login", "/sign_up"].includes(pathname);
    if (!token && !isPublic) router.replace("/login");
    else if (token && isPublic) router.replace("/dashboard");
  }, [token, pathname, loading, router]);

  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", background: "#f8fafc",
        fontWeight: 700, color: "#94a3b8", fontFamily: "DM Sans, sans-serif",
      }}>
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, isLoggedIn: !!token, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AuthWrapper>{children}</AuthWrapper>
    </ChakraProvider>
  );
}
