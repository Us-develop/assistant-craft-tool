import { WizardProvider } from "@/components/wizard/WizardContext";
import WizardContainer from "@/components/wizard/WizardContainer";
import { ToastProvider } from "@/components/ui/Toast";

export default function Home() {
  return (
    <ToastProvider>
      <WizardProvider>
        <WizardContainer />
      </WizardProvider>
    </ToastProvider>
  );
}
