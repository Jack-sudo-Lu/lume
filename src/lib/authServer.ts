import fs from "fs";
import path from "path";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User, UserProfile, ShelfItem } from "@/types";

const USERS_PATH = path.join(process.cwd(), "src/data/users.json");
const SESSIONS_PATH = path.join(process.cwd(), "src/data/sessions.json");

// ===== Users =====

function readUsers(): User[] {
  const raw = fs.readFileSync(USERS_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeUsers(users: User[]) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), "utf-8");
}

function readSessions(): Record<string, string> {
  const raw = fs.readFileSync(SESSIONS_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeSessions(sessions: Record<string, string>) {
  fs.writeFileSync(SESSIONS_PATH, JSON.stringify(sessions, null, 2), "utf-8");
}

function toProfile(user: User): UserProfile {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...profile } = user;
  return profile;
}

// ===== Auth =====

export async function registerUser(
  nickname: string,
  password: string
): Promise<{ profile: UserProfile; token: string } | { error: string }> {
  const users = readUsers();

  if (users.some((u) => u.nickname === nickname)) {
    return { error: "昵称已存在" };
  }

  if (nickname.length < 1 || nickname.length > 20) {
    return { error: "昵称长度需要1-20个字符" };
  }

  if (password.length < 4) {
    return { error: "密码至少4个字符" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const avatarIndex = Math.floor(Math.random() * 20) + 1;
  const user: User = {
    id: `user-${Date.now()}`,
    nickname,
    avatarUrl: `/avatars/default-${avatarIndex}.svg`,
    passwordHash,
    createdAt: new Date().toISOString(),
    shelf: [],
  };

  users.push(user);
  writeUsers(users);

  const token = createSession(user.id);
  return { profile: toProfile(user), token };
}

export async function loginUser(
  nickname: string,
  password: string
): Promise<{ profile: UserProfile; token: string } | { error: string }> {
  const users = readUsers();
  const user = users.find((u) => u.nickname === nickname);

  if (!user) {
    return { error: "用户不存在" };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "密码错误" };
  }

  const token = createSession(user.id);
  return { profile: toProfile(user), token };
}

// ===== Sessions =====

function createSession(userId: string): string {
  const token = crypto.randomUUID();
  const sessions = readSessions();
  sessions[token] = userId;
  writeSessions(sessions);
  return token;
}

export function deleteSession(token: string) {
  const sessions = readSessions();
  delete sessions[token];
  writeSessions(sessions);
}

export function getUserByToken(token: string): UserProfile | null {
  const sessions = readSessions();
  const userId = sessions[token];
  if (!userId) return null;

  const users = readUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return null;

  return toProfile(user);
}

// ===== Profile =====

export function updateUserProfile(
  userId: string,
  updates: { nickname?: string; avatarUrl?: string }
): UserProfile | { error: string } {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { error: "用户不存在" };

  if (updates.nickname !== undefined) {
    if (updates.nickname.length < 1 || updates.nickname.length > 20) {
      return { error: "昵称长度需要1-20个字符" };
    }
    const taken = users.some(
      (u) => u.nickname === updates.nickname && u.id !== userId
    );
    if (taken) return { error: "昵称已存在" };
    users[idx].nickname = updates.nickname;
  }

  if (updates.avatarUrl !== undefined) {
    users[idx].avatarUrl = updates.avatarUrl;
  }

  writeUsers(users);
  return toProfile(users[idx]);
}

// ===== Shelf =====

export function getUserShelf(userId: string): ShelfItem[] {
  const users = readUsers();
  const user = users.find((u) => u.id === userId);
  return user?.shelf ?? [];
}

export function addToUserShelf(
  userId: string,
  item: ShelfItem
): ShelfItem[] | { error: string } {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { error: "用户不存在" };

  if (users[idx].shelf.some((s) => s.bookId === item.bookId)) {
    return { error: "书已在书架中" };
  }

  users[idx].shelf.push(item);
  writeUsers(users);
  return users[idx].shelf;
}

export function updateUserShelfItem(
  userId: string,
  bookId: string,
  updates: Partial<ShelfItem>
): ShelfItem[] | { error: string } {
  const users = readUsers();
  const userIdx = users.findIndex((u) => u.id === userId);
  if (userIdx === -1) return { error: "用户不存在" };

  const itemIdx = users[userIdx].shelf.findIndex((s) => s.bookId === bookId);
  if (itemIdx === -1) return { error: "书不在书架中" };

  users[userIdx].shelf[itemIdx] = {
    ...users[userIdx].shelf[itemIdx],
    ...updates,
  };
  writeUsers(users);
  return users[userIdx].shelf;
}

export function removeFromUserShelf(
  userId: string,
  bookId: string
): ShelfItem[] | { error: string } {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return { error: "用户不存在" };

  users[idx].shelf = users[idx].shelf.filter((s) => s.bookId !== bookId);
  writeUsers(users);
  return users[idx].shelf;
}

export function mergeShelf(
  userId: string,
  localShelf: ShelfItem[]
): ShelfItem[] {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return [];

  const existingIds = new Set(users[idx].shelf.map((s) => s.bookId));
  const newItems = localShelf.filter((s) => !existingIds.has(s.bookId));
  users[idx].shelf.push(...newItems);
  writeUsers(users);
  return users[idx].shelf;
}
