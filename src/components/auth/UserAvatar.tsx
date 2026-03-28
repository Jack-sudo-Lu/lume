"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";

export function UserAvatar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full overflow-hidden border border-border-light hover:border-accent transition-colors"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.avatarUrl}
          alt={user.nickname}
          className="w-full h-full object-cover"
        />
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-48 bg-bg-primary rounded-xl border border-border-light shadow-xl z-50 overflow-hidden animate-fade-in">
          {/* User info */}
          <div className="px-4 py-3 border-b border-border-light">
            <p className="text-sm text-text-primary font-light truncate">
              {user.nickname}
            </p>
          </div>

          {/* Actions */}
          <div className="py-1">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/profile");
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
            >
              编辑资料
            </button>
            <button
              onClick={async () => {
                setOpen(false);
                await logout();
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
