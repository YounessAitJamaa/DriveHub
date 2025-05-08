
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Loader2, X } from "lucide-react";

interface PaymentEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingPayment: any;
  setEditingPayment: (payment: any) => void;
  onUpdatePayment: () => void;
  isUpdating: boolean;
}

const PaymentEditDialog = ({
  isOpen,
  onOpenChange,
  editingPayment,
  setEditingPayment,
  onUpdatePayment,
  isUpdating
}: PaymentEditDialogProps) => {
  if (!editingPayment) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Payment Status</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Student</Label>
            <div className="p-2 bg-gray-50 rounded">{editingPayment.studentName}</div>
          </div>
          
          <div className="space-y-2">
            <Label>Package</Label>
            <div className="p-2 bg-gray-50 rounded">{editingPayment.package}</div>
          </div>
          
          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="p-2 bg-gray-50 rounded">${editingPayment.amount}</div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payment-status">Payment Status</Label>
            <Select 
              value={editingPayment.status} 
              onValueChange={(value) => setEditingPayment({...editingPayment, status: value})}
            >
              <SelectTrigger id="payment-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={onUpdatePayment} 
            disabled={isUpdating}
          >
            {isUpdating ? (
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

export default PaymentEditDialog;
