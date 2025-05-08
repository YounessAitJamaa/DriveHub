import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UseBookingsProps {
  toast: any;
  queryClient: ReturnType<typeof useQueryClient>;
}

export const useBookings = ({ toast, queryClient }: UseBookingsProps) => {
  // Fetch appointments/bookings from Supabase
  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id, 
            booking_date, 
            booking_time, 
            course_type, 
            status, 
            notes,
            profiles:user_id (
              first_name, 
              last_name, 
              email
            )
          `)
          .order('booking_date', { ascending: true });
        
        if (error) {
          console.error('Error fetching bookings:', error);
          toast({
            title: "Error",
            description: "Failed to load appointments. Please try again.",
            variant: "destructive",
          });
          return [];
        }
        
        return data || [];
      } catch (error) {
        console.error('Error in bookings query:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    }
  });
  
  // Delete booking mutation
  const deleteBookingMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Appointment deleted",
        description: "The appointment has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete appointment: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update booking mutation
  const updateBookingMutation = useMutation({
    mutationFn: async (booking: any) => {
      const { error } = await supabase
        .from('bookings')
        .update({
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
          course_type: booking.course_type,
          status: booking.status,
          notes: booking.notes,
        })
        .eq('id', booking.id);
      
      if (error) throw new Error(error.message);
      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Appointment updated",
        description: "The appointment has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update appointment: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  return {
    bookings,
    isLoadingBookings,
    deleteBookingMutation,
    updateBookingMutation
  };
};
