import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export const requestAirdrop = async (
  connection: Connection,
  publicKey: PublicKey,
  amountInSol: number
): Promise<string> => {
  console.log(`Requesting ${amountInSol} SOL to ${publicKey.toString()}`);
  const amountInLamports = amountInSol * LAMPORTS_PER_SOL;
  const airdropSignature = await connection.requestAirdrop(
    publicKey,
    amountInLamports
  );

  await connection.confirmTransaction(airdropSignature);
  console.log("Airdrop completed!");

  return airdropSignature;
};
