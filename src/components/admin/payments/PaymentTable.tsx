
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";

interface PaymentTableProps {
  payments: any[] | undefined;
  isLoading: boolean;
  onEditPayment: (payment: any) => void;
  onDeletePayment: (id: string) => void;
  deletePaymentMutation: any;
}

const PaymentTable = ({
  payments,
  isLoading,
  onEditPayment,
  onDeletePayment,
  deletePaymentMutation
}: PaymentTableProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "yyyy-MM-dd");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Student</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Package</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
            </TableCell>
          </TableRow>
        ) : payments && payments.length > 0 ? (
          payments.map(payment => (
            <TableRow key={payment.id}>
              <TableCell>{formatDate(payment.date)}</TableCell>
              <TableCell>{payment.studentName}</TableCell>
              <TableCell>${payment.amount}</TableCell>
              <TableCell>{payment.package}</TableCell>
              <TableCell>
                <Badge 
                  className={
                    payment.status === "Paid" ? "bg-green-100 text-green-800" :
                    payment.status === "Refunded" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }
                >
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEditPayment(payment)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500"
                    onClick={() => onDeletePayment(payment.booking_id)}
                    disabled={deletePaymentMutation.isPending}
                  >
                    {deletePaymentMutation.isPending && deletePaymentMutation.variables === payment.booking_id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
              No payments found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default PaymentTable;
