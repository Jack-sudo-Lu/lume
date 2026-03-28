"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthProvider";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { login, register } = useAuth();

  useEffect(() => {
    if (open) {
      setNickname("");
      setPassword("");
      setError("");
      setSubmitting(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, mode]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!nickname.trim() || !password) {
      setError("请填写昵称和密码");
      return;
    }
    setSubmitting(true);
    setError("");

    const err =
      mode === "login"
        ? await login(nickname.trim(), password)
        : await register(nickname.trim(), password);

    setSubmitting(false);
    if (err) {
      setError(err);
    } else {
      onClose();
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-bg-primary rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-slide-reveal">
        {/* Decorative header */}
        <div className="relative h-24 bg-gradient-to-br from-accent/20 via-accent-light/30 to-bg-tertiary overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-bg-primary/80 flex items-center justify-center shadow-lg">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-accent"
              >
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="absolute top-3 right-5 w-2 h-2 rounded-full bg-accent/30" />
          <div className="absolute top-7 right-10 w-1.5 h-1.5 rounded-full bg-accent/20" />
          <div className="absolute bottom-5 left-7 w-1.5 h-1.5 rounded-full bg-accent/25" />
        </div>

        <div className="p-7 pt-5">
          <h3 className="text-center text-lg font-light text-text-primary mb-1">
            {mode === "login" ? "欢迎回来" : "加入 Lume"}
          </h3>
          <p className="text-center text-xs text-text-muted font-mono mb-6">
            {mode === "login" ? "Sign In" : "Create Account"}
          </p>

          <div className="space-y-3 mb-5">
            <div>
              <input
                ref={inputRef}
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder="昵称"
                maxLength={20}
                className="w-full rounded-xl border border-border-light bg-bg-secondary text-text-primary text-sm px-4 py-3 text-left focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text-muted"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
                placeholder="密码"
                className="w-full rounded-xl border border-border-light bg-bg-secondary text-text-primary text-sm px-4 py-3 text-left focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text-muted"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-error text-center mb-4 animate-fade-in">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full text-sm py-2.5 rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {submitting
              ? "..."
              : mode === "login"
                ? "登录"
                : "注册"}
          </button>

          <p className="text-center text-xs text-text-muted mt-4">
            {mode === "login" ? "还没有账号？" : "已有账号？"}
            <button
              onClick={toggleMode}
              className="text-accent hover:text-accent-hover ml-1 transition-colors"
            >
              {mode === "login" ? "注册" : "登录"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
