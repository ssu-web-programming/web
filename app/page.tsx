"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { LoginForm } from "@/components/login/login-form";
import { SignupForm } from "@/components/login/signup-form";
import { MainApp } from "@/components/main-app";
import Image from "next/image";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [isSignup, setIsSignup] = useState(false);

  if (isAuthenticated) {
    return <MainApp />;
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
