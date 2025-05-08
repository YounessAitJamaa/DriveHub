import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import RoleBasedRoute from "@/components/RoleBasedRoute";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Payment from "./pages/Payment";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-16">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/booking" element={
                  <RoleBasedRoute allowedRoles={["admin", "client"]}>
                    <Booking />
                  </RoleBasedRoute>
                } />
                <Route path="/payment" element={
                  <RoleBasedRoute allowedRoles={["admin", "client"]}>
                    <Payment />
                  </RoleBasedRoute>
                } />
                <Route path="/admin" element={
                  <RoleBasedRoute allowedRoles={["admin"]}>
                    <Admin />
                  </RoleBasedRoute>
                } />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
