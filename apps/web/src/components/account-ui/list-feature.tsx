"use client";

import { WalletButton } from "@/providers/solana-provider";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AccountListFeature = () => {
  const { publicKey } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (publicKey) {
      router.push(`account/${publicKey.toString()}`);
    }
  }, [publicKey, router]);

  return (
    <div className="hero py-[64px]">
      <div className="flex flex-col gap-4">
        <WalletButton />
      </div>
    </div>
  );
};

export default AccountListFeature;
