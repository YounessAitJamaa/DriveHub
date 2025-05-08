
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Filter, Download, Search } from "lucide-react";
import { usePayments } from "./payments/usePayments";
import PaymentTable from "./payments/PaymentTable";
import PaymentEditDialog from "./payments/PaymentEditDialog";
import PaymentSummary from "./payments/PaymentSummary";
import NewPaymentDialog from "./payments/NewPaymentDialog";
import { useIsMobile } from "@/hooks/use-mobile";

const PaymentsTab = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isNewPaymentDialogOpen, setIsNewPaymentDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const isMobile = useIsMobile();
  
  const {
    bookings,
    isLoadingBookings,
    updatePaymentStatusMutation,
    deletePaymentMutation,
    analytics
  } = usePayments();
  
  // Handle editing payment
  const handleEditPayment = (payment: any) => {
    setEditingPayment({...payment});
    setIsEditDialogOpen(true);
  };
  
  // Handle updating payment
  const handleUpdatePayment = () => {
    if (editingPayment) {
      updatePaymentStatusMutation.mutate({ 
        id: editingPayment.booking_id, 
        status: editingPayment.status 
      });
    }
  };
  
  // Handle deleting payment
  const handleDeletePayment = (id: string) => {
    if (window.confirm("Are you sure you want to delete this payment record?")) {
      deletePaymentMutation.mutate(id);
    }
  };
  
  // Filter and search payments
  const filteredPayments = bookings?.filter(payment => {
    // Filter by status
    const statusMatch = statusFilter === 'all' || 
      payment.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Filter by search query
    const searchMatch = !searchQuery || 
      payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.package.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // Handle exporting payments data
  const handleExportPayments = () => {
    if (!filteredPayments || filteredPayments.length === 0) return;
    
    // Create CSV content
    const headers = ["Date", "Student Name", "Amount", "Package", "Status"];
    const csvRows = [headers.join(",")];
    
    filteredPayments.forEach(payment => {
      const row = [
        payment.date,
        payment.studentName,
        payment.amount,
        payment.package,
        payment.status
      ].map(value => `"${value}"`);
      
      csvRows.push(row.join(","));
    });
    
    // Create and download CSV file
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", "payments.csv");
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className={isMobile ? "text-xl" : "text-2xl"}>Payment History</CardTitle>
              <CardDescription>Track all financial transactions</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-[200px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="All Payments" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={handleExportPayments}
                  disabled={!filteredPayments || filteredPayments.length === 0}
                  className="sm:flex-1 md:flex-none"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className={isMobile ? "hidden" : "inline"}>Export</span>
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 sm:flex-1 md:flex-none"
                  onClick={() => setIsNewPaymentDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className={isMobile ? "hidden" : "inline"}>Record Payment</span>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <PaymentTable 
              payments={filteredPayments}
              isLoading={isLoadingBookings}
              onEditPayment={handleEditPayment}
              onDeletePayment={handleDeletePayment}
              deletePaymentMutation={deletePaymentMutation}
            />
          </div>
        </CardContent>
      </Card>
      
      <PaymentSummary 
        isLoading={isLoadingBookings}
        totalRevenue={analytics.totalRevenue}
        outstandingPayments={analytics.outstandingPayments}
        topPackages={analytics.topPackages}
      />

      <PaymentEditDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingPayment={editingPayment}
        setEditingPayment={setEditingPayment}
        onUpdatePayment={handleUpdatePayment}
        isUpdating={updatePaymentStatusMutation.isPending}
      />
      
      <NewPaymentDialog
        isOpen={isNewPaymentDialogOpen}
        setIsOpen={setIsNewPaymentDialogOpen}
      />
    </>
  );
};

export default PaymentsTab;
