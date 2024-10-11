import { useEffect, useState } from "react";
import DateInput from "../form/DateInput";
import FormInput from "../form/FormInput";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import DeleteModal from "./DeleteModal";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { DialogClose } from "@radix-ui/react-dialog";

type NewEventProps = {
  open: boolean;
  openChangeFn: (open: boolean) => void;
  onSubmit: (eventData: {
    title: string;
    location: string;
    startDate: string;
    endDate: string;
  }) => void;
  selectedSlot?: { start: Date; end: Date } | null;
  selectedEvent: {
    id: string;
    title: string;
    location: string;
    start: Date;
    end: Date;
  } | null;
  isEditing: boolean;
  onDelete: (eventId: string) => void;
};

const NewEventModal = ({
  open,
  openChangeFn,
  onSubmit,
  selectedSlot,
  isEditing,
  selectedEvent,
  onDelete,
}: NewEventProps) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hasError, setHasError] = useState(false); // to flag if there is error on submission

  useEffect(() => {
    // preset the data if an event is selected
    if (isEditing && selectedEvent) {
      setTitle(selectedEvent.title);
      setLocation(selectedEvent.location);
      setStartDate(selectedEvent.start);
      setEndDate(selectedEvent.end);
    } else {
      // set the selected slots on calendar to add a new event or on clicking the new event button
      setTitle("");
      setLocation("");
      setStartDate(selectedSlot?.start || null);
      setEndDate(selectedSlot?.end || null);
    }
  }, [selectedSlot, selectedEvent, isEditing]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasError(false);
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const location = formData.get("location") as string;

    //check for errors in the submitted form
    if (!title || !location || !startDate || !endDate) {
      setHasError(true);
      return;
    }

    const eventData = {
      title,
      location,
      startDate: startDate?.toISOString() || "",
      endDate: endDate?.toISOString() || "",
    };

    onSubmit(eventData); // Pass the form data back to parent component
    openChangeFn(false); // Close modal after submission
  };

  // function to handle date changes
  const handleDateChange = (type: "start" | "end") => (date: Date | null) => {
    if (type === "start") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  return (
    <Dialog open={open} onOpenChange={openChangeFn}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-2">
            <DialogTitle>
              {isEditing && selectedEvent
                ? selectedEvent.title
                : "Add New Event"}
            </DialogTitle>
          </DialogHeader>
          <FormInput defaultValue={title} type="text" name="title" />
          <FormInput defaultValue={location} type="text" name="location" />
          <div className="grid gap-x-2 grid-cols-1 md:grid-cols-2">
            <DateInput
              name="start_date"
              label="Start Date"
              value={startDate}
              minDate={new Date()}
              onChange={handleDateChange("start")}
            />
            <DateInput
              name="end_date"
              label="End Date"
              value={endDate}
              minDate={startDate || new Date()}
              onChange={handleDateChange("end")}
            />
          </div>
          {/* show error in alert box if there is any error on submission  */}
          {hasError && (
            <Alert variant={"destructive"}>
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>
                Please make sure you have entered all the required fields
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter className="mt-5 gap-y-2">
            {/* button to trigger close the modal  */}
            <DialogClose asChild>
              <Button variant={"outline"}>Close</Button>
            </DialogClose>
            {isEditing && selectedEvent && (
              <DeleteModal onClickDelete={() => onDelete(selectedEvent.id)} />
              // Conditional render if the form is in edit mode.
            )}
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default NewEventModal;
