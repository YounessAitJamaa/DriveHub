
import React, { useState } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface NewBookingDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NewBookingDialog = ({
  isOpen,
  setIsOpen
}: NewBookingDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newBooking, setNewBooking] = useState({
    booking_date: new Date().toISOString().split('T')[0],
    booking_time: "09:00",
    course_type: "Beginner",
    status: "pending",
    notes: "",
    user_id: ""
  });

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

  // Fetch students for student selection
  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .order('first_name', { ascending: true });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data || [];
    }
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (booking: typeof newBooking) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Appointment created",
        description: "The appointment has been successfully created.",
      });
      setIsOpen(false);
      // Reset form
      setNewBooking({
        booking_date: new Date().toISOString().split('T')[0],
        booking_time: "09:00",
        course_type: "Beginner",
        status: "pending",
        notes: "",
        user_id: ""
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create appointment: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleCreateBooking = () => {
    if (!newBooking.user_id) {
      toast({
        title: "Error",
        description: "Please select a student",
        variant: "destructive",
      });
      return;
    }

    createBookingMutation.mutate(newBooking);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="student">Student</Label>
            <Select 
              value={newBooking.user_id} 
              onValueChange={(value) => setNewBooking({...newBooking, user_id: value})}
            >
              <SelectTrigger id="student">
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingStudents ? (
                  <div className="flex justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  students?.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.first_name || ''} {student.last_name || ''} ({student.email || 'No email'})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="booking-date">Date</Label>
              <Input 
                id="booking-date" 
                type="date" 
                value={newBooking.booking_date} 
                onChange={(e) => setNewBooking({...newBooking, booking_date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="booking-time">Time</Label>
              <Select 
                value={newBooking.booking_time} 
                onValueChange={(value) => setNewBooking({...newBooking, booking_time: value})}
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
              value={newBooking.course_type} 
              onValueChange={(value) => setNewBooking({...newBooking, course_type: value})}
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
              value={newBooking.status} 
              onValueChange={(value) => setNewBooking({...newBooking, status: value})}
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
              value={newBooking.notes} 
              onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
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
            onClick={handleCreateBooking} 
            disabled={createBookingMutation.isPending}
          >
            {createBookingMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Create Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewBookingDialog;
