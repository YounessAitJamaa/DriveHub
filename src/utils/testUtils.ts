
import { Test, TestScore } from "@/types/theory";

// Format time as MM:SS
export const formatTime = (seconds: number | null): string => {
  if (seconds === null) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Calculate score
export const calculateScore = (test: Test, selectedAnswers: number[]): TestScore | null => {
  let correct = 0;
  test.questions.forEach((question, index) => {
    if (selectedAnswers[index] === question.correctAnswer) {
      correct++;
    }
  });
  
  return {
    correct,
    total: test.questions.length,
    percentage: Math.round((correct / test.questions.length) * 100)
  };
};

// Get pass/fail status
export const getResultStatus = (score: TestScore | null): "pass" | "fail" | null => {
  if (!score) return null;
  return score.percentage >= 70 ? "pass" : "fail";
};

// Parse time limit from string (e.g., "20 minutes" -> 1200 seconds)
export const parseTimeLimit = (timeLimit: string): number | null => {
  const match = timeLimit.match(/(\d+)/);
  if (match) {
    const minutes = parseInt(match[1]);
    return minutes * 60;
  }
  return null;
};
