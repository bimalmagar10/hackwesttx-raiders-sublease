"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chatbot } from "@/components/chatbot";
import { Bot } from "lucide-react";

interface ChatbotPageProps {
  title?: string;
  description?: string;
}

export function ChatbotPage({ 
  title = "Help & Support", 
  description = "Get instant answers to your questions or browse our FAQ" 
}: ChatbotPageProps) {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        <p className="text-muted-foreground text-lg">{description}</p>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            SubLease Pro Assistant
          </CardTitle>
          <CardDescription>
            Ask questions about listing properties, finding subleases, payments, and more
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Chatbot className="border-0 shadow-none rounded-t-none" />
        </CardContent>
      </Card>

      {/* Additional help sections */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Start</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              New to SubLease Pro? Start with our getting started guide and learn how to list your first property or find the perfect sublease.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Need personalized help? Our support team is available 24/7 via email at support@subleasepro.com or through our contact form.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Safety Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Learn about our safety features, verification processes, and best practices for secure subleasing transactions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
