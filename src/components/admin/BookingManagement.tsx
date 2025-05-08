import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import BookingList from "./schedule/BookingList";
import BookingEditDialog from "./schedule/BookingEditDialog";
import NewBookingDialog from "./schedule/NewBookingDialog";
import { useBookings } from "./schedule/useBookings";

const BookingManagement = () => {
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
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  // Get student name from profiles relation
  const getStudentName = (booking: any) => {
    try {
      if (booking.profiles) {
        return `${booking.profiles.first_name || ''} ${booking.profiles.last_name || ''}`.trim() || 'Unknown';
      }
      return 'Unknown';
    } catch (error) {
      console.error('Error getting student name:', error);
      return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsNewDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

    <Card>
      <CardHeader>
          <CardTitle>Appointment Management</CardTitle>
          <CardDescription>View and manage all appointments</CardDescription>
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

export default BookingManagement;
