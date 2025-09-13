"use client";

import { useState, useEffect, useActionState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/header";
import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";
import { login, LoginActionState } from "../actions";
import Link from "next/link";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    { status: "idle" }
  );
  const { update: updateSession } = useSession();
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  useEffect(() => {
    if (state.status === "failed") {
      toast.error(state.message || "Login failed");
    } else if (state.status === "invalid_data") {
      toast.error(state.message || "Invalid data");
    } else if (state.status === "success") {
      setIsSuccessful(true);
      toast.success(state.message || "Login successful");
      // Update the session after successful login
      updateSession();
      router.refresh();
    }
  }, [state.status]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Sign in to your account
            </h2>
            <p className="mt-2 text-muted-foreground">
              Welcome back! Please enter your details to continue.
            </p>
          </div>

          {/* Auth Form */}
          <AuthForm action={handleSubmit} defaultEmail={email}>
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={email}
                className="mt-2 h-12 border-border focus:border-primary focus:ring-primary"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-2 h-12 border-border focus:border-primary focus:ring-primary"
                placeholder="Enter your password"
              />
            </div>
            {/* Remember Me & Forgot Password Section */}
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-muted-foreground"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="#"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Forgot your password?
                </Link>
              </div>
            </div> */}

            <SubmitButton isSuccessful={isSuccessful}>Sign In</SubmitButton>
          </AuthForm>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              href="/register"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Sign up for free
            </Link>
          </div>

          {/* Terms */}
          <div className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="#" className="text-primary hover:text-primary/80">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary hover:text-primary/80">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
