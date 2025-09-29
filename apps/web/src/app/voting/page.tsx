"use client";

import useVotingProgram from "@/hooks/use-voting-program";
import PollCard from "@/components/voting-ui/poll-card";
import { LoaderCircle } from "lucide-react";
import AddPollModal from "@/components/voting-ui/add-poll-modal";

const VotingPage = () => {
  const { getPollsQuery } = useVotingProgram();
  const { data: polls, isPending } = getPollsQuery;
  // sort the polls in descending order by pollId
  const sortedPolls = polls?.sort((a, b) => b.pollId - a.pollId);

  return (
    <div className="flex flex-col gap-4 p-4 justify-center items-center">
      <h1 className="text-2xl font-bold">Voting Dashboard</h1>
      <AddPollModal />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {isPending ? (
          <div className="flex flex-row gap-2 justify-center items-center">
            <LoaderCircle className="h-10 w-10 animate-spin" />
            <p>Loading Polls...</p>
          </div>
        ) : (
          sortedPolls &&
          sortedPolls?.map((poll) => <PollCard key={poll.pollId} {...poll} />)
        )}
      </div>
    </div>
  );
};

export default VotingPage;
