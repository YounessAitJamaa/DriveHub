import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Loader2 } from "lucide-react";

interface BookingListProps {
  bookings: any[];
  isLoadingBookings: boolean;
  handleEditBooking: (booking: any) => void;
  handleDeleteBooking: (id: string) => void;
  deleteBookingMutation: any;
  formatBookingDate: (dateString: string) => string;
  getStudentName: (booking: any) => string;
}

const BookingList = ({
  bookings,
  isLoadingBookings,
  handleEditBooking,
  handleDeleteBooking,
  deleteBookingMutation,
  formatBookingDate,
  getStudentName
}: BookingListProps) => {
  if (isLoadingBookings) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No appointments found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map(booking => (
            <TableRow key={booking.id}>
              <TableCell>{formatBookingDate(booking.booking_date)}</TableCell>
              <TableCell>{booking.booking_time}</TableCell>
              <TableCell>{getStudentName(booking)}</TableCell>
              <TableCell>{booking.course_type}</TableCell>
              <TableCell>
                <Badge 
                  className={
                    booking.status === "completed" ? "bg-green-100 text-green-800" :
                    booking.status === "cancelled" ? "bg-red-100 text-red-800" :
                    booking.status === "confirmed" ? "bg-blue-100 text-blue-800" :
                    "bg-yellow-100 text-yellow-800"
                  }
                >
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditBooking(booking)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500"
                    onClick={() => handleDeleteBooking(booking.id)}
                    disabled={deleteBookingMutation.isPending}
                  >
                    {deleteBookingMutation.isPending && deleteBookingMutation.variables === booking.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookingList;
