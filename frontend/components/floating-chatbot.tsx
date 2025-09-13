"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Chatbot } from "@/components/chatbot";
import { cn } from "@/lib/utils";

interface FloatingChatbotProps {
  className?: string;
}

export function FloatingChatbot({ className }: FloatingChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      {/* Pulse animation when closed - positioned behind the button */}
      {!isOpen && (
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping pointer-events-none -z-10" />
      )}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className={cn(
              "relative h-14 w-14 rounded-full shadow-lg transition-all duration-200 hover:scale-105",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "dark:shadow-red-glow dark:hover:shadow-red-glow-strong"
            )}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MessageCircle className="h-6 w-6" />
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-2xl p-0 gap-0 h-[90vh] sm:h-auto">
          <Chatbot className="border-0 shadow-none" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
