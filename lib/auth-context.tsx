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

interface LoginPayload {
  userId: string;
  password: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (userId: string, password: string, username: string) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  loginWithKakao: () => Promise<boolean>;
  setUserFromStorage: () => void;
  logout: () => void;
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

    if (data && typeof data === "object") {
      const accessToken =
        "access_token" in data ? String(data.access_token) : null;
      const profile =
        "user" in data && data.user && typeof data.user === "object"
          ? data.user
          : null;

      if (typeof window !== "undefined") {
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
      }

      // 사용자 정보 저장
      if (profile && typeof profile === "object") {
        const userRecord = profile as Record<string, unknown>;
        const userId = userRecord.userId ? String(userRecord.userId) : trimmedUserId;
        const username = userRecord.username ? String(userRecord.username) : (trimmedUsername || userId);
        const email = userRecord.email ? String(userRecord.email) : `${userId}@example.com`;
        const id = userRecord._id ? String(userRecord._id) : (userRecord.id ? String(userRecord.id) : userId);

        const userData = { id, userId, username, email };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } else {
        // 프로필이 없는 경우 기본 정보로 설정
        const userData = {
          id: trimmedUserId,
          userId: trimmedUserId,
          username: trimmedUsername || trimmedUserId,
          email: `${trimmedUserId}@example.com`,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      }
      return true;
    }

    throw new Error("로그인 응답을 해석하지 못했습니다.");
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
              const accessToken =
                "access_token" in loginData ? String(loginData.access_token) : null;

              if (typeof window !== "undefined") {
                if (accessToken) {
                  localStorage.setItem("accessToken", accessToken);
                }
              }

              // 사용자 정보 저장
              const userId = userRecord.userId ? String(userRecord.userId) : registeredUserId;
              const username = userRecord.username ? String(userRecord.username) : trimmedNickname;
              const email = userRecord.email ? String(userRecord.email) : `${userId}@example.com`;
              const id = userRecord._id ? String(userRecord._id) : (userRecord.id ? String(userRecord.id) : userId);

              const userData = { id, userId, username, email };
              localStorage.setItem("user", JSON.stringify(userData));
              setUser(userData);
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

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
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

function deriveUserField(
  profile: unknown,
  key: "id" | "userId" | "email",
  fallback: string,
) {
  if (profile && typeof profile === "object") {
    const record = profile as Record<string, unknown>;
    if (key in record) {
      const value = record[key];
      if (typeof value === "string" || typeof value === "number") {
        return String(value);
      }
    }
  }
  return fallback;
}
