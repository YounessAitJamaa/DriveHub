
import { Button } from "@/components/ui/button";

interface BookingInfoProps {
  className?: string;
}

export const BookingInfo = ({ className = "" }: BookingInfoProps) => {
  return (
    <div className={`mt-16 p-8 bg-blue-50 rounded-lg shadow-md ${className}`}>
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Booking Information</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-blue-700">Cancellation Policy</h3>
          <p className="text-gray-700">
            Free cancellation with 24 hours notice. Cancellations within 24 hours may be subject to a fee.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-blue-700">What to Bring</h3>
          <p className="text-gray-700">
            Please bring your provisional license, comfortable footwear, and glasses if required for driving.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-blue-700">Need Help?</h3>
          <p className="text-gray-700">
            If you have any questions or need assistance with booking, please don't hesitate to contact us.
          </p>
          <Button 
            variant="outline" 
            className="mt-2 text-blue-600 border-blue-600 hover:bg-blue-50"
            onClick={() => window.location.href = "tel:+1234567890"}
          >
            Call Us: (123) 456-7890
          </Button>
        </div>
      </div>
    </div>
  );
};
