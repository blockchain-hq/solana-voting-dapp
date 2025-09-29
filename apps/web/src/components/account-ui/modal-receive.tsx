import AppModal from "../layout/app-modal";
import { PublicKey } from "@solana/web3.js";

const ModalReceive = ({ address }: { address: PublicKey }) => {
  return (
    <AppModal title="Receive">
      <p>Receive assets by sending them to your public key:</p>
      <code>{address.toString()}</code>
    </AppModal>
  );
};

export default ModalReceive;
