import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, Calendar, User, Car } from "lucide-react";

const FeatureSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Expert Instructors",
      description: "Learn from certified driving instructors with years of experience.",
      icon: <User className="h-6 w-6" />,
      link: "/courses"
    },
    {
      title: "Flexible Scheduling",
      description: "Book lessons at times that suit your schedule.",
      icon: <Calendar className="h-6 w-6" />,
      link: "/booking"
    },
    {
      title: "Modern Fleet",
      description: "Train in our well-maintained, dual-control vehicles.",
      icon: <Car className="h-6 w-6" />,
      link: "/courses"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">What We Offer</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything you need for a successful driving journey, from practical lessons to expert guidance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-blue-800 mb-2 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center mb-6">{feature.description}</p>
                <div className="flex justify-center">
                  <Button 
                    onClick={() => navigate(feature.link)} 
                    variant="outline" 
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    {feature.title}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
