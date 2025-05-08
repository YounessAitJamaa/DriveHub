import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-blue-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        {/* Footer main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company info */}
          <div>
            <h3 className="text-xl font-bold mb-4">DriveHub</h3>
            <p className="text-blue-200 mb-4">
              Professional driving instruction with experienced, 
              patient instructors dedicated to your success.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/courses" className="text-blue-200 hover:text-white transition-colors">Courses</Link>
              <Link to="/contact" className="text-blue-200 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          
          {/* Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-300" />
                <span className="text-blue-200">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-300" />
                <span className="text-blue-200">info@drivehub.com</span>
              </li>
              <li className="text-blue-200 mt-2">
                <p>123 Main Street</p>
                <p>Anytown, CA 12345</p>
              </li>
            </ul>
          </div>
          
          {/* Office hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Office Hours</h3>
            <ul className="space-y-2">
              <li className="flex justify-between text-blue-200">
                <span>Monday - Friday:</span>
                <span>8:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between text-blue-200">
                <span>Saturday:</span>
                <span>9:00 AM - 4:00 PM</span>
              </li>
              <li className="flex justify-between text-blue-200">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link to="/booking" className="text-white font-semibold hover:text-blue-300 transition-colors">
                Book a Lesson →
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer bottom / copyright */}
        <div className="pt-8 border-t border-blue-800 text-center text-blue-300 text-sm">
          <p>© {year} DriveHub Driving School. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
