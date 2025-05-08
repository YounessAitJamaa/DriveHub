import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Loader2, Plus, Edit, Trash2, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import NewPaymentDialog from "@/components/admin/payments/NewPaymentDialog";
import EditPaymentDialog from "@/components/admin/payments/EditPaymentDialog";

const Payments = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch payments
  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          id,
          amount,
          payment_date,
          payment_method,
          status,
          package_type,
          notes,
          created_at,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order('payment_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching payments:', error);
        toast({
          title: "Error",
          description: "Failed to load payments. Please try again.",
          variant: "destructive",
        });
        return [];
      }
      
      return data || [];
    }
  });

  // Handle payment deletion
  const handleDeletePayment = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this payment record?")) {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete payment record.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Payment record deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    }
  };

  // Handle opening edit dialog
  const handleEditPayment = (payment: any) => {
    setEditingPayment({...payment});
    setIsEditDialogOpen(true);
  };

  // Format date for display
  const formatPaymentDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Get student name from profiles relation
  const getStudentName = (payment: any) => {
    try {
      if (payment.profiles) {
        return `${payment.profiles.first_name || ''} ${payment.profiles.last_name || ''}`.trim() || 'Unknown';
      }
      return 'Unknown';
    } catch (error) {
      console.error('Error getting student name:', error);
      return 'Unknown';
    }
  };

  // Format amount for display
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payments</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsNewDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Payment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-xl">Payment Management</CardTitle>
          <CardDescription>View and manage all payment records</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : !payments || payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No payment records found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatPaymentDate(payment.payment_date)}</TableCell>
                      <TableCell>{getStudentName(payment)}</TableCell>
                      <TableCell>{payment.package_type}</TableCell>
                      <TableCell className="font-medium">
                        {formatAmount(payment.amount)}
                      </TableCell>
                      <TableCell className="capitalize">{payment.payment_method}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            payment.status === "completed" ? "bg-green-100 text-green-800" :
                            payment.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                            payment.status === "failed" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {payment.notes || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditPayment(payment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => handleDeletePayment(payment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <NewPaymentDialog 
        isOpen={isNewDialogOpen}
        onClose={() => setIsNewDialogOpen(false)}
      />

      <EditPaymentDialog 
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingPayment(null);
        }}
        payment={editingPayment}
      />
    </div>
  );
};

export default Payments; 