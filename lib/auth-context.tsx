"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://sns-ai-backend-production.up.railway.app"

interface User {
    id: string
    username: string
    email: string
}

interface RegisterPayload {
    username: string
    password: string
    nickname: string
}

interface AuthContextType {
    user: User | null
    login: (username: string, password: string) => Promise<boolean>
    register: (payload: RegisterPayload) => Promise<boolean>
    loginWithKakao: () => Promise<boolean>
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    const login = async (username: string, password: string): Promise<boolean> => {
        if (!username || !password) {
            throw new Error("아이디와 비밀번호를 모두 입력해 주세요.")
        }

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })

        if (!response.ok) {
            const errorBody = await safeParseJson(response)
            const message =
                (typeof errorBody === "object" && errorBody && "message" in errorBody
                    ? String(errorBody.message)
                    : null) ?? "로그인에 실패했습니다. 입력 정보를 다시 확인해 주세요."
            throw new Error(message)
        }

        const data = await safeParseJson(response)

        if (data && typeof data === "object") {
            const accessToken = "accessToken" in data ? String(data.accessToken) : null
            const refreshToken =
                "refreshToken" in data ? String(data.refreshToken) : null
            const profile =
                "user" in data && data.user && typeof data.user === "object"
                    ? data.user
                    : null

            if (typeof window !== "undefined") {
                if (accessToken) {
                    localStorage.setItem("accessToken", accessToken)
                }
                if (refreshToken) {
                    localStorage.setItem("refreshToken", refreshToken)
                }
            }

            setUser({
                id: deriveUserField(profile, "id", username),
                username: deriveUserField(profile, "username", username),
                email: deriveUserField(profile, "email", `${username}@example.com`),
            })
            return true
        }

        throw new Error("로그인 응답을 해석하지 못했습니다.")
    }

    const register = async ({
        username,
        password,
        nickname,
    }: RegisterPayload): Promise<boolean> => {
        if (!username || !password || !nickname) {
            throw new Error("아이디, 비밀번호, 사용자 이름을 모두 입력해 주세요.")
        }

        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
                nickname,
            }),
        })

        if (!response.ok) {
            const errorBody = await safeParseJson(response)
            const message =
                (typeof errorBody === "object" && errorBody && "message" in errorBody
                    ? String(errorBody.message)
                    : null) ?? "회원가입에 실패했습니다. 입력 정보를 다시 확인해 주세요."
            throw new Error(message)
        }

        return true
    }

    const loginWithKakao = async (): Promise<boolean> => {
        // Mock Kakao login - in real app, this would use Kakao SDK
        setUser({
            id: "2",
            username: "kakao_user",
            email: "kakao@example.com",
        })
        return true
    }

    const logout = () => {
        setUser(null)
        if (typeof window !== "undefined") {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                loginWithKakao,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

async function safeParseJson(response: Response) {
    try {
        return await response.json()
    } catch {
        return null
    }
}

function deriveUserField(
    profile: unknown,
    key: "id" | "username" | "email",
    fallback: string,
) {
    if (profile && typeof profile === "object") {
        const record = profile as Record<string, unknown>
        if (key in record) {
            const value = record[key]
            if (typeof value === "string" || typeof value === "number") {
                return String(value)
            }
        }
    }
    return fallback
}
