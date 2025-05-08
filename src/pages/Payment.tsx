import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import PaymentFormStripe from "@/components/PaymentFormStripe";
import { ArrowLeft, ShieldCheck, CreditCard, Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Replace with your own publishable key
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state?.bookingDetails;

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-6 py-20">
          <PageHeader 
            title="Payment Error"
            description="No booking details found. Please try booking again."
          />
          <div className="flex justify-center">
            <Button onClick={() => navigate("/booking")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Booking
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-6 py-20">
        <PageHeader 
          title="Complete Your Payment"
          description="Secure payment processing for your driving lesson"
        />
        
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800">Booking Summary</CardTitle>
                <CardDescription>Review your booking details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{bookingDetails.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{bookingDetails.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course Type:</span>
                    <span className="font-medium">{bookingDetails.courseType}</span>
                  </div>
                  <div className="flex justify-between border-t pt-4">
                    <span className="text-gray-600 font-medium">Total Amount:</span>
                    <span className="text-blue-800 font-bold">${bookingDetails.amount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800">Payment Details</CardTitle>
                <CardDescription>Enter your payment information securely</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentFormStripe 
                  amount={bookingDetails.amount}
                  bookingDetails={bookingDetails}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-gray-600">
          <ShieldCheck className="h-5 w-5 text-green-600" />
          <span>Secure payment processing</span>
          <CreditCard className="h-5 w-5 text-blue-600" />
          <span>Multiple payment methods accepted</span>
          <Check className="h-5 w-5 text-green-600" />
          <span>Instant confirmation</span>
        </div>
      </div>
    </div>
  );
};

export default Payment;
