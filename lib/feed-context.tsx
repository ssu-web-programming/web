"use client";

import { createContext, type ReactNode, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";

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
  refetchPosts: () => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

// API 응답을 FeedPost 형식으로 변환하는 함수
interface ApiPost {
  _id?: string;
  id?: string;
  imageUrls?: string[];
  caption?: string;
  hashtags?: string[];
  createdAt?: string;
}

function transformApiResponse(data: unknown): FeedPost[] {
  if (Array.isArray(data)) {
    return data.map((post: ApiPost) => ({
      id: post._id || post.id || Date.now().toString(),
      imageUrls: post.imageUrls || [],
      caption: post.caption || "",
      hashtags: post.hashtags || [],
      createdAt: post.createdAt || new Date().toISOString(),
    }));
  } else if (data && typeof data === "object" && "posts" in data && Array.isArray(data.posts)) {
    return (data.posts as ApiPost[]).map((post: ApiPost) => ({
      id: post._id || post.id || Date.now().toString(),
      imageUrls: post.imageUrls || [],
      caption: post.caption || "",
      hashtags: post.hashtags || [],
      createdAt: post.createdAt || new Date().toISOString(),
    }));
  }
  return [];
}

// 피드 목록을 가져오는 함수
export async function fetchPostsApi(): Promise<FeedPost[]> {
  // 일반 로그인은 accessToken을 localStorage에서 가져와서 사용
  const accessToken = typeof window !== "undefined" 
    ? localStorage.getItem("accessToken") 
    : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  // 일반 로그인인 경우 Authorization 헤더 추가
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "GET",
    headers,
    credentials: "include", // HttpOnly 쿠키 포함 (카카오 로그인용)
  });

  if (!response.ok) {
    // 401 Unauthorized인 경우 인증 에러 처리
    if (response.status === 401) {
      // 동적 import로 handleAuthError 사용
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
    }
    throw new Error("피드 목록을 불러오는데 실패했습니다.");
  }

  const data = await response.json();
  return transformApiResponse(data);
}

export function FeedProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const refetchPosts = () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

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
    // Optimistic update
    queryClient.setQueryData<FeedPost[]>(["posts"], (old = []) => [newPost, ...old]);
  };

  // feed-list-page에서 직접 useQuery를 사용하므로 여기서는 빈 배열과 false를 반환
  const posts: FeedPost[] = [];
  const isLoading = false;
  const fetchPosts = async () => {
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <FeedContext.Provider value={{ posts, isLoading, addPost, fetchPosts, refetchPosts }}>
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
