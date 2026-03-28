import { ZrcData, ZrcBook, ZrcActivity, ZrcForumPost, ZrcComment } from "@/types";
import zrcData from "@/data/zrc.json";

const FORUM_KEY = "lume_zrc_forum";

export function getZrcData(): ZrcData {
  return zrcData as ZrcData;
}

export function getZrcBooks(status?: "reading" | "finished" | "planned"): ZrcBook[] {
  const data = getZrcData();
  if (!status) return data.books;
  return data.books.filter((b) => b.status === status);
}

export function getZrcActivity(): ZrcActivity {
  return getZrcData().activity;
}

export function getZrcPosts(bookId?: string): ZrcForumPost[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FORUM_KEY);
    const posts: ZrcForumPost[] = raw ? JSON.parse(raw) : [];
    if (!bookId) return posts;
    return posts.filter((p) => p.bookId === bookId);
  } catch {
    return [];
  }
}

export function addZrcPost(post: Omit<ZrcForumPost, "id" | "createdAt" | "comments">): void {
  if (typeof window === "undefined") return;
  const posts = getZrcPosts();
  const newPost: ZrcForumPost = {
    ...post,
    id: `post-${Date.now()}`,
    createdAt: new Date().toISOString(),
    comments: [],
  };
  posts.push(newPost);
  localStorage.setItem(FORUM_KEY, JSON.stringify(posts));
}

export function addZrcComment(
  postId: string,
  comment: Omit<ZrcComment, "id" | "createdAt" | "postId">
): void {
  if (typeof window === "undefined") return;
  const posts = getZrcPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return;

  const newComment: ZrcComment = {
    ...comment,
    id: `comment-${Date.now()}`,
    postId,
    createdAt: new Date().toISOString(),
  };
  post.comments.push(newComment);
  localStorage.setItem(FORUM_KEY, JSON.stringify(posts));
}

export function getZrcBookById(bookId: string): ZrcBook | undefined {
  return getZrcData().books.find((b) => b.bookId === bookId);
}
