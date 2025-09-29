import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Button } from "../ui/button";
import useVotingProgram from "@/hooks/use-voting-program";
import AddCandidateModal from "./add-candidate-modal";
import VoteModal from "./vote-modal";
import { Badge } from "../ui/badge";

interface PollCardProps {
  pollId: number;
  pollName: string;
  pollDescription: string;
  pollStart: number;
  pollEnd: number;
  candidatesCount: number;
  pollAuthority: PublicKey;
}

const PollCard = (poll: PollCardProps) => {
  const { publicKey } = useWallet();
  const isPollAuthority = publicKey?.equals(poll.pollAuthority);
  let pollStatus = "";
  if (poll.pollEnd < Date.now() / 1000) {
    pollStatus = "ended";
  } else if (poll.pollStart > Date.now() / 1000) {
    pollStatus = "not started";
  } else {
    pollStatus = "active";
  }

  const { closePollQuery } = useVotingProgram(poll.pollId);
  return (
    <div className="relative flex flex-col gap-2 p-4 border border-gray-200 rounded-md">
      <Badge
        variant="outline"
        className={`absolute top-2 right-2 bg-red-500/20 ${
          pollStatus === "ended"
            ? "bg-red-500/20"
            : pollStatus === "not started"
              ? "bg-yellow-500/20"
              : "bg-green-500/20"
        }`}
      >
        {pollStatus}
      </Badge>

      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold">{poll.pollName}</h3>
        <p className="text-sm">{poll.pollDescription}</p>

        <div className="flex flex-row gap-2">
          <p className="text-sm">
            {new Date(poll.pollStart * 1000).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "UTC",
              timeZoneName: "short",
            })}
          </p>
          <p>-</p>
          <p className="text-sm">
            {new Date(poll.pollEnd * 1000).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "UTC",
              timeZoneName: "short",
            })}
          </p>
        </div>

        <div className="flex flex-row gap-2">
          <p className="text-sm">Candidates: {poll.candidatesCount}</p>
        </div>
      </div>

      <div className="flex flex-row gap-1 items-center flex-wrap">
        {isPollAuthority && (
          <>
            <Button
              variant="destructive"
              onClick={() => closePollQuery.mutate(poll.pollId)}
              disabled={closePollQuery.isPending}
            >
              <p>Close Poll</p>
            </Button>

            <AddCandidateModal pollId={poll.pollId} />
          </>
        )}

        <VoteModal pollId={poll.pollId} />
      </div>
    </div>
  );
};

export default PollCard;
