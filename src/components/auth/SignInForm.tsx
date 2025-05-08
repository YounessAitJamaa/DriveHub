
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormIconInput from "./FormIconInput";

// Schema for sign in form
const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .trim(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type SignInFormProps = {
  onSubmit: (values: z.infer<typeof signInSchema>) => Promise<void>;
  isLoading: boolean;
};

const SignInForm = ({ onSubmit, isLoading }: SignInFormProps) => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          autoComplete="current-password"
          field={form.register("password")}
        />

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
