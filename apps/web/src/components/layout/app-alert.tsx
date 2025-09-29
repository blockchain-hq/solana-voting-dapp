import { AlertCircle } from "lucide-react";
import { ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface AppAlertProps {
  action: ReactNode;
  children: ReactNode;
}

const AppAlert = (props: AppAlertProps) => {
  const { action, children } = props;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{children}</AlertTitle>
      <AlertDescription className="flex justify-end">{action}</AlertDescription>
    </Alert>
  );
};

export default AppAlert;
