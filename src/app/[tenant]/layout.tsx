import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTenant } from "@/lib/tenants";
import { tenantThemeStyle } from "@/lib/tenantTheme";

type Props = {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tenant: slug } = await params;
  const tenant = getTenant(slug);
  if (!tenant) return { title: "Not found" };

  return {
    title: `${tenant.name} — Assistant Craft Tool`,
    description: tenant.description.en,
    icons: { icon: tenant.logoSrc },
  };
}

export default async function TenantLayout({ children, params }: Props) {
  const { tenant: slug } = await params;
  const tenant = getTenant(slug);
  if (!tenant) notFound();

  const themeStyle = tenantThemeStyle(tenant);

  return (
    <div className="min-h-dvh" style={themeStyle}>
      {children}
    </div>
  );
}
