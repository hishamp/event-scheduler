/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { v4 as uuidV4 } from "uuid"; // to create unique ids for the events
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop, {
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import { useState } from "react";
import NewEventModal from "./NewEventModal";
import NewEventButton from "../Buttons/NewEventButton";

interface Event {
  id: string;
  title: string;
  location: string;
  start: Date;
  end: Date;
}

const DragAndDropCalendar = withDragAndDrop<Event>(Calendar);
const localizer = momentLocalizer(moment);

const initialEvents = [
  {
    id: uuidV4(),
    title: "test",
    location: "none",
    start: new Date(),
    end: new Date(Date.now() + 20000),
  },
];

const DndCalendar = () => {
  const [events, setEvents] = useState(initialEvents);
  const [openForm, setOpenForm] = useState(false); // to open the event form modal
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false); // to select editing the modal on selecting event
  const [view, setView] = useState<View>("month"); // change the view of the calendar
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const now = new Date();
    if (start < now) {
      // If the selected start date is in the past, prevent selection
      alert("You cannot select past dates.");
      return;
    }
    setSelectedSlot({ start, end });
    setIsEditing(false);
    setOpenForm(true); // open the modal to edit
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId)); // filter out the event to be deleted
    setOpenForm(false); // close the modal on delete
    setSelectedEvent(null);
    setIsEditing(false);
  };

  const handleFormSubmit = (eventData: {
    title: string;
    location: string;
    startDate: string;
    endDate: string;
  }) => {
    const newEvent: Event = {
      id: isEditing ? selectedEvent?.id || uuidV4() : uuidV4(), // create a new id or use the selectedEvent id if in edit mode
      title: eventData.title,
      location: eventData.location,
      start: new Date(eventData.startDate),
      end: new Date(eventData.endDate),
    };

    //update event if the form is in edit or add a new event to the array if new event is created.
    setEvents((prev) =>
      isEditing
        ? prev.map((e) => (e.id === newEvent.id ? newEvent : e))
        : [...prev, newEvent]
    );


    setOpenForm(false); // close the form modal 
    setSelectedEvent(null);
    setIsEditing(false);
  };

  // to reset the form on closing the modal
  const handleModalOpenClose = (open: boolean) => {
    if (open === false) {
      setSelectedEvent(null);
      setSelectedSlot(null);
    }
    setOpenForm(open);
  };


  //function to edit the time for the events on dragging the event in the calendar
  const handleEventDrop = ({
    event,
    start,
    end,
  }: EventInteractionArgs<Event>) => {
    const updatedEvent: Event = {
      ...event,
      start: new Date(start),
      end: new Date(end),
    };

    //update the event array with updated event time.
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? updatedEvent : e))
    );
  };

  //function to preset the form on clicking a event and open the modal 
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEditing(true);
    setOpenForm(true);
  };

  //to handle the change in the view of calendar to month,week or agenda
  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  return (
    <div>
      <NewEventButton onClick={setOpenForm} />
      <DragAndDropCalendar
        style={{ height: 500 }}
        views={["month", "week", "agenda"] as View[]}
        view={view}
        localizer={localizer}
        selectable // to make the calendar selectable
        date={currentDate}
        onNavigate={(newDate: Date) => setCurrentDate(newDate)} // to navigate through different dates in calendar
        events={events} // array of event objects
        onView={handleViewChange}
        onSelectSlot={handleSelectSlot}
        onEventDrop={handleEventDrop}
        onSelectEvent={handleEventClick}
      />
      {/* form modal to add delete or edit events  */}
      <NewEventModal
        open={openForm}
        selectedEvent={selectedEvent}
        openChangeFn={handleModalOpenClose}
        onSubmit={handleFormSubmit}
        selectedSlot={selectedSlot}
        isEditing={isEditing}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};

export default DndCalendar;
