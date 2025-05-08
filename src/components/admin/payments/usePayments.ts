
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const usePayments = () => {
  const queryClient = useQueryClient();
  
  // Fetch bookings data from Supabase (using bookings as payments)
  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
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
          created_at,
          profiles:user_id (
            first_name, 
            last_name, 
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Transform bookings to mock payment data
      return (data || []).map(booking => ({
        id: booking.id,
        date: booking.created_at,
        studentName: booking.profiles ? 
          `${booking.profiles.first_name || ''} ${booking.profiles.last_name || ''}`.trim() : 
          'Unknown',
        amount: getCoursePrice(booking.course_type),
        package: booking.course_type,
        status: booking.status === 'completed' ? 'Paid' : 
                booking.status === 'cancelled' ? 'Refunded' : 'Pending',
        original_status: booking.status, // Keep original status for updating
        booking_id: booking.id
      }));
    }
  });
  
  // Update booking status mutation
  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      // Map payment status back to booking status
      const bookingStatus = status === 'Paid' ? 'completed' : 
                            status === 'Refunded' ? 'cancelled' : 'pending';
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: bookingStatus })
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({
        title: "Payment status updated",
        description: "The payment status has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update payment status: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete payment/booking mutation
  const deletePaymentMutation = useMutation({
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
        title: "Payment record deleted",
        description: "The payment record has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete payment record: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Helper function to get price based on course type
  const getCoursePrice = (courseType: string): number => {
    const prices: Record<string, number> = {
      'Beginner': 599,
      'Advanced': 399,
      'Intensive': 799,
      'Evaluation': 150,
      'Theory': 299,
      'Highway': 499,
      'City': 349,
      'Parking': 249
    };
    
    return prices[courseType as keyof typeof prices] || 399;
  };
  
  // Calculate totals and analytics
  const calculateAnalytics = () => {
    if (!bookings || bookings.length === 0) return {
      totalRevenue: 0,
      outstandingPayments: 0,
      packageDistribution: {},
      topPackages: []
    };
    
    // Calculate total revenue
    const totalRevenue = bookings.reduce((total, payment) => {
      return payment.status === 'Paid' ? total + payment.amount : total;
    }, 0);
    
    // Calculate outstanding payments
    const outstandingPayments = bookings.reduce((total, payment) => {
      return payment.status === 'Pending' ? total + payment.amount : total;
    }, 0);
    
    // Calculate package distribution
    const packages: Record<string, number> = {};
    
    bookings.forEach(payment => {
      if (!packages[payment.package]) {
        packages[payment.package] = 0;
      }
      packages[payment.package]++;
    });
    
    const total = Object.values(packages).reduce((sum, count) => sum + count, 0);
    
    const distribution: Record<string, { count: number, percentage: number }> = {};
    
    Object.entries(packages).forEach(([packageName, count]) => {
      distribution[packageName] = {
        count,
        percentage: Math.round((count / total) * 100)
      };
    });
    
    const topPackages = Object.entries(distribution)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 3);
      
    return {
      totalRevenue,
      outstandingPayments,
      packageDistribution: distribution,
      topPackages
    };
  };
  
  return {
    bookings,
    isLoadingBookings,
    updatePaymentStatusMutation,
    deletePaymentMutation,
    analytics: calculateAnalytics()
  };
};
