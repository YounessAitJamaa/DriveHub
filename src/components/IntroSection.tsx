
import { Car, Award, Users, Clock } from "lucide-react";

const IntroSection = () => {
  const features = [
    {
      icon: <Car className="h-12 w-12 text-blue-500" />,
      title: "Modern Fleet",
      description: "Learn in our modern, dual-control vehicles equipped with the latest safety features."
    },
    {
      icon: <Award className="h-12 w-12 text-blue-500" />,
      title: "Certified Instructors",
      description: "All our instructors are fully certified with years of teaching experience."
    },
    {
      icon: <Users className="h-12 w-12 text-blue-500" />,
      title: "Personalized Learning",
      description: "We adapt our teaching methods to your learning style and pace."
    },
    {
      icon: <Clock className="h-12 w-12 text-blue-500" />,
      title: "Flexible Scheduling",
      description: "Book lessons at times that work for you, including evenings and weekends."
    }
  ];
  
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">Welcome to DriveHub</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We are a premier driving school dedicated to creating safe, confident drivers through 
            personalized instruction and a supportive learning environment.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-blue-50 p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
