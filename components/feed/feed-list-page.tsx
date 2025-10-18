"use client";

import { useState } from "react";
import type { FeedPost } from "@/lib/feed-context";
import { useFeed } from "@/lib/feed-context";
import { ImageIcon } from "lucide-react";
import { FeedDetailModal } from "@/components/feed/feed-detail-modal";

export function FeedListPage() {
  const { posts } = useFeed();
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <ImageIcon className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            아직 피드가 없습니다
          </h3>
          <p className="text-muted-foreground">
            업로드 탭에서 첫 번째 피드를 만들어보세요!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">내 피드</h2>
        <p className="text-muted-foreground">총 {posts.length}개의 게시물</p>
      </div>

      {/* Gallery grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-2">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="relative aspect-square group cursor-pointer overflow-hidden"
          >
            <img
              src={post.imageUrls[0] || "/placeholder.svg"}
              alt="Feed post"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {post.images.length > 1 && (
              <div className="absolute top-2 right-2 bg-background/80 text-foreground px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                {post.images.length}
              </div>
            )}
            <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors" />
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedPost && (
        <FeedDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
