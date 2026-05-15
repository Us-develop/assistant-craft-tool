import { LogOut } from "lucide-react";
import { auth, signOut } from "@/lib/auth";

export default async function SignOutButton() {
  const session = await auth();
  if (!session) return null;

  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
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
