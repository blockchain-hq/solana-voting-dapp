import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddPollForm from "./add-poll-form";
import { Button } from "@/components/ui/button";

const AddPollModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Poll</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Poll</DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-sm text-muted-foreground">
          Add a new poll to the voting system.
        </DialogDescription>

        <AddPollForm />
      </DialogContent>
    </Dialog>
  );
};

export default AddPollModal;
