import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const paymentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number",
  }),
  payment_date: z.string(),
  payment_method: z.string(),
  package_type: z.string(),
  status: z.enum(["pending", "completed", "failed"]),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface EditPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentFormData | null;
}

export default function EditPaymentDialog({ isOpen, onClose, payment }: EditPaymentDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch students for selection
  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .order('first_name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: payment ? {
      ...payment,
      amount: payment.amount.toString(),
    } : {
      payment_date: format(new Date(), "yyyy-MM-dd"),
      status: "pending",
    },
  });

  const { mutate: updatePayment, isPending } = useMutation({
    mutationFn: async (data: PaymentFormData) => {
      const { error } = await supabase
        .from('payments')
        .update({
          ...data,
          amount: parseFloat(data.amount),
        })
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payment record updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update payment record. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating payment:', error);
    },
  });

  const onSubmit = (data: PaymentFormData) => {
    updatePayment(data);
  };

  if (!payment) return null;

  // Package type options
  const packageTypes = [
    "Beginner's Package",
    "Advanced Driver Package",
    "Intensive Course",
    "Single Lesson",
    "Evaluation Lesson",
    "Pre-Test Refresher",
    "Theory Test Preparation"
  ];

  // Payment method options
  const paymentMethods = [
    "Cash",
    "Credit Card",
    "Bank Transfer",
    "PayPal",
    "Other"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("id")} value={payment.id} />
          
          <div className="space-y-2">
            <Label htmlFor="user_id">Student</Label>
            <Select onValueChange={(value) => register("user_id").onChange({ target: { value } })}>
              <SelectTrigger>
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
            {errors.user_id && (
              <p className="text-sm text-red-500">{errors.user_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register("amount")}
              placeholder="Enter amount"
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="package_type">Package Type</Label>
            <Select onValueChange={(value) => register("package_type").onChange({ target: { value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select package type" />
              </SelectTrigger>
              <SelectContent>
                {packageTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.package_type && (
              <p className="text-sm text-red-500">{errors.package_type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_date">Payment Date</Label>
            <Input
              id="payment_date"
              type="date"
              {...register("payment_date")}
            />
            {errors.payment_date && (
              <p className="text-sm text-red-500">{errors.payment_date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">Payment Method</Label>
            <Select onValueChange={(value) => register("payment_method").onChange({ target: { value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(method => (
                  <SelectItem key={method} value={method}>{method}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.payment_method && (
              <p className="text-sm text-red-500">{errors.payment_method.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => register("status").onChange({ target: { value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Enter any additional notes"
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 