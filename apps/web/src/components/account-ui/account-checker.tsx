import { useGetBalance } from "@/hooks/use-account-data";
import AppAlert from "../layout/app-alert";
import { Button } from "../ui/button";
import { useCluster } from "@/providers/cluster-provider";
import { useRequestAirdrop } from "@/hooks/use-account-data";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

const AccountBalanceCheck = ({ address }: { address: PublicKey }) => {
  const { cluster } = useCluster();
  const mutation = useRequestAirdrop({ address });
  const query = useGetBalance({ address });

  if (query.isLoading) {
    return <div>Loading balance...</div>;
  }

  // Only show alert for actual errors
  if (query.isError) {
    console.log("Balance query error:", query.error);
    return (
      <AppAlert
        action={
          <Button
            variant="outline"
            onClick={() =>
              mutation.mutateAsync(1).catch((err) => console.log(err))
            }
          >
            Request Airdrop
          </Button>
        }
      >
        Error fetching account data on <strong>{cluster.name}</strong>. Your
        account may not exist on this cluster.
      </AppAlert>
    );
  }

  // Show airdrop option for zero balance (query.data === 0)
  if (query.data === 0) {
    console.log("Account has zero balance");
    return (
      <AppAlert
        action={
          <Button
            variant="outline"
            onClick={() =>
              mutation.mutateAsync(1).catch((err) => console.log(err))
            }
          >
            Request Airdrop
          </Button>
        }
      >
        Your account on <strong>{cluster.name}</strong> has 0 SOL balance.
        Request an airdrop to get started.
      </AppAlert>
    );
  }

  // Show airdrop option for undefined/null balance (account doesn't exist)
  if (query.data == null) {
    console.log("Account data is null/undefined - account may not exist");
    return (
      <AppAlert
        action={
          <Button
            variant="outline"
            onClick={() =>
              mutation.mutateAsync(1).catch((err) => console.log(err))
            }
          >
            Request Airdrop
          </Button>
        }
      >
        Account not found on <strong>{cluster.name}</strong>. Request an airdrop
        to create and fund the account.
      </AppAlert>
    );
  }

  console.log("Account has balance:", query.data);
  return null;
};

const AccountChecker = () => {
  const { publicKey } = useWallet();

  if (!publicKey) {
    console.log("No public key found - wallet not connected");
    return null;
  }

  console.log("Public key found:", publicKey.toString());
  return <AccountBalanceCheck address={publicKey} />;
};

export default AccountChecker;
