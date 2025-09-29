import { useCluster } from "@/providers/cluster-provider";
import { PublicKey } from "@solana/web3.js";
import ModalAirdrop from "./modal-airdrop";
import ModalSend from "./modal-send";
import ModalReceive from "./modal-receive";

const AccountButtons = ({ address }: { address: PublicKey }) => {
  const { cluster } = useCluster();
  return (
    <div>
      <div className="space-x-2">
        {cluster.network?.includes("mainnet") ? null : (
          <ModalAirdrop address={address} />
        )}
        <ModalSend address={address} />
        <ModalReceive address={address} />
      </div>
    </div>
  );
};

export default AccountButtons;
