
import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { CreditCard, CheckCircle2, ShieldCheck } from "lucide-react";

type PaymentFormStripeProps = {
  amount: number;
  courseTitle: string;
  onSuccess: () => void;
}

const PaymentFormStripe = ({ amount, courseTitle, onSuccess }: PaymentFormStripeProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create a payment method using the CardElement
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("Card element not found");
      }
      
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Payment method created:", paymentMethod);
      
      // In a real application, you would make an API call to your backend to process the payment
      // For demonstration, we're simulating a successful payment
      
      setIsProcessing(false);
      setIsSuccess(true);
      
      toast({
        title: "Payment Successful",
        description: `Your payment of $${amount} for ${courseTitle} has been processed successfully.`,
      });
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (error: any) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto border-green-100 shadow-md">
        <CardContent className="pt-6 flex flex-col items-center">
          <div className="bg-green-50 p-4 rounded-full mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 text-center mb-4">
            Your payment of ${amount} for {courseTitle} has been processed successfully.
          </p>
          <p className="text-gray-600 text-center">
            A confirmation email has been sent to your email address.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-full">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Secure payment for {courseTitle}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="card-element" className="text-sm font-medium">
              Credit or Debit Card
            </label>
            <div className="p-3 border rounded-md bg-white">
              <CardElement 
                id="card-element"
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2 text-sm">
            <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-blue-800">Secure Payment</span>
              <p className="text-blue-700">Your payment information is encrypted and secure.</p>
            </div>
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 py-6"
              disabled={!stripe || isProcessing}
            >
              {isProcessing ? "Processing..." : `Pay $${amount}`}
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 text-center mt-2 flex justify-center items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            <span>Secured by Stripe. We don't store your card details.</span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentFormStripe;
