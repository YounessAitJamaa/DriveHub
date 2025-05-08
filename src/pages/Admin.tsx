import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Students from "./admin/Students";
import Schedule from "./admin/Schedule";
import Payments from "./admin/Payments";
import AdminHeader from "@/components/admin/AdminHeader";
import BookingManagement from "@/components/admin/BookingManagement";
import SettingsTab from "@/components/admin/SettingsTab";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import RoleManagement from "@/components/admin/RoleManagement";
import { useIsMobile } from "@/hooks/use-mobile";

const Admin = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("students");
  
  // Show loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Redirect if not admin
  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 md:px-6 py-4 md:py-6">
        <AdminHeader 
          title="Admin Dashboard" 
          subtitle="Manage your driving school operations" 
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students">
            <Students />
          </TabsContent>
          
          <TabsContent value="schedule">
            <Schedule />
          </TabsContent>
          
          <TabsContent value="payments">
            <Payments />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingManagement />
          </TabsContent>

          <TabsContent value="roles">
            <RoleManagement />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
