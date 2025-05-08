
import React from "react";

interface ProgressBarProps {
  answered: number;
  total: number;
}

const ProgressBar = ({ answered, total }: ProgressBarProps) => {
  const percentage = (answered / total) * 100;
  
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Answered:</span>
        <span>{answered}/{total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
