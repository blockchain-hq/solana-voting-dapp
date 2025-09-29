import { Button } from "../ui/button";
import useVotingProgram from "@/hooks/use-voting-program";

interface CandidateCardProps {
  pollId: number;
  candidateId: number;
  candidateName: string;
  candidateDescription: string;
  votesCount: number;
}

const CandidateCard = (props: CandidateCardProps) => {
  const {
    candidateName,
    candidateDescription,
    votesCount,
    candidateId,
    pollId,
  } = props;
  const { voteForCandidateQuery } = useVotingProgram(pollId);
  return (
    <div className="flex flex-col gap-2 p-4 border border-gray-200 rounded-md">
      <h3 className="text-lg font-bold">{candidateName}</h3>
      <p className="text-sm">{candidateDescription}</p>
      <p className="text-sm">Votes: {votesCount}</p>

      <Button
        variant="outline"
        onClick={() =>
          voteForCandidateQuery.mutate({
            pollId: pollId,
            candidateId: candidateId,
          })
        }
      >
        Vote
      </Button>
    </div>
  );
};

export default CandidateCard;
