
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Award, Shield, UserCheck } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative h-[90vh] bg-gradient-to-r from-blue-700 to-blue-500 flex items-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621600411688-4be14c7faf75?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800/80 to-blue-900/50" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              #1 Rated Driving School in the Region
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Professional Driving Instruction For All Levels
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Gain confidence and master the road with our expert instructors. Start your journey to driving independence today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold"
                onClick={() => navigate("/booking")}
              >
                Book a Lesson
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 font-semibold"
                onClick={() => navigate("/courses")}
              >
                Explore Courses
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-12">
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="h-5 w-5 text-white" />
                <span className="text-sm">Licensed Instructors</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Award className="h-5 w-5 text-white" />
                <span className="text-sm">High Pass Rate</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <UserCheck className="h-5 w-5 text-white" />
                <span className="text-sm">Personalized Training</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="bg-white p-6 rounded-lg shadow-xl animate-fade-in">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Fast-Track Your Booking</h3>
              <p className="text-gray-600 mb-6">Ready to start? Book your first lesson now and get on the road to driving success.</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">4.9/5</div>
                  <div className="text-sm text-gray-600">Student Rating</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">95%</div>
                  <div className="text-sm text-gray-600">Pass Rate</div>
                </div>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate("/payment", { 
                  state: { 
                    courseDetails: { 
                      title: "Evaluation Lesson", 
                      price: 49 
                    } 
                  } 
                })}
              >
                Book Evaluation Lesson - $49
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
};

export default HeroSection;
