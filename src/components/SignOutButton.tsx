"use client";

import { BookOpen, LayoutDashboard, LogOut } from "lucide-react";

export default function SignOutButton({ isAdmin }: { isAdmin: boolean }) {
  async function handleSignOut() {
    await fetch("/api/signout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-wrap items-center justify-end gap-2">
      {isAdmin && (
        <a
          href="/admin"
          className="inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-card) px-4 py-2 text-xs font-medium text-(--color-foreground) shadow-lg transition-opacity hover:opacity-80"
          title="Admin — submissions and user management"
        >
          <LayoutDashboard size={14} aria-hidden />
          Admin
        </a>
      )}
      <a
        href="/ai-for-marketeers"
        className="inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-card) px-4 py-2 text-xs font-medium text-(--color-foreground) shadow-lg transition-opacity hover:opacity-80"
        title="AI for Marketeers — training knowledge base"
      >
        <BookOpen size={14} aria-hidden />
        Training hub
      </a>
      <button
        type="button"
        onClick={handleSignOut}
        className="inline-flex items-center gap-2 rounded-full bg-(--color-neutral-80) px-4 py-2 text-xs font-medium text-(--color-neutral-00) shadow-lg transition-opacity hover:opacity-80"
        title="Sign out"
      >
        <LogOut size={14} />
        Sign out
      </button>
    </div>
  );
}
