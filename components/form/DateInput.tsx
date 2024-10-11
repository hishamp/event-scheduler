import { Label } from "../ui/label";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

const DateInput = ({
  name,
  label,
  value,
  onChange,
  minDate,
}: {
  name: string;
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void; // Accept a handler for the date change
  minDate?: Date;
}) => {
  const handleDateChange = (date: Date | null) => {
    onChange(date); // Pass the selected date back to the parent
  };

  return (
    <div className="mb-2 w-full flex flex-col">
      <Label className="capitalize mb-1" htmlFor={name}>
        {label || name}
      </Label>
      <DatePicker
        className="border h-9 rounded-sm w-full"
        id={name}
        selected={value}
        onChange={handleDateChange} // Handle date change
        required
        minDate={minDate}
        showTimeSelect
        dateFormat="MMMM d, yyyy h:mm aa"
      />
    </div>
  );
};

export default DateInput;
