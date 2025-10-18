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
  const [fullName, setFullName] = useState("");
  const { loginWithKakao } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 회원가입 로직 구현
    console.log("회원가입:", { username, password, fullName });
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
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-background border-border"
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-background border-border"
        />
        <Input
          type="text"
          placeholder="사용자 이름"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-background border-border"
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-semibold"
        >
          가입
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
