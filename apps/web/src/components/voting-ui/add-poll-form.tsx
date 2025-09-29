import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useVotingProgram from "@/hooks/use-voting-program";
import { toast } from "sonner";

type Inputs = {
  pollName: string;
  pollDescription: string;
  pollStart: string;
  pollEnd: string;
};

const AddPollForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { initializePoll } = useVotingProgram();

  const onSubmit = (data: Inputs) => {
    if (initializePoll.isPending) {
      return;
    }

    // input validation
    if (
      !data.pollName ||
      !data.pollDescription ||
      !data.pollStart ||
      !data.pollEnd
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    // convert the local datetime to unix timestamp
    const pollStart = new Date(data.pollStart).getTime() / 1000;
    const pollEnd = new Date(data.pollEnd).getTime() / 1000;

    initializePoll.mutate({
      pollName: data.pollName,
      pollDescription: data.pollDescription,
      pollStart,
      pollEnd,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <Input type="text" defaultValue="New Poll" {...register("pollName")} />
      {errors.pollName && <p>{errors.pollName.message}</p>}
      <Input
        type="text"
        defaultValue="New Poll Description"
        {...register("pollDescription")}
      />
      {errors.pollDescription && <p>{errors.pollDescription.message}</p>}
      <Input type="datetime-local" {...register("pollStart")} />
      {errors.pollStart && <p>{errors.pollStart.message}</p>}
      <Input type="datetime-local" {...register("pollEnd")} />
      {errors.pollEnd && <p>{errors.pollEnd.message}</p>}
      <Button type="submit" className="max-w-fit self-end mt-4">
        Add Poll
      </Button>
    </form>
  );
};

export default AddPollForm;
