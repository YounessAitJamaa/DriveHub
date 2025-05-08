import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { DateTimeSelector } from "@/components/booking/DateTimeSelector";
import { BookingForm } from "@/components/booking/BookingForm";
import { BookingInfo } from "@/components/booking/BookingInfo";
import { BookingFormValues } from "@/lib/schemas/bookingSchema";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Course pricing configuration
const coursePrices = {
  "Beginner": 50,
  "Advanced": 60,
  "Intensive": 75,
  "Evaluation": 45,
  "Theory": 40,
  "Highway": 65,
  "City": 55,
  "Parking": 45
};

const getCoursePrice = (courseType: string): number => {
  return coursePrices[courseType as keyof typeof coursePrices] || 50; // Default to 50 if course type not found
};

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const preSelectedCourse = location.state?.course || location.state?.package || "";
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    
    if (date) {
      const mockTimes = [
        "09:00 AM", "10:00 AM", "11:00 AM", 
        "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
      ];
      setAvailableTimes(mockTimes);
    } else {
      setAvailableTimes([]);
    }
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const onSubmit = async (data: BookingFormValues) => {
    if (!user) {
      toast.error("You must be logged in to book a lesson");
      navigate("/auth");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get the current user's ID from Supabase
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser) {
        throw new Error("Failed to get user information");
      }

      // Check if user exists in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', currentUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw new Error("Failed to check user profile");
      }

      // If profile doesn't exist, create it
      if (!profile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: currentUser.id,
            email: currentUser.email,
            first_name: data.name.split(' ')[0] || '',
            last_name: data.name.split(' ').slice(1).join(' ') || '',
            phone: data.phone
          });

        if (insertError) {
          throw new Error("Failed to create user profile");
        }
      }

      // Format date for database storage
      const formattedDate = format(data.date, "yyyy-MM-dd");
      
      // Insert booking into Supabase
      const { error } = await supabase
        .from("bookings")
        .insert({
          user_id: currentUser.id,
          booking_date: formattedDate,
          booking_time: data.time,
          course_type: data.courseType,
          notes: data.notes || null,
          status: "pending"
        });
      
      if (error) throw error;
      
      toast.success("Booking Requested", {
        description: `We've received your booking request for ${format(data.date, "MMMM d, yyyy")} at ${data.time}. We'll contact you shortly to confirm.`,
      });
      
      // Reset form and state
      setSelectedDate(undefined);
      setAvailableTimes([]);
      setSelectedTime(undefined);
      
      // Redirect to payment page with booking details
      navigate("/payment", {
        state: {
          bookingDetails: {
            date: formattedDate,
            time: data.time,
            courseType: data.courseType,
            amount: getCoursePrice(data.courseType)
          }
        }
      });
    } catch (error: any) {
      console.error("Error submitting booking:", error);
      toast.error("Failed to submit booking", {
        description: error.message || "Please try again later"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-6 py-20">
        <PageHeader 
          title="Book Your Driving Lesson"
          description="Choose a date, time, and course type that works for you. We'll confirm your booking as soon as possible."
        />
        
        <div className="grid md:grid-cols-2 gap-10">
          <DateTimeSelector 
            selectedDate={selectedDate}
            setSelectedDate={handleDateSelect}
            availableTimes={availableTimes}
            onTimeSelect={handleTimeSelect}
            selectedTime={selectedTime}
          />
          
          <BookingForm 
            preSelectedCourse={preSelectedCourse}
            selectedDate={selectedDate}
            availableTimes={availableTimes}
            onDateSelect={handleDateSelect}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
        
        <BookingInfo />
      </div>
    </div>
  );
};

export default Booking;
