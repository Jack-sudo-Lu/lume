"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { updateProfile } from "@/lib/auth";

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();

  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
    if (user) {
      setNickname(user.nickname);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!nickname.trim()) {
      setError("昵称不能为空");
      return;
    }

    setSaving(true);
    setError("");
    const result = await updateProfile({ nickname: nickname.trim() });
    setSaving(false);

    if ("error" in result) {
      setError(result.error);
    } else {
      await refreshUser();
      setMessage("已保存");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
      <div className="mb-10">
        <span className="text-xs font-mono text-text-tertiary tracking-wider uppercase">
          Profile
        </span>
        <h1 className="text-3xl font-light text-text-primary mt-2">
          编辑资料
        </h1>
      </div>

      {/* Avatar (display only) */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border-light">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatarUrl}
            alt={user.nickname}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Nickname */}
      <div className="mb-6">
        <label className="block text-xs text-text-tertiary mb-2">昵称</label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
          maxLength={20}
          className="w-full rounded-xl border border-border-light bg-bg-secondary text-text-primary text-sm px-4 py-3 text-left focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text-muted"
        />
      </div>

      {/* Messages */}
      {error && (
        <p className="text-xs text-error text-center mb-4 animate-fade-in">
          {error}
        </p>
      )}
      {message && (
        <p className="text-xs text-success text-center mb-4 animate-fade-in">
          {message}
        </p>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full text-sm py-2.5 rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
      >
        {saving ? "保存中..." : "保存"}
      </button>

      {/* Account info */}
      <div className="mt-8 pt-6 border-t border-border-light">
        <p className="text-xs text-text-muted">
          注册时间：{new Date(user.createdAt).toLocaleDateString("zh-CN")}
        </p>
      </div>
    </div>
  );
}
