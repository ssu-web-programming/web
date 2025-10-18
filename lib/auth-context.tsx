"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
    id: string
    username: string
    email: string
}

interface AuthContextType {
    user: User | null
    login: (username: string, password: string) => Promise<boolean>
    loginWithKakao: () => Promise<boolean>
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    const login = async (username: string, password: string): Promise<boolean> => {
        // Mock login - in real app, this would call an API
        if (username && password) {
            setUser({
                id: "1",
                username: username,
                email: `${username}@example.com`,
            })
            return true
        }
        return false
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
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
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
