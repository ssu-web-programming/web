"use client";

import type React from "react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";

interface LoginFormProps {
  onSwitchToSignup?: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login, loginWithKakao } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await login(username, password);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKakaoLogin = async () => {
    await loginWithKakao();
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="font-serif text-5xl mb-8 text-foreground">Moodly</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          type="text"
          placeholder="전화번호, 사용자 이름 또는 이메일"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrorMessage(null);
          }}
          className="w-full bg-background border-border"
          disabled={isSubmitting}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrorMessage(null);
          }}
          className="w-full bg-background border-border"
          disabled={isSubmitting}
        />
        {errorMessage && (
          <p className="text-sm text-destructive" role="alert" aria-live="assertive">
            {errorMessage}
          </p>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] cursor-pointer text-primary-foreground font-semibold disabled:opacity-60 disabled:pointer-events-none"
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">또는</span>
        </div>
      </div>

      <Button
        onClick={handleKakaoLogin}
        className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#000000] font-semibold flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-5 h-5" />
        카카오 로그인
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">비밀번호를 잊으셨나요?</span>
      </div>

      <div className="border-t border-border pt-4 text-center text-sm">
        <span className="text-muted-foreground">계정이 없으신가요? </span>
        <button 
          onClick={onSwitchToSignup}
          className="text-primary font-semibold hover:underline"
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
