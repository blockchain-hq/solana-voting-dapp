import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import useVotingProgram from "@/hooks/use-voting-program";
import CandidateCard from "./candidate-card";
import { LoaderCircle } from "lucide-react";

const VoteModal = ({ pollId }: { pollId: number }) => {
  const { getCandidatesForPollQuery } = useVotingProgram(pollId);
  const { data: candidates, isPending } = getCandidatesForPollQuery;
  console.log(candidates);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Vote for Candidate</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vote for Candidate</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {isPending ? (
            <div className="flex flex-row gap-2 justify-center items-center">
              <LoaderCircle className="h-10 w-10 animate-spin" />
              <p>Loading Candidates...</p>
            </div>
          ) : candidates && candidates.length > 0 ? (
            candidates.map((candidate) => (
              <CandidateCard
                key={candidate.candidateId}
                {...candidate}
                pollId={pollId}
              />
            ))
          ) : (
            <p>No candidates found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoteModal;
