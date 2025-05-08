
import React from "react";
import { Check, X } from "lucide-react";

interface ResultStatusProps {
  isPassed: boolean;
}

const ResultStatus = ({ isPassed }: ResultStatusProps) => {
  if (isPassed) {
    return (
      <div className="bg-green-100 p-6 rounded-md">
        <Check className="mx-auto h-12 w-12 text-green-600 mb-2" />
        <h3 className="text-2xl font-bold text-green-700">PASS</h3>
        <p className="text-green-600">Congratulations! You passed the test.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-red-100 p-6 rounded-md">
      <X className="mx-auto h-12 w-12 text-red-600 mb-2" />
      <h3 className="text-2xl font-bold text-red-700">FAIL</h3>
      <p className="text-red-600">You didn't pass this time. Review your answers and try again.</p>
    </div>
  );
};

export default ResultStatus;
