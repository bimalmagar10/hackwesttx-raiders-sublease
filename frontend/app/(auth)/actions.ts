"use server";

import { signIn } from "./auth";
import { z } from "zod";
import { fetchAPI } from "@/lib/api";

export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
  message?: string;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function login(
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate input data
  const validationResult = loginSchema.safeParse({ email, password });

  if (!validationResult.success) {
    return {
      status: "invalid_data",
      message: validationResult.error.issues[0]?.message || "Invalid data",
    };
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return {
        status: "failed",
        message: "Invalid credentials",
      };
    }

    return {
      status: "success",
      message: "Login successful",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }
    return {
      status: "failed",
      message: "Invalid credentials",
    };
  }
}

export async function register(
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate input data
  const validationResult = registerSchema.safeParse({
    first_name,
    last_name,
    email,
    password,
  });

  if (!validationResult.success) {
    return {
      status: "invalid_data",
      message: validationResult.error.issues[0]?.message || "Invalid data",
    };
  }

  try {
    // Call your backend API to register the user
    await fetchAPI<{ message: string }>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        password,
      }),
    });

    // After successful registration, automatically sign in the user
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (signInResult?.error) {
      return {
        status: "success",
        message: "Registration successful! Please sign in.",
      };
    }

    return {
      status: "success",
      message: "Registration successful! You are now logged in.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      status: "failed",
      message: "Registration failed. Please try again.",
    };
  }
}
