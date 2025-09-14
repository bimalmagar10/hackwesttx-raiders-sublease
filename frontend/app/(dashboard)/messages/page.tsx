"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Search, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getConversations, ConversationResponse } from "@/lib/api";

export default function Messages() {
  const router = useRouter();
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<ConversationResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!session?.user) return;

    const loadConversations = async () => {
      try {
        setLoading(true);
        const convs = await getConversations();
        setConversations(convs);
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [session?.user]);

  const filteredConversations = conversations.filter((conv) =>
    (conv.other_user_name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  const handleConversationClick = (conversation: ConversationResponse) => {
    router.push(`/messages/${conversation.other_user_id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex h-[calc(100vh-80px)] items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">
              Loading conversations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Messages
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredConversations.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No conversations yet
                  </h3>
                  <p className="text-gray-500">
                    Start a conversation by contacting someone from a sublease
                    listing!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredConversations.map((conversation) => (
                    <Card
                      key={conversation.conversation_id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleConversationClick(conversation)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src=""
                              alt={conversation.other_user_name || "User"}
                            />
                            <AvatarFallback>
                              {conversation.other_user_name
                                ? conversation.other_user_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {conversation.other_user_name || "Unknown User"}
                              </h4>
                              <div className="flex items-center space-x-2">
                                {conversation.unread_count > 0 && (
                                  <Badge
                                    variant="default"
                                    className="bg-blue-600"
                                  >
                                    {conversation.unread_count}
                                  </Badge>
                                )}
                                <span className="text-sm text-gray-500">
                                  {formatTime(conversation.last_message_at)}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {conversation.last_message || "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
