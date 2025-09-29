import { Connection, Keypair } from "@solana/web3.js";
import fs from "fs";
import { requestAirdrop } from "./airdrop";
import path from "path";

export const getOrCreateWallet = async (
  connection: Connection,
  walletPath: string
): Promise<Keypair> => {
  if (fs.existsSync(walletPath)) {
    console.log("Loading existing wallet from: ", walletPath);
    const secretKey = JSON.parse(fs.readFileSync(walletPath, "utf8"));
    return Keypair.fromSecretKey(new Uint8Array(secretKey));
  } else {
    console.log("Generating new wallet...");
    const userKeypair = Keypair.generate();

    // create wallets directory if it doesn't exist
    const walletDir = path.dirname(walletPath);
    if (!fs.existsSync(walletDir)) {
      fs.mkdirSync(walletDir, { recursive: true });
    }

    // save wallet to file
    fs.writeFileSync(
      walletPath,
      JSON.stringify(Array.from(userKeypair.secretKey))
    );
    console.log("Wallet saved to: ", walletPath);

    await requestAirdrop(connection, userKeypair.publicKey, 2);
    return userKeypair;
  }
};
