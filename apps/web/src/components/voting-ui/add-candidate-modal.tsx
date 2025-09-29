import useVotingProgram from "@/hooks/use-voting-program";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type AddCandidateFormData = {
  candidateName: string;
  candidateDescription: string;
};

const AddCandidateModal = ({ pollId }: { pollId: number }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCandidateFormData>();
  const { addCandidate } = useVotingProgram();

  const onSubmit = (data: AddCandidateFormData) => {
    if (addCandidate.isPending) {
      return;
    }

    if (!data.candidateName || !data.candidateDescription) {
      toast.error("Please fill in all fields");
      return;
    }

    addCandidate.mutate({
      pollId: pollId,
      candidateName: data.candidateName,
      candidateDescription: data.candidateDescription,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Candidate</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Candidate Details</DialogTitle>
        </DialogHeader>

        {/* add candidate form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="New Candidate"
            {...register("candidateName")}
          />
          <Input
            type="text"
            placeholder="New Candidate Description"
            {...register("candidateDescription")}
          />
          {errors.candidateName && <p>{errors.candidateName.message}</p>}
          {errors.candidateDescription && (
            <p>{errors.candidateDescription.message}</p>
          )}
          <Button type="submit">Add Candidate</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCandidateModal;
