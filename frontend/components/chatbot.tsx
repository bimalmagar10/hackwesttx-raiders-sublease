"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { faqData, faqCategories, searchFAQs, type FAQItem } from "@/lib/faq-data";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatbotProps {
  className?: string;
}

export function Chatbot({ className }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: "Hi! I'm here to help you with SubLease Pro. You can ask me questions or browse our FAQ below. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentView, setCurrentView] = useState<"chat" | "faq">("chat");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [faqSearchQuery, setFaqSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Search FAQ for relevant answers
    const relevantFAQs = searchFAQs(userMessage);
    
    if (relevantFAQs.length > 0) {
      const bestMatch = relevantFAQs[0];
      return `Great question! ${bestMatch.answer}\n\nWould you like to see more related FAQs? You can check the FAQ section for more detailed information.`;
    }
    
    // Fallback responses based on keywords
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! I'm here to help you with any questions about SubLease Pro. What would you like to know?";
    }
    
    if (lowerMessage.includes("help")) {
      return "I can help you with various topics including:\n• Listing your property\n• Finding subleases\n• Payment and verification\n• Documentation requirements\n• Student housing questions\n\nWhat specific area would you like help with?";
    }
    
    if (lowerMessage.includes("contact") || lowerMessage.includes("support")) {
      return "For additional support, you can:\n• Check our comprehensive FAQ section\n• Email us at support@subleasepro.com\n• Use our contact form in the app\n\nI'm also here to answer any immediate questions!";
    }
    
    return "I understand you're asking about that topic. While I may not have a specific answer, I recommend checking our FAQ section or contacting our support team for detailed assistance. Is there anything else I can help you with?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: generateBotResponse(inputValue),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFAQClick = (faq: FAQItem) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user", 
      content: faq.question,
      timestamp: new Date()
    };

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: faq.answer,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setCurrentView("chat");
  };

  const filteredFAQs = faqSearchQuery 
    ? searchFAQs(faqSearchQuery)
    : selectedCategory === "All" 
      ? faqData 
      : faqData.filter(faq => faq.category === selectedCategory);

  return (
    <div className={cn("flex flex-col h-[600px] w-full max-w-2xl bg-background border rounded-lg shadow-lg", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">SubLease Pro Assistant</h3>
        </div>
        <div className="flex rounded-lg border p-1">
          <Button
            variant={currentView === "chat" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("chat")}
            className="h-7 px-3"
          >
            Chat
          </Button>
          <Button
            variant={currentView === "faq" ? "default" : "ghost"}
            size="sm"
            onClick={() => setCurrentView("faq")}
            className="h-7 px-3"
          >
            FAQ
          </Button>
        </div>
      </div>

      {/* Chat View */}
      {currentView === "chat" && (
        <>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 max-w-[80%]",
                    message.type === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    message.type === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  )}>
                    {message.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className={cn(
                    "rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg px-3 py-2 text-sm bg-muted">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* FAQ View */}
      {currentView === "faq" && (
        <>
          {/* FAQ Search and Filters */}
          <div className="p-4 space-y-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                placeholder="Search FAQs..."
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {faqCategories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div 
                      className="flex items-center justify-between"
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    >
                      <h4 className="font-medium text-sm">{faq.question}</h4>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    {expandedFAQ === faq.id && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-muted-foreground mb-3">{faq.answer}</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFAQClick(faq);
                          }}
                        >
                          Ask this question
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
}
