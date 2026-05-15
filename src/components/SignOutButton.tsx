"use client";

import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <form action="/api/signout" method="POST">
      <button
        type="submit"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-(--color-neutral-80) px-4 py-2 text-xs font-medium text-(--color-neutral-00) shadow-lg transition-opacity hover:opacity-80"
        title="Sign out"
      >
        <LogOut size={14} />
        Sign out
      </button>
    </form>
  );
}
