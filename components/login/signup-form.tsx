"use client";

import type React from "react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";

interface SignupFormProps {
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { register: registerUser, loginWithKakao } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    try {
      await registerUser({ username, password, nickname });
      setSuccessMessage("회원가입이 완료되었습니다. 이제 로그인해 주세요.");
      setUsername("");
      setPassword("");
      setNickname("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKakaoLogin = async () => {
    await loginWithKakao();
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-medium text-foreground mb-6">
          친구들의 사진과 동영상을 보려면 가입하세요.
        </h2>
      </div>

      <Button
        onClick={handleKakaoLogin}
        className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#000000] font-semibold flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-5 h-5" />
        카카오로 로그인
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">또는</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          placeholder="아이디"
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
        <Input
          type="text"
          placeholder="사용자 이름"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
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
        {successMessage && (
          <p className="text-sm text-emerald-600" aria-live="polite">
            {successMessage}
          </p>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-semibold disabled:opacity-60 disabled:pointer-events-none"
        >
          {isSubmitting ? "가입 중..." : "가입"}
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        <span>
          저희 서비스를 이용하는 사람이 회원님의 연락처 정보를 Instagram에 업로드했을 수도 있습니다.{" "}
        </span>
        <button className="text-primary hover:underline">
          더 알아보기
        </button>
      </div>

      <div className="border-t border-border pt-4 text-center text-sm">
        <span className="text-muted-foreground">계정이 있으신가요? </span>
        <button 
          onClick={onSwitchToLogin}
          className="text-primary font-semibold hover:underline"
        >
          로그인
        </button>
      </div>
    </div>
  );
}
