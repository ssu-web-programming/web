"use client";

import { createContext, type ReactNode, useContext, useState, useEffect } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://sns-ai-backend-production.up.railway.app";

interface User {
  id: string;
  userId: string;
  username?: string;
  email: string;
}

interface RegisterPayload {
  userId: string;
  password: string;
  nickname: string;
}


interface AuthContextType {
  user: User | null;
  login: (userId: string, password: string, username: string) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  loginWithKakao: () => Promise<boolean>;
  setUserFromStorage: () => void;
  logout: (redirectToLogin?: boolean) => Promise<void>;
  handleAuthError: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 초기 로드 시 localStorage에서 사용자 정보 읽어오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch {
          // 파싱 실패 시 무시
        }
      }
    }
  }, []);

  // 사용자 정보를 저장하는 헬퍼 함수
  const saveUserData = (profile: Record<string, unknown>, fallbackUserId: string, fallbackUsername: string) => {
    const userId = profile.userId ? String(profile.userId) : fallbackUserId;
    const username = profile.username ? String(profile.username) : (fallbackUsername || userId);
    const email = profile.email ? String(profile.email) : `${userId}@example.com`;
    const id = profile._id ? String(profile._id) : (profile.id ? String(profile.id) : userId);

    const userData = { id, userId, username, email };
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
    }
    setUser(userData);
  };

  const login = async (userId: string, password: string, username: string): Promise<boolean> => {
    const trimmedUserId = userId?.trim() || "";
    const trimmedPassword = password?.trim() || "";
    const trimmedUsername = username?.trim() || "";
    
    if (!trimmedUserId || !trimmedPassword) {
      throw new Error("아이디와 비밀번호를 모두 입력해 주세요.");
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // HttpOnly 쿠키 지원
      body: JSON.stringify({ 
        userId: trimmedUserId, 
        password: trimmedPassword, 
        username: trimmedUsername,
        kakaoId: ""
      }),
    });

    if (!response.ok) {
      const errorBody = await safeParseJson(response);
      const message =
        (typeof errorBody === "object" && errorBody && "message" in errorBody
          ? String(errorBody.message)
          : null) ?? "로그인에 실패했습니다. 입력 정보를 다시 확인해 주세요.";
      throw new Error(message);
    }

    const data = await safeParseJson(response);

    // 로그인 응답에서 access_token과 사용자 정보 추출
    if (data && typeof data === "object") {
      // 일반 로그인은 백엔드가 쿠키 관리를 하지 않으므로 access_token을 localStorage에 저장
      const accessToken =
        "access_token" in data ? String(data.access_token) : null;

      if (typeof window !== "undefined" && accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      const profile =
        "user" in data && data.user && typeof data.user === "object"
          ? data.user as Record<string, unknown>
          : null;

      if (profile) {
        saveUserData(profile, trimmedUserId, trimmedUsername);
      } else {
        // 프로필이 없는 경우 기본 정보로 설정
        const userData = {
          id: trimmedUserId,
          userId: trimmedUserId,
          username: trimmedUsername || trimmedUserId,
          email: `${trimmedUserId}@example.com`,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
        }
        setUser(userData);
      }
    }
    
    return true;
  };

  const register = async ({
    userId,
    password,
    nickname,
  }: RegisterPayload): Promise<boolean> => {
    const trimmedUserId = userId?.trim() || "";
    const trimmedPassword = password?.trim() || "";
    const trimmedNickname = nickname?.trim() || "";
    
    if (!trimmedUserId || !trimmedPassword || !trimmedNickname) {
      throw new Error("아이디, 비밀번호, 사용자 이름을 모두 입력해 주세요.");
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // HttpOnly 쿠키 지원
      body: JSON.stringify({
        userId: trimmedUserId,
        password: trimmedPassword,
        username: trimmedNickname,
      }),
    });

    if (!response.ok) {
      const errorBody = await safeParseJson(response);
      const message =
        (typeof errorBody === "object" && errorBody && "message" in errorBody
          ? String(errorBody.message)
          : null) ?? "회원가입에 실패했습니다. 입력 정보를 다시 확인해 주세요.";
      throw new Error(message);
    }

    const data = await safeParseJson(response);

    // 회원가입 성공 후 자동 로그인
    if (data && typeof data === "object") {
      const profile =
        "user" in data && data.user && typeof data.user === "object"
          ? data.user
          : null;

      // 회원가입 응답의 사용자 정보로 로그인 API 호출
      if (profile && typeof profile === "object") {
        const userRecord = profile as Record<string, unknown>;
        const registeredUserId = userRecord.userId ? String(userRecord.userId) : trimmedUserId;
        const username = userRecord.username ? String(userRecord.username) : trimmedNickname;

        // 자동 로그인
        try {
          const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // HttpOnly 쿠키 지원
            body: JSON.stringify({
              userId: registeredUserId,
              password: trimmedPassword,
              username: username,
              kakaoId: "",
            }),
          });

          if (loginResponse.ok) {
            const loginData = await safeParseJson(loginResponse);
            if (loginData && typeof loginData === "object") {
              // 일반 로그인은 백엔드가 쿠키 관리를 하지 않으므로 access_token을 localStorage에 저장
              const accessToken =
                "access_token" in loginData ? String(loginData.access_token) : null;

              if (typeof window !== "undefined" && accessToken) {
                localStorage.setItem("accessToken", accessToken);
              }

              const loginProfile =
                "user" in loginData && loginData.user && typeof loginData.user === "object"
                  ? loginData.user as Record<string, unknown>
                  : null;

              if (loginProfile) {
                saveUserData(loginProfile, registeredUserId, username);
              } else {
                // 프로필이 없는 경우 회원가입 응답의 사용자 정보 사용
                saveUserData(userRecord, registeredUserId, username);
              }
            }
          }
        } catch (loginError) {
          // 로그인 실패해도 회원가입은 성공한 것으로 처리
          console.error("자동 로그인 실패:", loginError);
        }
      }
    }

    return true;
  };

  const loginWithKakao = async (): Promise<boolean> => {
    if (typeof window === "undefined") {
      throw new Error("카카오 로그인은 브라우저에서만 사용할 수 있습니다.");
    }

    // 현재 페이지의 콜백 URL 생성
    const callbackUrl = `${window.location.origin}/kakao/callback`;
    
    // /auth/kakao로 리다이렉트 (백엔드에서 카카오 인증 페이지로 리다이렉트)
    window.location.href = `${API_BASE_URL}/auth/kakao?redirect_uri=${encodeURIComponent(callbackUrl)}`;
    
    // 리다이렉트되므로 여기서는 false 반환 (실제 로그인은 콜백에서 처리)
    return false;
  };

  const setUserFromStorage = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch {
          // 파싱 실패 시 무시
        }
      }
    }
  };

  const logout = async (redirectToLogin = true) => {
    // 백엔드 로그아웃 API 호출 (쿠키 삭제)
    try {
      const accessToken = typeof window !== "undefined" 
        ? localStorage.getItem("accessToken") 
        : null;

      const headers: HeadersInit = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers,
        credentials: "include", // HttpOnly 쿠키 포함 (카카오 로그인용)
      });
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
    }
    
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      
      // 로그인 화면으로 리다이렉트
      if (redirectToLogin) {
        window.location.href = "/";
      }
    }
  };

  // 인증 에러 처리 (401 에러 시 자동 로그아웃 및 리다이렉트)
  const handleAuthError = () => {
    logout(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        loginWithKakao,
        setUserFromStorage,
        logout,
        handleAuthError,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

async function safeParseJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

