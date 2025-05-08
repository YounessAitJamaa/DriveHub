
import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface FormIconInputProps {
  label: string;
  icon: LucideIcon;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  field: any;
}

const FormIconInput = ({
  label,
  icon: Icon,
  placeholder,
  type = "text",
  autoComplete,
  field,
}: FormIconInputProps) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-blue-600">
          <Icon className="ml-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder={placeholder}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            type={type}
            autoComplete={autoComplete}
            {...field}
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default FormIconInput;
