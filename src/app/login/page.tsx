"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import TiledBackground from "@/components/TiledBackground";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [credError, setCredError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCredentialsLogin(e: React.FormEvent) {
    e.preventDefault();
    setCredError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      callbackUrl,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setCredError("Invalid username or password, or account expired.");
      return;
    }

    window.location.href = callbackUrl;
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4">
      <TiledBackground />
      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/40 bg-white/50 p-8 text-center shadow-lg backdrop-blur-xl">
        <h1 className="mb-2 text-2xl">Assistant Builder</h1>
        <p className="mb-8 text-(--color-muted-foreground)">
          Sign in to continue
        </p>

        {error === "AccessDenied" && (
          <div className="dont-box mb-6 text-left text-sm">
            <strong>Access denied.</strong> Your Google account is not on the
            allowed list. Contact an administrator if you think this is a
            mistake.
          </div>
        )}

        {error && error !== "AccessDenied" && (
          <div className="dont-box mb-6 text-left text-sm">
            <strong>Sign-in failed.</strong> Something went wrong during
            authentication. Please try again.
          </div>
        )}

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl })}
          className="btn-primary w-full gap-3"
        >
          <GoogleIcon />
          Sign in with Google
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-(--color-border)" />
          <span className="text-xs uppercase tracking-wide text-(--color-muted-foreground)">
            or
          </span>
          <div className="h-px flex-1 bg-(--color-border)" />
        </div>

        <form onSubmit={handleCredentialsLogin} className="space-y-3">
          <p className="mb-1 text-xs uppercase tracking-wide text-(--color-muted-foreground)">
            Training login
          </p>

          {credError && (
            <div className="dont-box text-left text-sm">
              <strong>Login failed.</strong> {credError}
            </div>
          )}

          <input
            type="text"
            required
            autoComplete="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field w-full"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field w-full"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
