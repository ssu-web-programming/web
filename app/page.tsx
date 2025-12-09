"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LoginForm } from "@/components/login/login-form";
import { SignupForm } from "@/components/login/signup-form";
import { MainApp } from "@/components/main-app";
import Image from "next/image";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-muted-foreground">로딩 중...</p>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, setUserFromStorage } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [isProcessingToken, setIsProcessingToken] = useState(false);

  // 카카오 리다이렉트로 전달된 token/refreshToken 처리
  // 로그인 후 토큰 파라미터 처리 (한 번만)
  useEffect(() => {
    // useSearchParams는 객체가 매 렌더마다 새로울 수 있어 ref로 한 번만 처리
    const processedRef = { current: false };
    const handleTokenFromUrl = () => {
      if (processedRef.current) return;
      const token = searchParams.get("token");
      const refreshToken = searchParams.get("refreshToken");
      if (!token && !refreshToken) return;
      processedRef.current = true;

      setIsProcessingToken(true);
      try {
        if (token) {
          localStorage.setItem("accessToken", token);
          const userData = buildUserFromToken(token);
          if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
          }
        }
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        setUserFromStorage();

        // querystring 정리하여 새로고침 없이 token 제거
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.delete("token");
        params.delete("refreshToken");
        const next = params.toString();
        const cleanedPath = next ? `/?${next}` : "/";
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", cleanedPath);
        }
        router.replace(cleanedPath);
      } finally {
        setIsProcessingToken(false);
      }
    };

    handleTokenFromUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 실행은 최초 마운트 시 한 번만

  if (isAuthenticated) {
    return <MainApp />;
  }

  if (isProcessingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">로그인 처리 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Sample images */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <Image
                src="/images/main-image.png"
                alt="Instagram feed samples"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Right side - Login/Signup form */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm border border-border bg-card p-10 rounded-sm">
              {isSignup ? (
                <SignupForm onSwitchToLogin={() => setIsSignup(false)} />
              ) : (
                <LoginForm onSwitchToSignup={() => setIsSignup(true)} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border">
        <p>© 2025 Instagram from seyeon and jungsub</p>
      </footer>
    </div>
  );
}

function buildUserFromToken(token: string | null) {
  if (!token) return null;
  try {
    const payloadPart = token.split(".")[1];
    const decoded = JSON.parse(atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/")));
    const userId = decoded.userId || decoded.sub || decoded.id;
    if (!userId) return null;
    const username = decoded.username || userId;
    const email = decoded.email || `${userId}@kakao.com`;
    const id = decoded.id || userId;
    return { id: String(id), userId: String(userId), username: String(username), email: String(email) };
  } catch {
    return null;
  }
}
