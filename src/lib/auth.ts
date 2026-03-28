import { UserProfile } from "@/types";

export async function fetchCurrentUser(): Promise<UserProfile | null> {
  try {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function loginUser(
  nickname: string,
  password: string
): Promise<{ user: UserProfile } | { error: string }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname, password }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error };
  return { user: data.user };
}

export async function registerUser(
  nickname: string,
  password: string
): Promise<{ user: UserProfile } | { error: string }> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname, password }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error };
  return { user: data.user };
}

export async function logoutUser(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function updateProfile(updates: {
  nickname?: string;
  avatarUrl?: string;
}): Promise<{ user: UserProfile } | { error: string }> {
  const res = await fetch("/api/auth/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error };
  return { user: data.user };
}

