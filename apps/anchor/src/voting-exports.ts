// exporting some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Cluster, PublicKey } from "@solana/web3.js";
import VotingIDL from "../target/idl/voting.json";
import type { Voting } from "../target/types/voting";
import * as anchor from "@coral-xyz/anchor";

export { Voting, VotingIDL };
export type CandidateAccount = Awaited<
  ReturnType<Program<Voting>["account"]["candidate"]["fetch"]>
>;

export const VOTING_PROGRAM_ID = new PublicKey(VotingIDL.address);

export const getVotingProgram = (
  provider: AnchorProvider,
  address?: PublicKey
): Program<Voting> => {
  return new Program(
    {
      ...VotingIDL,
      address: address ? address.toBase58() : VotingIDL.address,
    } as Voting,
    provider
  );
};

export const getVotingProgramId = (cluster: Cluster) => {
  switch (cluster) {
    case "devnet":
    case "testnet":
      return new PublicKey("Dkx6rMoHVhkPc1zzU8u7LxNFJ4NhBj3w7fNkNUhzDZDn");
    case "mainnet-beta":
    default:
      return VOTING_PROGRAM_ID;
  }
};

export const getPolls = async (program: Program<Voting>) => {
  console.log("Getting polls");
  const [pollCounterPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("poll_counter")],
    program.programId
  );
  const pollCounterAcc = await program.account.pollCounter.fetch(
    pollCounterPda
  );
  const pollCount = pollCounterAcc.pollCount;
  const polls = [];
  for (let i = 0; i < pollCount.toNumber(); i++) {
    try {
      const [pollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("poll"), new anchor.BN(i).toArrayLike(Buffer, "le", 8)],
        program.programId
      );
      const pollAcc = await program.account.poll.fetch(pollPda);
      polls.push(pollAcc);
    } catch (error) {
      console.error(`Error fetching poll ${i}: ${error}`);
    }
  }

  return polls.map((poll) => ({
    pollId: poll.pollId.toNumber(),
    pollName: poll.pollName,
    pollDescription: poll.pollDescription,
    pollStart: poll.pollStart.toNumber(),
    pollEnd: poll.pollEnd.toNumber(),
    candidatesCount: poll.candidatesCount,
    pollAuthority: poll.pollAuthority,
  }));
};

export const canUserAddCandidate = async (
  program: Program<Voting>,
  pollId: number,
  publicKey: PublicKey
) => {
  const [pollPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("poll"), new anchor.BN(pollId).toArrayLike(Buffer, "le", 8)],
    program.programId
  );
  const pollAccount = await program.account.poll.fetch(pollPda);
  return pollAccount.pollAuthority === publicKey;
};

export const closePoll = async (program: Program<Voting>, pollId: number) => {
  console.log(`Closing poll ${pollId}`);
  const tx = await program.methods.closePoll(new anchor.BN(pollId)).rpc();
  console.log(`Poll ${pollId} closed: ${tx}`);
  console.log(
    `View on Devnet Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`
  );
  return tx;
};

export const getCandidatesForPoll = async (
  program: Program<Voting>,
  pollId: number
) => {
  const [pollPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("poll"), new anchor.BN(pollId).toArrayLike(Buffer, "le", 8)],
    program.programId
  );
  const pollAccount = await program.account.poll.fetch(pollPda);
  const candidatesCount = pollAccount.candidatesCount;

  const candidates: CandidateAccount[] = [];
  for (let i = 0; i < candidatesCount; i++) {
    try {
      const [candidatePda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("candidate"),
          new anchor.BN(pollId).toArrayLike(Buffer, "le", 8),
          new anchor.BN(i).toArrayLike(Buffer, "le", 4),
        ],
        program.programId
      );
      const candidateAccount = await program.account.candidate.fetch(
        candidatePda
      );
      candidates.push(candidateAccount);
    } catch (error) {
      console.error(`Error fetching candidate ${i}: ${error}`);
    }
  }
  return candidates.map((candidate) => ({
    candidateId: candidate.candidateId,
    candidateName: candidate.candidateName,
    candidateDescription: candidate.candidateDescription,
    votesCount: candidate.votesCount.toNumber(),
  }));
};

export const voteForCandidate = async (
  program: Program<Voting>,
  pollId: number,
  candidateId: number
) => {
  const tx = await program.methods
    .voteForCandidate(new anchor.BN(pollId), candidateId)
    .rpc();
  console.log(`Vote for candidate: ${tx}`);
  return tx;
};
