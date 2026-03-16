import { WizardProvider } from "@/contexts/WizardContext";
import WizardContainer from "@/components/wizard/WizardContainer";

const Index = () => (
  <WizardProvider>
    <WizardContainer />
  </WizardProvider>
);

export default Index;
