import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, User, LogOut, Car } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinkClass = "text-gray-700 hover:text-blue-600 transition-colors duration-200";
const navLinkActiveClass = "text-blue-600 font-semibold";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userRole, isAdmin, signOut } = useAuth();

  console.log('Header - User:', user?.email);
  console.log('Header - User Role:', userRole);
  console.log('Header - Is Admin:', isAdmin);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center h-8 w-8 bg-blue-700 rounded-full">
            <Car className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-blue-700">DriveRight Academy</span>
        </Link>
        
        <div className="hidden md:flex space-x-6">
          <NavLink to="/" className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
            Courses
          </NavLink>
          <NavLink to="/booking" className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
            Book Now
          </NavLink>
          
          {user ? (
            <>
              {isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
                  Admin
                </NavLink>
              )}
            </>
          ) : (
            <NavLink to="/contact" className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}>
              Contact
            </NavLink>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium">Account</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-500 capitalize mt-1">Role: {userRole || 'Unknown'}</p>
                </div>
                <DropdownMenuSeparator />
                {isAdmin ? (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="w-full cursor-pointer">Admin Dashboard</Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to="/booking" className="w-full cursor-pointer">My Bookings</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
        
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-blue-600 focus:outline-none">
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>
      
      {isMobileMenuOpen && (
        <div className="bg-gray-50 py-4 px-4">
          <NavLink to="/" className={({ isActive }) => `block py-2 ${isActive ? navLinkActiveClass : navLinkClass}`} onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => `block py-2 ${isActive ? navLinkActiveClass : navLinkClass}`} onClick={() => setIsMobileMenuOpen(false)}>
            Courses
          </NavLink>
          <NavLink to="/booking" className={({ isActive }) => `block py-2 ${isActive ? navLinkActiveClass : navLinkClass}`} onClick={() => setIsMobileMenuOpen(false)}>
            Book Now
          </NavLink>
          
          {user ? (
            <>
              {isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => `block py-2 ${isActive ? navLinkActiveClass : navLinkClass}`} onClick={() => setIsMobileMenuOpen(false)}>
                  Admin
                </NavLink>
              )}
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="block py-2 text-red-600 hover:text-red-800">
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/contact" className={({ isActive }) => `block py-2 ${isActive ? navLinkActiveClass : navLinkClass}`} onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;