
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FeatureSection from "@/components/FeatureSection";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HeroSection />
      
      <IntroSection />
      
      <FeatureSection />
      
      <TestimonialsSection />
      
      <div className="py-16 bg-blue-50 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-blue-800 text-center mb-6">Ready to Start Your Driving Journey?</h2>
        <p className="text-gray-700 text-center max-w-2xl mb-8">
          Join thousands of successful drivers who started their journey with us. 
          Book your first lesson today and take the first step towards driving freedom.
        </p>
        <Button 
          size="lg" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-md animate-pulse"
          onClick={() => navigate("/booking")}
        >
          Book a Lesson Now
        </Button>
      </div>
    </div>
  );
};

export default Index;
