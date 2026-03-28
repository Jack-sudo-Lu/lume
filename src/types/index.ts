// ===== Poem =====
export interface Poem {
  id: string;
  title: string;
  titleCn: string;
  poet: string;
  poetCn: string;
  nationality: string;
  era: string;
  lines: string[];
  linesCn: string[];
  translator?: string;
  source?: string;
  tags: string[];
}

// ===== Blind Box Excerpt =====
export interface BookExcerpt {
  id: string;
  content: string;
  contentOriginal?: string;
  estimatedReadMinutes: number;
  book: BookReference;
}

export interface BookReference {
  id: string;
  title: string;
  titleCn: string;
  author: string;
  authorCn: string;
  isbn?: string;
}

// ===== Book =====
export interface Book {
  id: string;
  title: string;
  titleCn: string;
  author: string;
  authorCn: string;
  nationality: string;
  isbn?: string;
  coverUrl?: string;
  description: string;
  genre: string[];
  tags: string[];
  publishYear?: number;
  pages?: number;
  recommendationReason?: string;
  relatedBookIds: string[];
}

// ===== User Data =====
export interface ShelfItem {
  bookId: string;
  addedAt: string;
  status: "want-to-read" | "reading" | "finished";
  rating?: number;
  note?: string;
  finishedAt?: string;
}

export interface UserData {
  shelf: ShelfItem[];
  lastBlindBoxDate?: string;
}

// ===== Auth =====
export interface User {
  id: string;
  nickname: string;
  avatarUrl: string;
  passwordHash: string;
  createdAt: string;
  shelf: ShelfItem[];
}

export type UserProfile = Omit<User, "passwordHash">;

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
}

// ===== ZRC =====
export interface ZrcBook {
  bookId: string;
  title: string;
  titleCn: string;
  author: string;
  authorCn: string;
  isbn?: string;
  status: "reading" | "finished" | "planned";
  progress?: string;
}

export interface ZrcActivity {
  date: string;
  time: string;
  location: string;
  currentBook: string;
  readingTarget?: string;
}

export interface ZrcComment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface ZrcForumPost {
  id: string;
  bookId: string;
  type: "question" | "essay" | "fanfic";
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  comments: ZrcComment[];
}

export interface ZrcData {
  books: ZrcBook[];
  activity: ZrcActivity;
}
