import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Clock, UserCheck, Award, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";

const Courses = () => {
  const navigate = useNavigate();

  const handleBookCourse = (courseType: string) => {
    navigate('/booking', { state: { course: courseType } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-6 py-20">
        <PageHeader 
          title="Our Driving Courses"
          description="We offer a variety of driving courses tailored to your needs, whether you're a complete beginner
          or looking to improve specific skills. All courses are taught by certified professional instructors."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Beginner's Package */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg pb-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold">Beginner's Package</CardTitle>
                <Badge variant="secondary" className="bg-white text-blue-700">Popular</Badge>
              </div>
              <CardDescription className="text-blue-100 mt-2">Perfect for new drivers</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-800 mb-4">$599</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>20 hours of practical driving lessons</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Complete theory training materials</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Practice test simulations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Pick-up and drop-off service</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Pre-test evaluation</span>
                </li>
              </ul>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Clock className="h-4 w-4 mr-1" />
                <span>20 hours of instruction</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Flexible scheduling</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleBookCourse("Beginner's Package")}
              >
                Book This Course <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          {/* Advanced Driver Package */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-700 text-white rounded-t-lg pb-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold">Advanced Driver Package</CardTitle>
                <Badge variant="secondary" className="bg-white text-blue-700">Premium</Badge>
              </div>
              <CardDescription className="text-blue-100 mt-2">For experienced drivers</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-800 mb-4">$399</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>10 hours of advanced driving techniques</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Defensive driving training</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Highway and complex traffic navigation</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Night driving sessions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Advanced parking techniques</span>
                </li>
              </ul>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <UserCheck className="h-4 w-4 mr-1" />
                <span>Experienced instructors</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Award className="h-4 w-4 mr-1" />
                <span>Certificate included</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-blue-700 hover:bg-blue-800 text-white"
                onClick={() => handleBookCourse("Advanced Driver Package")}
              >
                Book This Course <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          {/* Intensive Course */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-blue-100">
            <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-t-lg pb-6">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold">Intensive Course</CardTitle>
                <Badge variant="secondary" className="bg-white text-blue-700">Fast Track</Badge>
              </div>
              <CardDescription className="text-blue-100 mt-2">Learn quickly and efficiently</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-800 mb-4">$799</div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>30 hours of lessons in just 2 weeks</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Accelerated theory and practical training</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Priority test booking service</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Extended practice sessions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Test day preparation and vehicle</span>
                </li>
              </ul>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Clock className="h-4 w-4 mr-1" />
                <span>30 hours over 2 weeks</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Award className="h-4 w-4 mr-1" />
                <span>100% pass support</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => handleBookCourse("Intensive Course")}
              >
                Book This Course <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">Custom Training Options</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Need something specific? We also offer customized driving courses tailored to your individual needs.
            Contact us to discuss creating a personalized training program.
          </p>
          <Button 
            variant="outline" 
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={() => navigate('/contact')}
          >
            Contact Us About Custom Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Courses;
