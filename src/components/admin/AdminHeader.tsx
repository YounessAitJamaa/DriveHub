
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminHeaderProps {
  title: string;
  subtitle: string;
}

const AdminHeader = ({ title, subtitle }: AdminHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="py-4 md:py-6">
      <h1 className={`text-2xl ${isMobile ? '' : 'text-3xl'} font-bold text-blue-800`}>{title}</h1>
      <p className="text-sm md:text-base text-gray-600">{subtitle}</p>
    </div>
  );
};

export default AdminHeader;
