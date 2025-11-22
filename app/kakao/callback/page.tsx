"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://sns-ai-backend-production.up.railway.app";

export default function KakaoCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserFromStorage } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URL에서 code 또는 다른 파라미터 가져오기
        const code = searchParams.get("code");
        const errorParam = searchParams.get("error");

        if (errorParam) {
          throw new Error("카카오 로그인에 실패했습니다.");
        }

        if (!code) {
          throw new Error("인증 코드를 받지 못했습니다.");
        }

        // /auth/kakao/callback API 호출
        const response = await fetch(`${API_BASE_URL}/auth/kakao/callback?code=${encodeURIComponent(code)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorBody = await safeParseJson(response);
          const message =
            (typeof errorBody === "object" && errorBody && "message" in errorBody
              ? String(errorBody.message)
              : null) ?? "카카오 로그인에 실패했습니다.";
          throw new Error(message);
        }

        const data = await safeParseJson(response);

        if (data && typeof data === "object") {
          const accessToken =
            "accessToken" in data ? String(data.accessToken) : null;
          const refreshToken =
            "refreshToken" in data ? String(data.refreshToken) : null;
          const profile =
            "user" in data && data.user && typeof data.user === "object"
              ? data.user
              : null;

          // 토큰 저장
          if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
          }
          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
          }

          // 사용자 정보 저장
          if (profile && typeof profile === "object") {
            const userRecord = profile as Record<string, unknown>;
            const userId = userRecord.userId ? String(userRecord.userId) : "";
            const email = userRecord.email ? String(userRecord.email) : `${userId}@kakao.com`;
            const id = userRecord.id ? String(userRecord.id) : userId;

            const userData = { id, userId, email };
            localStorage.setItem("user", JSON.stringify(userData));
            
            // auth-context 업데이트
            setUserFromStorage();
          }

          // 메인 페이지로 리다이렉트 (페이지 새로고침 없이)
          router.push("/");
        } else {
          throw new Error("응답 데이터를 해석하지 못했습니다.");
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "카카오 로그인 중 오류가 발생했습니다.";
        setError(message);
        // 에러 발생 시 3초 후 로그인 페이지로 리다이렉트
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, setUserFromStorage]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">잠시 후 로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg mb-2">카카오 로그인 처리 중...</p>
        <p className="text-sm text-muted-foreground">잠시만 기다려 주세요.</p>
      </div>
    </div>
  );
}

async function safeParseJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
