"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Sparkles, Upload, X } from "lucide-react";
import { useFeed } from "@/lib/feed-context";
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
  const { addPost } = useFeed();
  const { user } = useAuth();

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

  const generateContent = () => {
    // Mock AI generation - in real app, this would call an AI API
    const captions = [
      "완벽한 순간을 포착했어요! 이 특별한 날을 여러분과 공유하게 되어 기쁩니다.",
      "오늘의 하이라이트를 담았습니다. 함께해주셔서 감사해요!",
      "멋진 하루의 기록. 이 순간이 영원히 기억되길 바랍니다.",
      "특별한 순간들의 모음. 여러분도 즐거운 하루 보내세요!",
      "행복한 순간을 나눕니다. 좋은 하루 되세요!",
    ];

    const hashtagSets = [
      ["#일상", "#데일리", "#소통", "#좋아요", "#팔로우"],
      [
        "#daily",
        "#instagood",
        "#photooftheday",
        "#instadaily",
        "#likeforlikes",
      ],
      ["#감성", "#사진", "#추억", "#행복", "#일상스타그램"],
      ["#lifestyle", "#photography", "#memories", "#happiness", "#instaphoto"],
      ["#오늘", "#기록", "#순간", "#공유", "#인스타"],
    ];

    const randomCaption = captions[Math.floor(Math.random() * captions.length)];
    const randomHashtags =
      hashtagSets[Math.floor(Math.random() * hashtagSets.length)];

    setGeneratedCaption(randomCaption);
    setGeneratedHashtags(randomHashtags);
    setShowResult(true);
  };

  const handleSavePost = () => {
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
    alert("피드가 저장되었습니다!");
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
          caption={caption || generatedCaption}
          hashtags={generatedHashtags}
        />
      </div>
    );
  }

  return (
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
              <div className="relative aspect-[4/5] bg-black">
                <img
                  src={previewUrls[currentImageIndex] || "/placeholder.svg"}
                  alt={`Preview ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
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
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-foreground">
                  {user?.username}
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
            <div className="flex gap-3">
              <Button
                onClick={generateContent}
                className="flex-1 bg-primary hover:bg-primary/90 gap-2"
              >
                <Sparkles className="w-5 h-5" />
                AI 추천 받기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
