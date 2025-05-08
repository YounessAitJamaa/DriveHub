import { z } from "zod";

export const courseTypes = [
  "Beginner",
  "Advanced",
  "Intensive",
  "Evaluation",
  "Theory",
  "Highway",
  "City",
  "Parking"
] as const;

export const bookingFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  date: z.date({ required_error: "Please select a date." }),
  time: z.string({ required_error: "Please select a time." }),
  courseType: z.string({ required_error: "Please select a course type." }),
  notes: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
