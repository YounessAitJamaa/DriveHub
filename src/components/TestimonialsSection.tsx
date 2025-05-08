
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "New Driver",
    text: "The instructors were so patient with me. I was very nervous at first, but they helped me build confidence. Passed my test on the first try!",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    name: "David Chen",
    role: "Student",
    text: "I tried another driving school before, but the difference in quality here is remarkable. The structured approach to learning made everything click.",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    name: "Emma Thompson",
    role: "Parent",
    text: "As a parent, safety was my biggest concern. The professionalism and focus on defensive driving gave me peace of mind during my daughter's training.",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg"
  }
];

const TestimonialsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="py-10 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-800 mb-2 md:mb-4">What Our Students Say</h2>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from those who have already completed their journey with us.
          </p>
        </div>
        
        <div className="max-w-full md:max-w-4xl mx-auto">
          <div className="relative bg-blue-50 rounded-xl p-4 md:p-8 shadow-md">
            <div className="absolute -top-4 md:-top-5 left-1/2 transform -translate-x-1/2">
              <div className="h-12 w-12 md:h-16 md:w-16 rounded-full border-4 border-white shadow-md overflow-hidden">
                <img 
                  src={testimonials[activeIndex].avatar} 
                  alt={testimonials[activeIndex].name} 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            
            <div className="pt-6 md:pt-8 text-center">
              <blockquote className="text-sm md:text-base lg:text-lg italic text-gray-700 mb-3 md:mb-4">
                "{testimonials[activeIndex].text}"
              </blockquote>
              <div className="font-semibold text-blue-800 text-sm md:text-base">{testimonials[activeIndex].name}</div>
              <div className="text-gray-500 text-xs md:text-sm">{testimonials[activeIndex].role}</div>
            </div>
            
            <div className="flex justify-center mt-4 md:mt-6 space-x-1.5 md:space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 w-1.5 md:h-2 md:w-2 rounded-full ${
                    index === activeIndex ? "bg-blue-600" : "bg-blue-200"
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
