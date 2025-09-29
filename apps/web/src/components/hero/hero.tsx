import { Button } from "@/components/ui/button";
import Link from "next/link";
import FeatureCard from "./feature-card";
import { Vote, PersonStanding, ChartBar, Computer } from "lucide-react";
import { appData } from "@/lib/data";

const featureCards = [
  {
    title: "Create New Polls",
    description: "Any user can create a new poll.",
    icon: <Computer className="w-10 h-10 text-green-500" strokeWidth={1} />,
  },
  {
    title: "Add Candidates",
    description: "Poll creators can add candidates to their poll.",
    icon: (
      <PersonStanding className="w-10 h-10 text-blue-500" strokeWidth={1} />
    ),
  },
  {
    title: "Vote for a Candidate",
    description: "Any user can vote for a candidate in a poll.",
    icon: <Vote className="w-10 h-10 text-red-500" strokeWidth={1} />,
  },
  {
    title: "View Results",
    description: "Any user can view the results of a poll.",
    icon: <ChartBar className="w-10 h-10 text-yellow-500" strokeWidth={1} />,
  },
];

const Hero = () => {
  return (
    <div className="flex flex-rows items-center justify-center gap-8">
      {/* left section */}
      <div className="flex flex-col gap-4 md:w-1/2">
        <h1 className="text-4xl font-bold">{appData.title}</h1>
        <p className="text-lg">
          An example of decentralized voting application built on Solana. It
          interacts with the voting program.
        </p>

        <div className="flex flex-row gap-4 md:w-1/2">
          <Button>
            <Link href="/voting">Get Started</Link>
          </Button>

          <Button variant="outline">
            <Link href={appData.githubUrl} target="_blank">
              View on GitHub
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">
            Developed by{" "}
            <Link
              href={appData.websiteUrl}
              target="_blank"
              className="text-green-500"
            >
              blockchainhq
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            {` with inspiration from `}
            <Link
              href="https://www.youtube.com/watch?v=amAq-WHAFs8&list=PLilwLeBwGuK7HN8ZnXpGAD9q6i4syhnVc"
              target="_blank"
              className="text-purple-500"
            >
              Solana Developer Bootcamp 2024
            </Link>
          </p>
        </div>
      </div>

      {/* right section */}
      <div className="grid grid-cols-2 gap-8">
        {featureCards.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
