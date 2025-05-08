
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";

// Type for our auth mode
type AuthMode = "signIn" | "signUp";

const Auth = () => {
  const [authMode, setAuthMode] = useState<AuthMode>("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      navigate("/");
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      // First create the user account
      const { data, error } = await supabase.auth.signUp({
        email: values.email.trim().toLowerCase(),
        password: values.password,
        options: {
          data: {
            first_name: values.firstName.trim(),
            last_name: values.lastName.trim(),
          },
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });
      navigate("/");
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === "signIn" ? "signUp" : "signIn");
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          {authMode === "signIn" ? "Welcome Back" : "Create an Account"}
        </h1>
        <p className="text-gray-600 text-center mb-8">
          {authMode === "signIn"
            ? "Please sign in to your account"
            : "Please complete the form to create your account"}
        </p>

        {authMode === "signIn" ? (
          <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />
        ) : (
          <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} />
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleAuthMode}
            className="text-blue-600 hover:underline font-medium"
          >
            {authMode === "signIn"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Need to import these types even though we're using the imported components
// This is because we reference them directly in the handleSignIn and handleSignUp functions
const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .trim(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

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

export default Auth;
