
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }).optional(),
  subject: z.string().min(1, { message: "Please select a subject." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const Contact = () => {
  const location = useLocation();
  const preSelectedSubject = location.state?.inquiry || "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: preSelectedSubject,
      message: "",
    },
  });
  
  const onSubmit = (data: z.infer<typeof contactFormSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would send data to an API
      console.log("Contact form submitted:", data);
      
      // Show success message
      toast({
        title: "Message Sent",
        description: "Thanks for reaching out! We'll get back to you as soon as possible.",
      });
      
      // Reset form
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  };

  const contactSubjects = [
    "General Inquiry",
    "Booking Question",
    "Pricing Information",
    "Instructor Feedback",
    "Theory Test Help",
    "Group Discount",
    "Career Opportunities",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Have questions or need assistance? We're here to help. Reach out to our team through any of the methods below.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <Card className="shadow-md h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800">Send Us a Message</CardTitle>
                <CardDescription>Fill out the form and we'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Your phone number" {...field} />
                            </FormControl>
                            <FormDescription>
                              We'll only call if needed
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {contactSubjects.map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How can we help you?" 
                              className="min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800">Our Location</CardTitle>
                <CardDescription>Visit us at our central office</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] bg-gray-200 rounded-md mb-4 overflow-hidden">
                  {/* Placeholder for map - in a real app, integrate a map service here */}
                  <div className="h-full w-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                    <p className="text-blue-800">Map Integration</p>
                  </div>
                </div>
                <div className="flex items-start mb-4">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium">DriveHub Driving School</h3>
                    <p className="text-gray-600">123 Main Street</p>
                    <p className="text-gray-600">Anytown, CA 12345</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
                  onClick={() => window.open("https://maps.google.com", "_blank")}
                >
                  Get Directions
                </Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800">Contact Information</CardTitle>
                <CardDescription>Reach us directly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600">(123) 456-7890</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">info@drivehub.com</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Office Hours</h3>
                    <div className="grid grid-cols-2 gap-2 text-gray-600">
                      <div>Monday - Friday</div>
                      <div>8:00 AM - 6:00 PM</div>
                      <div>Saturday</div>
                      <div>9:00 AM - 4:00 PM</div>
                      <div>Sunday</div>
                      <div>Closed</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800">Connect With Us</CardTitle>
                <CardDescription>Follow us on social media</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50" 
                    onClick={() => window.open("https://facebook.com", "_blank")}
                  >
                    <Facebook className="h-5 w-5 mr-2" />
                    Facebook
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50" 
                    onClick={() => window.open("https://instagram.com", "_blank")}
                  >
                    <Instagram className="h-5 w-5 mr-2" />
                    Instagram
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50" 
                    onClick={() => window.open("https://twitter.com", "_blank")}
                  >
                    <Twitter className="h-5 w-5 mr-2" />
                    Twitter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
