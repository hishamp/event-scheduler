import { Button } from "../ui/button";

const NewEventButton = ({ onClick }: { onClick: (open: boolean) => void }) => {
  return (
    <Button onClick={() => onClick(true)} className="mb-2">
      Add Event
    </Button>
  );
};
export default NewEventButton;
