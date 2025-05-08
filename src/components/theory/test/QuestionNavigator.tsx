
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavigationButton from "./NavigationButton";
import ProgressBar from "./ProgressBar";

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestion: number;
  selectedAnswers: number[];
  onQuestionSelect: (index: number) => void;
  onSubmitTest: () => void;
}

const QuestionNavigator = ({ 
  totalQuestions, 
  currentQuestion, 
  selectedAnswers,
  onQuestionSelect,
  onSubmitTest
}: QuestionNavigatorProps) => {
  const answeredCount = selectedAnswers.filter(a => a !== -1).length;
  const allAnswered = !selectedAnswers.includes(-1);
  
  return (
    <Card className="border-blue-100 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-md text-blue-800">Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }).map((_, idx) => (
            <NavigationButton
              key={idx}
              index={idx}
              isActive={idx === currentQuestion}
              isAnswered={selectedAnswers[idx] !== -1}
              onClick={() => onQuestionSelect(idx)}
            />
          ))}
        </div>
        
        <ProgressBar answered={answeredCount} total={totalQuestions} />
        
        <Button
          className="w-full mt-6 bg-green-600 hover:bg-green-700"
          onClick={onSubmitTest}
          disabled={!allAnswered}
        >
          Submit Test
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuestionNavigator;
