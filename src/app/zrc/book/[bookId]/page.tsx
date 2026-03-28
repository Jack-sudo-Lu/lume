"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getZrcBookById, getZrcPosts, addZrcPost, addZrcComment } from "@/lib/zrc";
import { ZrcBook, ZrcForumPost } from "@/types";
import { ZrcPostCard } from "@/components/zrc/ZrcPostCard";
import { ZrcPostEditor } from "@/components/zrc/ZrcPostEditor";
import { ZrcCommentSection } from "@/components/zrc/ZrcCommentSection";
import { ZrcProgressEditor } from "@/components/zrc/ZrcProgressEditor";
import { useAuth } from "@/components/auth/AuthProvider";

export default function ZrcBookForumPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.bookId as string;

  const [book, setBook] = useState<ZrcBook | null>(null);
  const [posts, setPosts] = useState<ZrcForumPost[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [showProgressEditor, setShowProgressEditor] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ZrcForumPost | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const bookData = getZrcBookById(bookId);
    if (!bookData) {
      router.push("/zrc");
      return;
    }
    setBook(bookData);
    setPosts(getZrcPosts(bookId));
  }, [bookId, router]);

  const handleAddPost = (post: {
    type: "question" | "essay" | "fanfic";
    title: string;
    content: string;
  }) => {
    addZrcPost({
      bookId,
      type: post.type,
      title: post.title,
      content: post.content,
      authorId: user?.id ?? "anonymous",
      authorName: user?.nickname ?? "\u533f\u540d\u8bfb\u8005",
    });
    setPosts(getZrcPosts(bookId));
    setShowEditor(false);
  };

  const handleAddComment = (postId: string, content: string) => {
    addZrcComment(postId, {
      content,
      authorId: user?.id ?? "anonymous",
      authorName: user?.nickname ?? "\u533f\u540d\u8bfb\u8005",
    });
    setPosts(getZrcPosts(bookId));
  };

  const handleProgressSave = (progress: string) => {
    if (book) {
      setBook({ ...book, progress });
    }
  };

  if (!book) return null;

  const coverUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`
    : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <Link
        href="/zrc"
        className="text-xs text-text-tertiary hover:text-text-primary transition-colors mb-8 inline-block"
      >
        &larr; 返回 ZRC
      </Link>

      {/* Book Info */}
      <div className="flex flex-col sm:flex-row gap-6 mb-12 pb-12 border-b border-border-light">
        <div className="w-32 sm:w-40 flex-shrink-0">
          <div className="aspect-[2/3] bg-bg-tertiary rounded overflow-hidden">
            {coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverUrl}
                alt={book.titleCn}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-light text-text-primary mb-1">
            {book.titleCn}
          </h1>
          <p className="text-sm text-text-tertiary mb-4">{book.title}</p>
          <p className="text-sm text-text-secondary mb-3">
            {book.authorCn}
            <span className="text-text-muted mx-2">&middot;</span>
            <span className="text-text-muted">{book.author}</span>
          </p>
          {book.status === "reading" && (
            <div className="flex items-center gap-3">
              <p className="text-sm text-accent font-mono">
                进度：{book.progress || "未设置"}
              </p>
              <button
                onClick={() => setShowProgressEditor(true)}
                className="text-xs px-3 py-1 rounded-lg border border-border-light text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
              >
                编辑进度
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Forum */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-mono text-text-tertiary tracking-wider uppercase">
          论坛 &middot; {posts.length} 篇帖子
        </span>
        <button
          onClick={() => setShowEditor(true)}
          className="text-sm px-5 py-2 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors"
        >
          发表新帖
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-text-muted text-sm">
          还没有帖子，来写第一篇吧
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id}>
              <ZrcPostCard
                post={post}
                onClick={() =>
                  setSelectedPost(
                    selectedPost?.id === post.id ? null : post
                  )
                }
              />
              {selectedPost?.id === post.id && (
                <div className="ml-4 mt-2 p-6 rounded-lg bg-bg-secondary/30 border border-border-light animate-fade-in">
                  <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap mb-4">
                    {post.content}
                  </p>
                  <ZrcCommentSection
                    comments={post.comments}
                    onAddComment={(content) =>
                      handleAddComment(post.id, content)
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Post Editor Modal */}
      {showEditor && (
        <ZrcPostEditor
          bookId={bookId}
          onClose={() => setShowEditor(false)}
          onSubmit={handleAddPost}
        />
      )}

      {/* Progress Editor Modal */}
      {showProgressEditor && (
        <ZrcProgressEditor
          bookId={bookId}
          currentProgress={book?.progress}
          onClose={() => setShowProgressEditor(false)}
          onSave={handleProgressSave}
        />
      )}
    </div>
  );
}
