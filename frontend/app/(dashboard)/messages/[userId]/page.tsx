"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
} from "lucide-react";
import { useState } from "react";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        online: true,
      },
      lastMessage: "That sounds perfect! When can I schedule a viewing?",
      timestamp: "2 min ago",
      unread: 2,
      property: "Modern Studio Near Campus",
    },
    {
      id: 2,
      user: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        online: false,
      },
      lastMessage:
        "Thanks for your interest! The apartment is still available.",
      timestamp: "1 hour ago",
      unread: 0,
      property: "Spacious 1BR Apartment",
    },
    {
      id: 3,
      user: {
        name: "Emma Davis",
        avatar: "/placeholder.svg?height=40&width=40",
        online: true,
      },
      lastMessage: "Hi! I'm interested in your shared room listing.",
      timestamp: "3 hours ago",
      unread: 1,
      property: "Shared Room in House",
    },
    {
      id: 4,
      user: {
        name: "Alex Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        online: false,
      },
      lastMessage: "Could you tell me more about the parking situation?",
      timestamp: "1 day ago",
      unread: 0,
      property: "Downtown Loft",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "other",
      content:
        "Hi! I'm really interested in your studio apartment listing. Is it still available?",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      sender: "me",
      content:
        "Yes, it's still available! Thanks for your interest. Would you like to know more details?",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      sender: "other",
      content:
        "That's great! Could you tell me about the lease duration and what's included?",
      timestamp: "10:35 AM",
    },
    {
      id: 4,
      sender: "me",
      content:
        "The lease is flexible from 1-3 months. It's fully furnished and includes utilities, WiFi, and parking. The rent is $850/month.",
      timestamp: "10:37 AM",
    },
    {
      id: 5,
      sender: "other",
      content: "That sounds perfect! When can I schedule a viewing?",
      timestamp: "10:40 AM",
    },
  ];

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedChat
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
          {/* Conversations List */}
          <div className="lg:col-span-4 xl:col-span-3">
            <Card className="h-full bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-foreground">
                  Messages
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10 border-border focus:border-primary focus:ring-primary"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1 max-h-[calc(100vh-20rem)] overflow-y-auto">
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedChat(conversation.id)}
                      className={`w-full p-4 text-left hover:bg-muted/50 transition-colors border-l-4 ${
                        selectedChat === conversation.id
                          ? "bg-primary/5 border-l-primary"
                          : "border-l-transparent"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={
                                conversation.user.avatar || "/placeholder.svg"
                              }
                            />
                            <AvatarFallback>
                              {conversation.user.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.user.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-foreground truncate">
                              {conversation.user.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-muted-foreground">
                                {conversation.timestamp}
                              </span>
                              {conversation.unread > 0 && (
                                <Badge className="bg-primary text-primary-foreground text-xs px-2 py-1">
                                  {conversation.unread}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mb-1">
                            {conversation.property}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-8 xl:col-span-9">
            {selectedConversation ? (
              <Card className="h-full bg-card border-border flex flex-col">
                {/* Chat Header */}
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={
                              selectedConversation.user.avatar ||
                              "/placeholder.svg"
                            }
                          />
                          <AvatarFallback>
                            {selectedConversation.user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {selectedConversation.user.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {selectedConversation.user.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.property}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "me"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === "me"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === "me"
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Message Input */}
                <div className="border-t border-border p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="pr-10 border-border focus:border-primary focus:ring-primary"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full bg-card border-border flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
