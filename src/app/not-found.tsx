import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-(--color-primary)">404</h1>
        <p className="mb-6 text-(--color-muted-foreground)">
          Page not found.
        </p>
        <Link href="/" className="btn-primary">
          Back to wizard
        </Link>
      </div>
    </main>
  );
}
