import AppModal from "../layout/app-modal";
import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useRequestAirdrop } from "@/hooks/use-account-data";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ModalAirdrop = ({ address }: { address: PublicKey }) => {
  const mutation = useRequestAirdrop({ address });
  const [amount, setAmount] = useState("2");

  return (
    <AppModal
      title="Airdrop"
      submitDisabled={!amount || mutation.isPending}
      submitLabel="Request Airdrop"
      submit={() => mutation.mutateAsync(parseFloat(amount))}
    >
      <Label htmlFor="amount">Amount</Label>
      <Input
        disabled={mutation.isPending}
        id="amount"
        min="1"
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        step="any"
        type="number"
        value={amount}
      />
    </AppModal>
  );
};

export default ModalAirdrop;
