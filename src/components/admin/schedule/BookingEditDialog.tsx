
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface BookingEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editingBooking: any;
  setEditingBooking: (booking: any) => void;
  handleUpdateBooking: () => void;
  updateBookingMutation: any;
}

const BookingEditDialog = ({
  isOpen,
  setIsOpen,
  editingBooking,
  setEditingBooking,
  handleUpdateBooking,
  updateBookingMutation
}: BookingEditDialogProps) => {
  // Course type options
  const courseTypes = [
    "Beginner", 
    "Advanced", 
    "Intensive", 
    "Evaluation", 
    "Theory", 
    "Highway", 
    "City", 
    "Parking"
  ];

  // Status options
  const statusOptions = ["pending", "confirmed", "completed", "cancelled"];

  // Available time slots
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  if (!editingBooking) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="booking-date">Date</Label>
              <Input 
                id="booking-date" 
                type="date" 
                value={editingBooking.booking_date} 
                onChange={(e) => setEditingBooking({...editingBooking, booking_date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="booking-time">Time</Label>
              <Select 
                value={editingBooking.booking_time} 
                onValueChange={(value) => setEditingBooking({...editingBooking, booking_time: value})}
              >
                <SelectTrigger id="booking-time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="course-type">Course Type</Label>
            <Select 
              value={editingBooking.course_type} 
              onValueChange={(value) => setEditingBooking({...editingBooking, course_type: value})}
            >
              <SelectTrigger id="course-type">
                <SelectValue placeholder="Select course type" />
              </SelectTrigger>
              <SelectContent>
                {courseTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={editingBooking.status} 
              onValueChange={(value) => setEditingBooking({...editingBooking, status: value})}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              value={editingBooking.notes || ''} 
              onChange={(e) => setEditingBooking({...editingBooking, notes: e.target.value})}
              placeholder="Add notes about this appointment"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={handleUpdateBooking} 
            disabled={updateBookingMutation.isPending}
          >
            {updateBookingMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingEditDialog;
