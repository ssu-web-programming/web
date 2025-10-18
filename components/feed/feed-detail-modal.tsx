"use client"

import { useState, useEffect } from "react"
import { X, Heart, MessageCircle, Send, Bookmark, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { FeedPost } from "@/lib/feed-context"

interface FeedDetailModalProps {
    post: FeedPost
    onClose: () => void
}

export function FeedDetailModal({ post, onClose }: FeedDetailModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const { user } = useAuth()

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
        setCurrentImageIndex((prev) => (prev + 1) % post.images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length)
    }

    const formatDate = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return "방금 전"
        if (minutes < 60) return `${minutes}분 전`
        if (hours < 24) return `${hours}시간 전`
        return `${days}일 전`
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4" onClick={onClose}>
            <div
                className="relative w-full max-w-5xl max-h-[90vh] bg-card rounded-lg overflow-hidden shadow-2xl flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/80 hover:bg-background text-foreground rounded-full flex items-center justify-center transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Image section */}
                <div className="relative flex-1 bg-muted flex items-center justify-center">
                    <div className="relative w-full aspect-square md:aspect-auto md:h-full">
                        <img
                            src={post.imageUrls[currentImageIndex] || "/placeholder.svg"}
                            alt={`Post image ${currentImageIndex + 1}`}
                            className="w-full h-full object-contain"
                        />

                        {post.images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background text-foreground rounded-full flex items-center justify-center transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background text-foreground rounded-full flex items-center justify-center transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Dots indicator */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {post.images.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full transition-colors ${
                                                index === currentImageIndex ? "bg-primary" : "bg-background/60"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Content section */}
                <div className="w-full md:w-96 flex flex-col border-l border-border">
                    {/* Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-border">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary-foreground">{user?.username?.[0].toUpperCase()}</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-foreground text-sm">{user?.username}</p>
                        </div>
                    </div>

                    {/* Caption and comments */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="space-y-2">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary-foreground">
                    {user?.username?.[0].toUpperCase()}
                  </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-foreground">
                                        <span className="font-semibold">{user?.username}</span> {post.caption}
                                    </p>
                                    <p className="text-sm text-primary mt-2">{post.hashtags.join(" ")}</p>
                                    <p className="text-xs text-muted-foreground mt-2">{formatDate(post.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setLiked(!liked)} className="hover:opacity-70 transition-opacity">
                                    <Heart className={`w-6 h-6 ${liked ? "fill-red-500 text-red-500" : "text-foreground"}`} />
                                </button>
                                <button className="hover:opacity-70 transition-opacity">
                                    <MessageCircle className="w-6 h-6 text-foreground" />
                                </button>
                                <button className="hover:opacity-70 transition-opacity">
                                    <Send className="w-6 h-6 text-foreground" />
                                </button>
                            </div>
                            <button onClick={() => setSaved(!saved)} className="hover:opacity-70 transition-opacity">
                                <Bookmark className={`w-6 h-6 ${saved ? "fill-foreground text-foreground" : "text-foreground"}`} />
                            </button>
                        </div>

                        <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
