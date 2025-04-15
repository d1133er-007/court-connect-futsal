
import { format, addDays } from "date-fns";
import { Calendar } from "lucide-react";

interface DateSelectorProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const DateSelector = ({ selectedDate, setSelectedDate }: DateSelectorProps) => {
  // Generate next 4 days for date selection
  const dateOptions = Array.from({ length: 4 }, (_, i) => addDays(new Date(), i));

  return (
    <div>
      <div className="flex items-center mb-4">
        <Calendar className="w-5 h-5 mr-2" />
        <h3 className="text-lg font-semibold">Select Date</h3>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {dateOptions.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => setSelectedDate(date)}
            className={`p-3 rounded-md text-center transition-colors ${
              format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                ? "bg-green-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <div className="text-sm">
              {format(date, "EEE")}
            </div>
            <div className="font-medium">
              {format(date, "d MMM")}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
