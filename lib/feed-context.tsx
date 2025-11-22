"use client";

import { createContext, type ReactNode, useContext, useState, useEffect } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://sns-ai-backend-production.up.railway.app";

export interface FeedPost {
  id: string;
  images?: File[];
  imageUrls: string[];
  caption: string;
  hashtags: string[];
  createdAt: Date | string;
}

interface FeedContextType {
  posts: FeedPost[];
  isLoading: boolean;
  addPost: (images: File[], caption: string, hashtags: string[]) => void;
  fetchPosts: () => Promise<void>;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const accessToken = typeof window !== "undefined" 
        ? localStorage.getItem("accessToken") 
        : null;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error("피드 목록을 불러오는데 실패했습니다.");
      }

      const data = await response.json();

      // API 응답을 FeedPost 형식으로 변환
      interface ApiPost {
        _id?: string;
        id?: string;
        imageUrls?: string[];
        caption?: string;
        hashtags?: string[];
        createdAt?: string;
      }

      if (Array.isArray(data)) {
        const formattedPosts: FeedPost[] = data.map((post: ApiPost) => ({
          id: post._id || post.id || Date.now().toString(),
          imageUrls: post.imageUrls || [],
          caption: post.caption || "",
          hashtags: post.hashtags || [],
          createdAt: post.createdAt || new Date().toISOString(),
        }));
        setPosts(formattedPosts);
      } else if (data && typeof data === "object" && "posts" in data && Array.isArray(data.posts)) {
        // 응답이 { posts: [...] } 형태인 경우
        const formattedPosts: FeedPost[] = (data.posts as ApiPost[]).map((post: ApiPost) => ({
          id: post._id || post.id || Date.now().toString(),
          imageUrls: post.imageUrls || [],
          caption: post.caption || "",
          hashtags: post.hashtags || [],
          createdAt: post.createdAt || new Date().toISOString(),
        }));
        setPosts(formattedPosts);
      }
    } catch (error) {
      console.error("피드 목록 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 피드 목록 불러오기
  useEffect(() => {
    fetchPosts();
  }, []);

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
    <FeedContext.Provider value={{ posts, isLoading, addPost, fetchPosts }}>
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
