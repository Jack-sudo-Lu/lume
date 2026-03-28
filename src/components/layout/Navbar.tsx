"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { UserAvatar } from "@/components/auth/UserAvatar";
import { AuthModal } from "@/components/auth/AuthModal";

const navLinks = [
  { href: "/poem", label: "Poem" },
  { href: "/blindbox", label: "Blind Box" },
  { href: "/books", label: "Books" },
  { href: "/shelf", label: "Shelf" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-bg-primary/80 border-b border-border-light">
        <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="font-sans text-xl tracking-tight font-light text-text-primary hover:text-accent transition-colors duration-150"
          >
            Lume
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm tracking-wide transition-colors duration-150 ${
                      pathname === link.href
                        ? "text-accent"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Auth area */}
            {!loading && (
              user ? (
                <UserAvatar />
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="text-xs font-mono tracking-wider text-text-tertiary hover:text-accent transition-colors duration-150"
                >
                  Login
                </button>
              )
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-3">
            {!loading && (
              user ? (
                <UserAvatar />
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="text-xs font-mono tracking-wider text-text-tertiary hover:text-accent transition-colors duration-150"
                >
                  Login
                </button>
              )
            )}
            <button
              className="p-2 -mr-2 text-text-secondary hover:text-text-primary"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {menuOpen ? (
                  <path
                    d="M5 5L15 15M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                ) : (
                  <>
                    <path d="M3 6H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M3 10H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile menu overlay */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 top-14 bg-bg-primary/95 backdrop-blur-lg z-40 animate-fade-in">
            <ul className="flex flex-col items-center justify-center h-full gap-10">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-2xl font-light tracking-wide transition-colors duration-150 ${
                      pathname === link.href
                        ? "text-accent"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
