import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Fetch appointments
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id, 
          booking_date, 
          booking_time, 
          course_type, 
          status,
          profiles:user_id (
            first_name, 
            last_name
          )
        `)
        .order('booking_date', { ascending: true });
      
      if (error) throw new Error(error.message);
      return data;
    }
  });

  // Get student name from profiles relation
  const getStudentName = (booking: any) => {
    if (booking.profiles) {
      return `${booking.profiles.first_name || ''} ${booking.profiles.last_name || ''}`.trim() || 'Unknown';
    }
    return 'Unknown';
  };

  // Get appointments for selected date
  const selectedDateAppointments = bookings?.filter(booking => {
    if (!selectedDate || !booking.booking_date) return false;
    const bookingDate = parseISO(booking.booking_date);
    return (
      bookingDate.getDate() === selectedDate.getDate() &&
      bookingDate.getMonth() === selectedDate.getMonth() &&
      bookingDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-xl">Calendar View</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-lg border-0 shadow-none"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center text-xl font-semibold",
                  caption_label: "text-xl font-semibold",
                  nav: "space-x-1 flex items-center",
                  nav_button: cn(
                    "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100",
                    "flex items-center justify-center rounded-full hover:bg-gray-100"
                  ),
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex justify-between",
                  head_cell: "text-gray-500 rounded-md w-14 font-medium text-sm",
                  row: "flex w-full mt-2 justify-between",
                  cell: cn(
                    "relative p-0 text-center text-base focus-within:relative focus-within:z-20",
                    "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                  ),
                  day: cn(
                    "h-14 w-14 p-0 font-normal aria-selected:opacity-100",
                    "rounded-full hover:bg-gray-100 focus:bg-gray-100",
                    "flex items-center justify-center"
                  ),
                  day_selected: "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-700 focus:text-white",
                  day_today: "bg-gray-100 text-gray-900",
                  day_outside: "text-gray-400 opacity-50",
                  day_disabled: "text-gray-400 opacity-50",
                  day_range_middle: "aria-selected:bg-gray-100 aria-selected:text-gray-900",
                  day_hidden: "invisible",
                }}
                components={{
                  IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                  IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                }}
                modifiers={{
                  booked: (date) => {
                    return bookings?.some(booking => {
                      const bookingDate = parseISO(booking.booking_date);
                      return (
                        bookingDate.getDate() === date.getDate() &&
                        bookingDate.getMonth() === date.getMonth() &&
                        bookingDate.getFullYear() === date.getFullYear()
                      );
                    }) || false;
                  }
                }}
                modifiersStyles={{
                  booked: { 
                    backgroundColor: '#e0f2fe', 
                    color: '#0369a1',
                    fontWeight: '600',
                    border: '2px solid #0369a1'
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-xl">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            ) : selectedDateAppointments && selectedDateAppointments.length > 0 ? (
              <div className="space-y-4">
                {selectedDateAppointments.map(booking => (
                  <div 
                    key={booking.id} 
                    className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-lg text-gray-900">
                          {booking.booking_time}
                        </div>
                        <div className="text-gray-600 mt-1">
                          {getStudentName(booking)}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {booking.course_type}
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        ${booking.status === "completed" ? "bg-green-100 text-green-800" :
                          booking.status === "cancelled" ? "bg-red-100 text-red-800" :
                          booking.status === "confirmed" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No appointments scheduled for this date
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schedule; 