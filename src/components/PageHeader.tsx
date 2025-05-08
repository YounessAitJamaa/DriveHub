
import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

const PageHeader = ({ 
  title, 
  description, 
  className = ""
}: PageHeaderProps) => {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <h1 className="text-4xl font-bold text-blue-800 mb-4">{title}</h1>
      {description && (
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
