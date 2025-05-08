
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, CalendarDays, DollarSign, Settings, UserCog } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminTabButtons = () => {
  const isMobile = useIsMobile();
  
  return (
    <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3 gap-1' : 'grid-cols-6'} mb-4 md:mb-8 overflow-x-auto`}>
      <TabsTrigger value="students" className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm">
        <Users className="h-3 w-3 md:h-4 md:w-4" />
        <span className={isMobile ? "hidden md:inline" : ""}>Students</span>
      </TabsTrigger>
      <TabsTrigger value="schedule" className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm">
        <CalendarDays className="h-3 w-3 md:h-4 md:w-4" />
        <span className={isMobile ? "hidden md:inline" : ""}>Schedule</span>
      </TabsTrigger>
      <TabsTrigger value="bookings" className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm">
        <CalendarDays className="h-3 w-3 md:h-4 md:w-4" />
        <span className={isMobile ? "hidden md:inline" : ""}>Bookings</span>
      </TabsTrigger>
      <TabsTrigger value="payments" className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm">
        <DollarSign className="h-3 w-3 md:h-4 md:w-4" />
        <span className={isMobile ? "hidden md:inline" : ""}>Payments</span>
      </TabsTrigger>
      <TabsTrigger value="roles" className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm">
        <UserCog className="h-3 w-3 md:h-4 md:w-4" />
        <span className={isMobile ? "hidden md:inline" : ""}>Roles</span>
      </TabsTrigger>
      <TabsTrigger value="settings" className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm">
        <Settings className="h-3 w-3 md:h-4 md:w-4" />
        <span className={isMobile ? "hidden md:inline" : ""}>Settings</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabButtons;
