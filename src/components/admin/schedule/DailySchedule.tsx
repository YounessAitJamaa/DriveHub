
import React from "react";
import { Loader2 } from "lucide-react";

interface DailyScheduleProps {
  selectedDate: Date;
  selectedDateAppointments: any[] | undefined;
  isLoadingBookings: boolean;
  getStudentName: (booking: any) => string;
}

const DailySchedule = ({
  selectedDate,
  selectedDateAppointments,
  isLoadingBookings,
  getStudentName
}: DailyScheduleProps) => {
  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">
        Appointments for {selectedDate.toLocaleDateString()}
      </h3>
      
      {isLoadingBookings ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        </div>
      ) : selectedDateAppointments && selectedDateAppointments.length > 0 ? (
        <div className="space-y-2">
          {selectedDateAppointments.map(booking => (
            <div key={booking.id} className="bg-gray-50 p-2 rounded text-sm">
              <div className="font-medium">
                {booking.booking_time} - {getStudentName(booking)}
              </div>
              <div className="text-gray-500">Type: {booking.course_type}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-sm">
          No appointments scheduled for this date
        </div>
      )}
    </div>
  );
};

export default DailySchedule;
