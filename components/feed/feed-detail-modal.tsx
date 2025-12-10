"use client"

import { useState, useEffect } from "react"
import { X, Heart, MessageCircle, Send, Bookmark, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Card } from "@/components/ui/card"
import type { FeedPost } from "@/lib/feed-context"
import { deletePostApi } from "@/lib/feed-context"
import { useQueryClient } from "@tanstack/react-query"

interface FeedDetailModalProps {
    post: FeedPost
    onClose: () => void
    onDelete?: () => void
}

export function FeedDetailModal({ post, onClose, onDelete }: FeedDetailModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const { user } = useAuth()
    const queryClient = useQueryClient()

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [])

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleEscape)
        return () => window.removeEventListener("keydown", handleEscape)
    }, [onClose])

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % post.imageUrls.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + post.imageUrls.length) % post.imageUrls.length)
    }

    const formatDate = (date: Date | string) => {
        const now = new Date()
        const dateObj = typeof date === "string" ? new Date(date) : date
        const diff = now.getTime() - dateObj.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return "방금 전"
        if (minutes < 60) return `${minutes}분 전`
        if (hours < 24) return `${hours}시간 전`
        return `${days}일 전`
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deletePostApi(post.id)
            // 피드 목록 새로고침
            queryClient.invalidateQueries({ queryKey: ["posts"] })
            // 모달 닫기
            onClose()
            // 부모 컴포넌트에 삭제 알림 (선택사항)
            if (onDelete) {
                onDelete()
            }
        } catch (error) {
            console.error("게시물 삭제 실패:", error)
            alert(error instanceof Error ? error.message : "게시물 삭제에 실패했습니다.")
        } finally {
            setIsDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 z-10 w-10 h-10 bg-background/90 hover:bg-background text-foreground rounded-full flex items-center justify-center transition-colors shadow-lg"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Feed Preview Card */}
                <Card className="max-w-[400px] max-h-[600px] overflow-hidden border border-border flex flex-col p-3">
                    {/* Header */}
                    <div className="flex items-center gap-3 p-2 border-b border-border">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary-foreground">
                                {user?.username?.[0]?.toUpperCase() ||
                                    user?.userId?.[0]?.toUpperCase() ||
                                    "U"}
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-foreground text-sm">
                                {user?.username || user?.userId || "User"}
                            </p>
                        </div>
                    </div>

                    {/* Image carousel */}
                    <div className="relative aspect-square bg-muted flex-shrink-0 overflow-hidden max-h-[300px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={post.imageUrls[currentImageIndex] || "/placeholder.svg"}
                            alt={`Feed image ${currentImageIndex + 1}`}
                            className="w-full h-full object-contain"
                        />

                        {post.imageUrls.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 text-foreground rounded-full flex items-center justify-center hover:bg-background transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 text-foreground rounded-full flex items-center justify-center hover:bg-background transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>

                                {/* Dots indicator */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                    {post.imageUrls.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                                index === currentImageIndex
                                                    ? "bg-primary"
                                                    : "bg-background/60"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="p-3 space-y-3 flex-shrink overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setLiked(!liked)}
                                    className="hover:opacity-70 transition-opacity"
                                >
                                    <Heart
                                        className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : "text-foreground"}`}
                                    />
                                </button>
                                <button className="hover:opacity-70 transition-opacity">
                                    <MessageCircle className="w-5 h-5 text-foreground" />
                                </button>
                                <button className="hover:opacity-70 transition-opacity">
                                    <Send className="w-5 h-5 text-foreground" />
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="hover:opacity-70 transition-opacity"
                                >
                                    <Trash2 className="w-5 h-5 text-foreground" />
                                </button>
                            </div>
                            <button
                                onClick={() => setSaved(!saved)}
                                className="hover:opacity-70 transition-opacity"
                            >
                                <Bookmark
                                    className={`w-6 h-6 ${saved ? "fill-foreground text-foreground" : "text-foreground"}`}
                                />
                            </button>
                        </div>

                        {/* Caption */}
                        <div className="space-y-2">
                            {/* 사용자 이름 */}
                            <p className="text-sm font-semibold text-foreground">
                                {user?.username || user?.userId || "User"}
                            </p>
                            {/* 해시태그 */}
                            <div className="text-sm flex flex-wrap gap-1">
                                {post.hashtags.map((tag, index) => {
                                    // 해시태그에서 # 제거
                                    const tagWithoutHash = tag.replace(/^#/, "");
                                    return (
                                        <a
                                            key={index}
                                            href={`https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(tagWithoutHash)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#4150f7] hover:underline"
                                        >
                                            {tag}
                                        </a>
                                    );
                                })}
                            </div>
                            {/* 캡션 */}
                            <p className="text-sm text-foreground">
                                {post.caption}
                            </p>
                        </div>

                        <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                    </div>
                </Card>
            </div>

            {/* 삭제 확인 모달 */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => !isDeleting && setShowDeleteConfirm(false)}>
                    <div
                        className="bg-card border border-border rounded-lg p-6 max-w-sm w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            게시물 삭제
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            정말 삭제하시겠어요?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? "삭제 중..." : "삭제"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
