"use client";

import { useConnection } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import {
  getCandidatesForPoll,
  getPolls,
  getVotingProgram,
  getVotingProgramId,
  voteForCandidate,
} from "@anchor/voting";
import { useCluster } from "@/providers/cluster-provider";
import { Cluster } from "@solana/web3.js";
import { useAnchorProvider } from "@/providers/solana-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BN } from "@coral-xyz/anchor";
import useTransactionToast from "./use-transaction-toast";
import { toast } from "sonner";
import { parseTxError } from "@/lib/error-parser";

const useVotingProgram = (pollId?: number) => {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const provider = useAnchorProvider();
  const transactionToast = useTransactionToast();
  const queryClient = useQueryClient();

  const programId = useMemo(
    () => getVotingProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = useMemo(
    () => getVotingProgram(provider, programId),
    [provider, programId]
  );

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  type InitializePollParams = {
    pollName: string;
    pollDescription: string;
    pollStart: number;
    pollEnd: number;
  };

  const initializePoll = useMutation({
    mutationKey: ["initialize-poll", { cluster }],
    mutationFn: (input: InitializePollParams) =>
      program.methods
        .initializePoll(
          input.pollName,
          input.pollDescription,
          new BN(input.pollStart),
          new BN(input.pollEnd)
        )
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      queryClient.invalidateQueries({
        queryKey: ["get-program-account", { cluster }],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-polls", { cluster }],
      });
    },
    onError: (err) => {
      const errorMsg = parseTxError(err);
      if (typeof errorMsg === "string") {
        toast.error(errorMsg);
      } else {
        toast.error("Failed to initialize poll");
        console.error(errorMsg);
      }
    },
  });

  const getPollsQuery = useQuery({
    queryKey: ["get-polls", { cluster }],
    queryFn: () => getPolls(program),
  });

  type AddCandidateParams = {
    pollId: number;
    candidateName: string;
    candidateDescription: string;
  };

  const addCandidate = useMutation({
    mutationKey: ["add-candidate", { cluster }],
    mutationFn: (input: AddCandidateParams) =>
      program.methods
        .initializeCandidate(
          new BN(input.pollId),
          input.candidateName,
          input.candidateDescription
        )
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      queryClient.invalidateQueries({
        queryKey: ["get-polls", { cluster }],
      });
    },
    onError: (err) => {
      const errorMsg = parseTxError(err);
      if (typeof errorMsg === "string") {
        toast.error(errorMsg);
      } else {
        toast.error("Failed to add candidate");
        console.error(errorMsg);
      }
    },
  });

  const closePollQuery = useMutation({
    mutationKey: ["close-poll", { cluster }],
    mutationFn: (pollId: number) =>
      program.methods.closePoll(new BN(pollId)).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      queryClient.invalidateQueries({
        queryKey: ["get-polls", { cluster }],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-polls", { cluster }],
      });
    },
    onError: (err) => {
      console.error(err, "failed to close poll");
      console.error(parseTxError(err), "failed to close poll");
      console.error(typeof err, "failed to close poll");
      const errorMsg = parseTxError(err);
      if (typeof errorMsg === "string") {
        toast.error(errorMsg);
      } else {
        toast.error("Failed to close poll");
        console.error(errorMsg);
      }
    },
  });

  const getCandidatesForPollQuery = useQuery({
    queryKey: ["get-candidates-for-poll", { cluster, pollId: pollId }],
    queryFn: () => getCandidatesForPoll(program, pollId!),
  });

  const voteForCandidateQuery = useMutation({
    mutationKey: ["vote-for-candidate", { cluster, pollId: pollId }],
    mutationFn: (input: { pollId: number; candidateId: number }) =>
      voteForCandidate(program, input.pollId, input.candidateId),
    onSuccess: (signature) => {
      transactionToast(signature);
      queryClient.invalidateQueries({
        queryKey: ["get-candidates-for-poll", { cluster, pollId: pollId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-polls", { cluster }],
      });
    },
    onError: (err) => {
      const errorMsg = parseTxError(err);
      if (typeof errorMsg === "string") {
        toast.error(errorMsg);
      } else {
        toast.error("Failed to vote for candidate");
        console.error(errorMsg);
      }
    },
  });

  return {
    program,
    programId,
    getProgramAccount,
    initializePoll,
    getPollsQuery,
    addCandidate,
    closePollQuery,
    getCandidatesForPollQuery,
    voteForCandidateQuery,
  };
};

export default useVotingProgram;
