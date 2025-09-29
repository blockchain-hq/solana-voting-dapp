import ExplorerLink from "@/components/cluster-ui/explorer-link";
import { toast } from "sonner";

const useTransactionToast = () => {
  return (signature: string) => {
    toast("Transaction sent", {
      description: (
        <ExplorerLink path={`tx/${signature}`} label={"View on Explorer"} />
      ),
    });
  };
};

export default useTransactionToast;
