
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import BookingList from "./schedule/BookingList";
import BookingEditDialog from "./schedule/BookingEditDialog";
import DailySchedule from "./schedule/DailySchedule";
import { useBookings } from "./schedule/useBookings";
import NewBookingDialog from "./schedule/NewBookingDialog";

const ScheduleTab = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Use the extracted hook for bookings data and mutations
  const { 
    bookings, 
    isLoadingBookings, 
    deleteBookingMutation, 
    updateBookingMutation 
  } = useBookings({ toast, queryClient });
  
  // Handle booking deletion
  const handleDeleteBooking = (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      deleteBookingMutation.mutate(id);
    }
  };

  // Handle opening edit dialog
  const handleEditBooking = (booking: any) => {
    setEditingBooking({...booking});
    setIsEditDialogOpen(true);
  };

  // Handle booking update
  const handleUpdateBooking = () => {
    if (editingBooking) {
      updateBookingMutation.mutate(editingBooking);
    }
  };
  
  // Format date for display
  const formatBookingDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "yyyy-MM-dd");
    } catch (error) {
      return dateString;
    }
  };
  
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Lesson Schedule</CardTitle>
              <CardDescription>View and manage upcoming lessons</CardDescription>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsNewDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <BookingList 
            bookings={bookings} 
            isLoadingBookings={isLoadingBookings}
            handleEditBooking={handleEditBooking}
            handleDeleteBooking={handleDeleteBooking}
            deleteBookingMutation={deleteBookingMutation}
            formatBookingDate={formatBookingDate}
            getStudentName={getStudentName}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>Select a date to view appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
          
          {selectedDate && (
            <DailySchedule 
              selectedDate={selectedDate}
              selectedDateAppointments={selectedDateAppointments}
              isLoadingBookings={isLoadingBookings}
              getStudentName={getStudentName}
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Booking Dialog */}
      <BookingEditDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        editingBooking={editingBooking}
        setEditingBooking={setEditingBooking}
        handleUpdateBooking={handleUpdateBooking}
        updateBookingMutation={updateBookingMutation}
      />

      {/* New Booking Dialog */}
      <NewBookingDialog 
        isOpen={isNewDialogOpen} 
        setIsOpen={setIsNewDialogOpen} 
      />
    </div>
  );
};

export default ScheduleTab;
