
import React from "react";
import { Button } from "@/components/ui/button";

interface NavigationButtonProps {
  index: number;
  isActive: boolean;
  isAnswered: boolean;
  onClick: () => void;
}

const NavigationButton = ({ index, isActive, isAnswered, onClick }: NavigationButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`h-10 w-10 p-0 ${
        isActive
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : isAnswered
          ? 'bg-blue-100 border-blue-300'
          : ''
      }`}
      onClick={onClick}
    >
      {index + 1}
    </Button>
  );
};

export default NavigationButton;
