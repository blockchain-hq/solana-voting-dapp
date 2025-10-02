import { Hono } from "hono";
import {
  ActionPostRequest,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  type ActionGetResponse,
  type LinkedAction,
} from "@solana/actions";
import { getCandidatesForPoll, type Voting, VotingIDL } from "@anchor/voting";
import {
  Connection,
  type Cluster,
  clusterApiUrl,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { BN, Program } from "@coral-xyz/anchor";

const votingRouter = new Hono();

// Use path parameters instead of query parameters
votingRouter.get("/:cluster/:pollId", async (c) => {
  const cluster = c.req.param("cluster") as Cluster;
  const pollId = c.req.param("pollId") as string;

  const connection = new Connection(clusterApiUrl(cluster), "confirmed");
  const program: Program<Voting> = new Program(VotingIDL, { connection });

  const [polls, candidates] = await Promise.all([
    program.account.poll.all(),
    getCandidatesForPoll(program, parseInt(pollId)),
  ]);

  const poll = polls.find((poll) => poll.account.pollId.toString() === pollId);
  if (!poll) {
    return c.json({ error: "Poll not found" }, 404);
  }

  const baseUrl = new URL(c.req.url).origin;

  const actions: LinkedAction[] = candidates.map((candidate) => ({
    href: `${baseUrl}/api/v1/voting/vote/${cluster}/${pollId}/${candidate.candidateId}`,
    label: candidate.candidateName,
    type: "post",
  }));

  const actionsMetadata: ActionGetResponse = {
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQttfZrhYyvwmFram7157ms4BwHT_r9GFA&s",
    title: poll.account.pollName,
    description: poll.account.pollDescription,
    label: poll.account.pollName,
    links: {
      actions: actions,
    },
  };

  return c.json(actionsMetadata, 200, ACTIONS_CORS_HEADERS);
});

votingRouter.options("/vote/:cluster/:pollId/:candidateId", async (c) => {
  return c.json({ message: "OK" }, 200, ACTIONS_CORS_HEADERS);
});

votingRouter.post("/vote/:cluster/:pollId/:candidateId", async (c) => {
  try {
    console.log("Voting for candidate", c.req.param("candidateId"));
    const cluster = c.req.param("cluster") as Cluster;
    const pollId = c.req.param("pollId") as string;
    const candidateId = c.req.param("candidateId") as string;
    const body: ActionPostRequest = await c.req.json();

    let voter: PublicKey;
    try {
      voter = new PublicKey(body.account);
    } catch (error) {
      return c.json({ error: "Invalid account" }, 400, ACTIONS_CORS_HEADERS);
    }

    const connection = new Connection(clusterApiUrl(cluster), "confirmed");
    const program: Program<Voting> = new Program(VotingIDL, { connection });

    // here opposed to calling rpc in client app, we are creating an unsigned instruction
    // which will be sent to the user's wallet to sign and send
    const instruction = await program.methods
      .voteForCandidate(new BN(pollId), parseInt(candidateId))
      .accounts({
        voter,
      })
      .instruction();

    // Get latest blockhash with more reliable commitment
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash({
        commitment: "finalized",
      });

    // Use VersionedTransaction with TransactionMessage for Solana Actions
    const messageV0 = new TransactionMessage({
      payerKey: voter,
      recentBlockhash: blockhash,
      instructions: [instruction],
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);

    const response = await createPostResponse({
      fields: {
        transaction,
        type: "transaction",
        message: `Vote for candidate ${candidateId}`,
      },
    });

    return c.json(response, 200, ACTIONS_CORS_HEADERS);
  } catch (error) {
    console.error(error, "error voting for candidate");
    return c.json(
      {
        error: "Failed to vote for candidate",
        details: error instanceof Error ? error.message : String(error),
      },
      500,
      ACTIONS_CORS_HEADERS
    );
  }
});

export default votingRouter;
