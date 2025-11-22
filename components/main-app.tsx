"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Grid3x3, LogOut, Upload } from "lucide-react";
import { UploadPage } from "@/components/upload/upload-page";
import { FeedListPage } from "@/components/feed/feed-list-page";

export function MainApp() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();
  
  const activeTab = pathname === "/feed" ? "feed" : "upload";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-serif text-2xl text-foreground">Moodly</h1>

          <nav className="flex items-center gap-6">
            <button
              onClick={() => router.push("/")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "upload"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Upload className="w-5 h-5" />
              <span className="font-medium">업로드</span>
            </button>

            <button
              onClick={() => router.push("/feed")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "feed"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
              <span className="font-medium">피드</span>
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.username || user?.userId || "User"}
            </span>
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto p-6">
        {activeTab === "upload" ? <UploadPage /> : <FeedListPage />}
      </main>
    </div>
  );
}
