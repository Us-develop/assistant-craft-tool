import { notFound } from "next/navigation";
import { TenantProvider } from "@/components/TenantProvider";
import { WizardProvider } from "@/components/wizard/WizardContext";
import WizardContainer from "@/components/wizard/WizardContainer";
import { ToastProvider } from "@/components/ui/Toast";
import { getTenant } from "@/lib/tenants";

type Props = { params: Promise<{ tenant: string }> };

export default async function TenantWizardPage({ params }: Props) {
  const { tenant: slug } = await params;
  const tenant = getTenant(slug);
  if (!tenant) notFound();

  return (
    <TenantProvider tenant={tenant}>
      <ToastProvider>
        <WizardProvider defaultLang={tenant.defaultLang}>
          <WizardContainer />
        </WizardProvider>
      </ToastProvider>
    </TenantProvider>
  );
}
