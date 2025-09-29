import { useGetBalance } from "@/hooks/use-account-data";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const BalanceSol = ({ balance }: { balance: number }) => {
  return (
    <span>{Math.round((balance / LAMPORTS_PER_SOL) * 100000) / 100000}</span>
  );
};

const AccountBalance = ({ address }: { address: PublicKey }) => {
  const query = useGetBalance({ address });

  return (
    <h1
      className="text-5xl font-bold cursor-pointer"
      onClick={() => query.refetch()}
    >
      {query.data ? <BalanceSol balance={query.data} /> : "..."} SOL
    </h1>
  );
};

export default AccountBalance;
