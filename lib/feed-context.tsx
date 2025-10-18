"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

export interface FeedPost {
  id: string;
  images: File[];
  imageUrls: string[];
  caption: string;
  hashtags: string[];
  createdAt: Date;
}

interface FeedContextType {
  posts: FeedPost[];
  addPost: (images: File[], caption: string, hashtags: string[]) => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<FeedPost[]>([]);

  const addPost = (images: File[], caption: string, hashtags: string[]) => {
    const imageUrls = images.map((file) => URL.createObjectURL(file));
    const newPost: FeedPost = {
      id: Date.now().toString(),
      images,
      imageUrls,
      caption,
      hashtags,
      createdAt: new Date(),
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <FeedContext.Provider value={{ posts, addPost }}>
      {children}
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const context = useContext(FeedContext);
  if (context === undefined) {
    throw new Error("useFeed must be used within a FeedProvider");
  }
  return context;
}
