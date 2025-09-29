"use client";

import { PublicKey } from "@solana/web3.js";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import ExplorerLink from "../cluster-ui/explorer-link";
import AccountChecker from "./account-checker";
import AccountBalance from "./balance";
import AccountButtons from "./buttons";
import AccountTokens from "./tokens";
import AccountTransactions from "./transactions";
import { ellipsify } from "@/lib/utils";

export default function AccountDetailFeature() {
  const params = useParams();

  const address = useMemo(() => {
    if (!params.address) {
      return;
    }
    try {
      return new PublicKey(params.address);
    } catch (e) {
      console.log(`Invalid public key`, e);
    }
  }, [params]);

  if (!address) {
    return <div>Error loading account</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <AccountChecker />

      <div className="text-center">
        <AccountBalance address={address} />
      </div>

      <div className="my-4">
        <ExplorerLink
          path={`account/${address}`}
          label={ellipsify(address.toString())}
        />
      </div>

      <div className="my-4">
        <AccountButtons address={address} />
      </div>

      <div className="space-y-8">
        <AccountTokens address={address} />
        <AccountTransactions address={address} />
      </div>
    </div>
  );
}
