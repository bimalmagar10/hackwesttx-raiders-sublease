"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  isSuccessful?: boolean;
  children: React.ReactNode;
}

export function SubmitButton({ isSuccessful, children }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={pending ? "button" : "submit"}
      disabled={pending || isSuccessful}
      className="w-full"
      aria-disabled={pending || isSuccessful}
    >
      {children}
      {(pending || isSuccessful) && (
        <span className="animate-spin absolute right-4">
          <Loader2 />
        </span>
      )}
      <output aria-live="polite" className="sr-only">
        {pending || isSuccessful ? "Loading" : "Submit form"}
      </output>
    </Button>
  );
}
