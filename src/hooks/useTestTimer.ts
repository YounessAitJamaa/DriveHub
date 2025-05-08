
import { useState, useEffect } from "react";
import { parseTimeLimit } from "@/utils/testUtils";
import { useToast } from "@/components/ui/use-toast";

export const useTestTimer = (timeLimit: string, testStarted: boolean, showResults: boolean) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Calculate time limit in seconds
  useEffect(() => {
    if (testStarted && !showResults) {
      const parsedTimeLimit = parseTimeLimit(timeLimit);
      setTimeLeft(parsedTimeLimit);
    }
  }, [testStarted, showResults, timeLimit]);
  
  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || !testStarted || showResults) return;
    
    if (timeLeft <= 0) {
      toast({
        title: "Time's up!",
        description: "Your test has been automatically submitted.",
        variant: "destructive",
      });
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, testStarted, showResults, toast]);
  
  return { timeLeft, setTimeLeft };
};
