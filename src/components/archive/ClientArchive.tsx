import Link from "next/link";
import Image from "next/image";
import { listTenants } from "@/lib/tenants";

export default function ClientArchive() {
  const tenants = listTenants();

  return (
    <main className="wizard-shell min-h-dvh py-10 sm:py-14">
      <header className="mb-10 space-y-3">
        <Image
          src="/logo-us.svg"
          alt="Gobonkers"
          width={83}
          height={40}
          className="h-9 w-auto"
          priority
        />
        <h1 className="text-2xl font-semibold text-(--color-foreground) sm:text-3xl">
          Assistant Builder
        </h1>
        <p className="max-w-xl text-sm text-(--color-muted-foreground) sm:text-base">
          Client instances of the Assistant Craft Tool. Choose a brand below to open its
          wizard.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {tenants.map((tenant) => (
          <li key={tenant.slug}>
            <Link
              href={`/${tenant.slug}`}
              className="card-elevated group flex h-full flex-col gap-4 p-5 transition-shadow hover:shadow-md sm:p-6"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={tenant.logoSrc}
                  alt={tenant.logoAlt}
                  width={120}
                  height={40}
                  className="h-8 w-auto max-w-[140px] object-contain object-left"
                />
                {tenant.archiveBadge ? (
                  <span className="rounded-full bg-(--color-muted) px-2.5 py-0.5 text-xs font-medium text-(--color-muted-foreground)">
                    {tenant.archiveBadge.nl}
                  </span>
                ) : null}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-(--color-foreground) group-hover:text-(--color-primary)">
                  {tenant.name}
                </h2>
                <p className="mt-1 text-sm text-(--color-muted-foreground)">
                  {tenant.description.nl}
                </p>
              </div>
              <span className="mt-auto text-sm font-medium text-(--color-primary)">
                Open wizard →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
