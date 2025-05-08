
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DateTimeSelectorProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  availableTimes: string[];
  onTimeSelect: (time: string) => void;
  selectedTime: string | undefined;
}

export const DateTimeSelector = ({
  selectedDate,
  setSelectedDate,
  availableTimes,
  onTimeSelect,
  selectedTime
}: DateTimeSelectorProps) => {
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl text-blue-800">Select Date & Time</CardTitle>
        <CardDescription>Choose from our available slots</CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md border pointer-events-auto"
          disabled={(date) => {
            // Disable dates in the past and Sundays
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today || date.getDay() === 0;
          }}
        />
        
        {selectedDate && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-blue-800 mb-3">Available Times for {format(selectedDate, "MMMM d, yyyy")}</h3>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    selectedTime === time && "border-blue-600 bg-blue-50"
                  )}
                  onClick={() => onTimeSelect(time)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
