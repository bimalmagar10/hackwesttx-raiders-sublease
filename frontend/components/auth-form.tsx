"use client";

import Form from "next/form";

interface AuthFormProps {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  defaultEmail?: string;
  children: React.ReactNode;
}

//Generic authentication form component for login and registration
export function AuthForm({ action, children }: AuthFormProps) {
  return (
    <Form action={action} className="space-y-4">
      {children}
    </Form>
  );
}
