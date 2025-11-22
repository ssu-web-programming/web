"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ChevronLeft, ChevronRight, Loader2, Sparkles, Upload, X } from "lucide-react";
import { useFeed } from "@/lib/feed-context";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { FeedPreview } from "@/components/feed/feed-preview";

export function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { addPost } = useFeed();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://sns-ai-backend-production.up.railway.app";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 5 - selectedFiles.length;

    if (files.length > remainingSlots) {
      alert(
        `최대 5장까지 업로드할 수 있습니다. ${remainingSlots}장만 추가됩니다.`,
      );
    }

    const filesToAdd = files.slice(0, remainingSlots);
    const newFiles = [...selectedFiles, ...filesToAdd];
    const newUrls = filesToAdd.map((file) => URL.createObjectURL(file));

    setSelectedFiles(newFiles);
    setPreviewUrls([...previewUrls, ...newUrls]);
  };

  const removeImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
    if (currentImageIndex >= newFiles.length && newFiles.length > 0) {
      setCurrentImageIndex(newFiles.length - 1);
    }
  };

  const generateContent = async () => {
    if (selectedFiles.length === 0) {
      alert("이미지를 먼저 업로드해주세요.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // FormData 생성
      const formData = new FormData();
      
      // 이미지 파일들 추가 (files는 array<string>이지만 FormData에서는 파일 객체로 전송)
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      // 프롬프트(캡션) 추가 (항상 전송, 없으면 빈 문자열)
      formData.append("prompt", caption.trim() || "");

      // API 호출
      // 일반 로그인은 accessToken을 localStorage에서 가져와서 사용
      const accessToken = typeof window !== "undefined" 
        ? localStorage.getItem("accessToken") 
        : null;

      const headers: HeadersInit = {};
      // 일반 로그인인 경우 Authorization 헤더 추가
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
      // FormData를 보낼 때는 Content-Type을 설정하지 않음 (브라우저가 자동으로 boundary 설정)

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers,
        credentials: "include", // HttpOnly 쿠키 포함 (카카오 로그인용)
        body: formData,
      });

      if (!response.ok) {
        // 401 Unauthorized인 경우 인증 에러 처리
        if (response.status === 401) {
          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
          setIsGenerating(false);
          return;
        }

        let errorMessage = "AI 추천 생성에 실패했습니다.";
        try {
          const errorData = await response.json();
          if (errorData && typeof errorData === "object") {
            if ("message" in errorData) {
              errorMessage = String(errorData.message);
            } else if ("error" in errorData) {
              errorMessage = String(errorData.error);
            } else if (Array.isArray(errorData) && errorData.length > 0) {
              errorMessage = errorData.map((err: unknown) => 
                typeof err === "object" && err && "message" in err 
                  ? String(err.message) 
                  : String(err)
              ).join(", ");
            }
          }
        } catch {
          // JSON 파싱 실패 시 기본 메시지 사용
          errorMessage = `요청 실패 (${response.status} ${response.statusText})`;
        }
        setError(errorMessage);
        setIsGenerating(false);
        return;
      }

      const data = await response.json();

      // 응답 데이터 처리
      if (data && typeof data === "object" && "post" in data) {
        const post = data.post;
        if (post && typeof post === "object") {
          const captionText = "caption" in post ? String(post.caption) : "";
          const hashtags = "hashtags" in post && Array.isArray(post.hashtags)
            ? post.hashtags.map((tag: unknown) => String(tag))
            : [];

          setGeneratedCaption(captionText);
          setGeneratedHashtags(hashtags);
          setShowResult(true);
        } else {
          throw new Error("응답 데이터를 해석하지 못했습니다.");
        }
      } else {
        throw new Error("응답 데이터를 해석하지 못했습니다.");
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "AI 추천 생성 중 오류가 발생했습니다.";
      setError(message);
      alert(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePost = async () => {
    const finalCaption = caption || generatedCaption;
    addPost(selectedFiles, finalCaption, generatedHashtags);
    // Reset form
    setSelectedFiles([]);
    setPreviewUrls([]);
    setShowResult(false);
    setGeneratedCaption("");
    setGeneratedHashtags([]);
    setCaption("");
    setCurrentImageIndex(0);
    setShowSuccessModal(true);
    // 피드 목록 캐시 무효화하여 자동으로 다시 불러오기
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % previewUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + previewUrls.length) % previewUrls.length,
    );
  };

  if (showResult) {
    return (
      <>
        {isGenerating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-foreground">AI 추천 생성 중...</p>
            </div>
          </div>
        )}
        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">
            생성된 피드 미리보기
          </h2>
          <div className="flex gap-3">
            <Button onClick={() => setShowResult(false)} variant="outline">
              다시 편집
            </Button>
            <Button
              onClick={handleSavePost}
              className="bg-primary hover:bg-primary/90"
            >
              피드 저장
            </Button>
          </div>
        </div>

        <FeedPreview
          images={previewUrls}
          caption={generatedCaption}
          hashtags={generatedHashtags}
        />
      </div>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6 space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  피드가 저장되었습니다
                </h3>
                <p className="text-sm text-muted-foreground">
                  피드가 성공적으로 저장되었습니다.
                </p>
              </div>
              <Button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-primary hover:bg-primary/90"
              >
                확인
              </Button>
            </div>
          </Card>
        </div>
      )}
      </>
    );
  }

  return (
    <>
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-lg font-medium text-foreground">AI 추천 생성 중...</p>
          </div>
        </div>
      )}
      <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          새 피드 만들기
        </h2>
        <p className="text-muted-foreground">
          최대 5장의 이미지를 업로드하고 AI가 추천하는 문구를 받아보세요
        </p>
      </div>

      {selectedFiles.length === 0 ? (
        <Card className="border-2 border-dashed border-border bg-card p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground mb-1">
                이미지를 업로드하세요
              </p>
              <p className="text-sm text-muted-foreground">
                최대 5장까지 선택 가능합니다
              </p>
            </div>
            <label htmlFor="file-upload">
              <Button asChild className="cursor-pointer">
                <span>파일 선택</span>
              </Button>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side: Image viewer */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative aspect-[4/5] max-h-[400px] bg-gray-200 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrls[currentImageIndex] || "/placeholder.svg"}
                  alt={`Preview ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full w-auto h-auto object-contain"
                />

                {/* Image navigation */}
                {previewUrls.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Image indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {previewUrls.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            index === currentImageIndex
                              ? "bg-white w-2"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Thumbnail strip */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative flex-shrink-0 group">
                  <button
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Thumb ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Add more button */}
              {selectedFiles.length < 5 && (
                <label htmlFor="file-upload-more" className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-lg border-2 border-dashed border-border bg-muted hover:bg-muted/80 flex items-center justify-center cursor-pointer transition-colors">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <input
                    id="file-upload-more"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Right side: Profile and caption input */}
          <div className="space-y-4">
            <Card className="p-4">
              {/* Profile section */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
                  {user?.username?.[0]?.toUpperCase() ||
                    user?.userId?.[0]?.toUpperCase() ||
                    "U"}
                </div>
                <span className="font-semibold text-foreground">
                  {user?.username || user?.userId || "User"}
                </span>
              </div>

              {/* Caption textarea */}
              <div className="space-y-2">
                <label
                  htmlFor="caption"
                  className="text-sm font-medium text-foreground"
                >
                  문구 작성
                </label>
                <textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="문구를 입력하세요..."
                  className="w-full min-h-[200px] p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground">
                  {caption.length} / 2,200
                </p>
              </div>
            </Card>

            {/* Action buttons */}
            <div className="space-y-2">
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button
                onClick={generateContent}
                disabled={isGenerating || selectedFiles.length === 0}
                className="flex-1 bg-primary hover:bg-primary/90 gap-2 disabled:opacity-60 disabled:pointer-events-none"
              >
                <Sparkles className="w-5 h-5" />
                {isGenerating ? "AI 추천 생성 중..." : "AI 추천 받기"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    {/* Success Modal */}
    {showSuccessModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <Card className="w-full max-w-md p-6 space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                피드가 저장되었습니다
              </h3>
              <p className="text-sm text-muted-foreground">
                피드가 성공적으로 저장되었습니다.
              </p>
            </div>
            <Button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              확인
            </Button>
          </div>
        </Card>
      </div>
    )}
    </>
  );
}
