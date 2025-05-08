
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormIconInput from "./FormIconInput";

// Schema for sign up form with more fields
const signUpSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .trim(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormProps = {
  onSubmit: (values: z.infer<typeof signUpSchema>) => Promise<void>;
  isLoading: boolean;
};

const SignUpForm = ({ onSubmit, isLoading }: SignUpFormProps) => {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormIconInput
            label="First Name"
            icon={User}
            placeholder="John"
            autoComplete="given-name"
            field={form.register("firstName")}
          />

          <FormIconInput
            label="Last Name"
            icon={User}
            placeholder="Doe"
            autoComplete="family-name"
            field={form.register("lastName")}
          />
        </div>

        <FormIconInput
          label="Email"
          icon={Mail}
          placeholder="you@example.com"
          type="email"
          autoComplete="email"
          field={form.register("email")}
        />

        <FormIconInput
          label="Password"
          icon={Lock}
          placeholder="••••••••"
          type="password"
          autoComplete="new-password"
          field={form.register("password")}
        />

        <FormIconInput
          label="Confirm Password"
          icon={Lock}
          placeholder="••••••••"
          type="password"
          autoComplete="new-password"
          field={form.register("confirmPassword")}
        />

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
