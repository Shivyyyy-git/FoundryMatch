import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search, MoreVertical } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Message, User } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow, format } from "date-fns";

interface ConversationData {
  otherUserId: string;
  otherUser: User | null;
  lastMessage: Message;
  unreadCount: number;
}

export default function Messages() {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const { toast } = useToast();

  const { data: allMessages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const { data: allUsers = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const conversations = useMemo(() => {
    if (!user || !allMessages.length) return [];

    const conversationMap = new Map<string, ConversationData>();

    allMessages.forEach(msg => {
      const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
      
      const existingConv = conversationMap.get(otherUserId);
      if (!existingConv || (msg.createdAt && existingConv.lastMessage.createdAt && new Date(msg.createdAt) > new Date(existingConv.lastMessage.createdAt))) {
        const otherUser = allUsers.find(u => u.id === otherUserId) || null;
        const unreadCount = allMessages.filter(
          m => m.senderId === otherUserId && m.receiverId === user.id && !m.isRead
        ).length;

        conversationMap.set(otherUserId, {
          otherUserId,
          otherUser,
          lastMessage: msg,
          unreadCount,
        });
      }
    });

    return Array.from(conversationMap.values()).sort(
      (a, b) => {
        const bTime = b.lastMessage.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
        const aTime = a.lastMessage.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
        return bTime - aTime;
      }
    );
  }, [allMessages, allUsers, user]);

  useEffect(() => {
    if (!selectedUserId && conversations.length > 0) {
      setSelectedUserId(conversations[0].otherUserId);
    }
  }, [conversations, selectedUserId]);

  const selectedConversation = conversations.find(c => c.otherUserId === selectedUserId);

  const conversationMessages = useMemo(() => {
    if (!selectedUserId || !user) return [];
    
    return allMessages
      .filter(msg =>
        (msg.senderId === user.id && msg.receiverId === selectedUserId) ||
        (msg.receiverId === user.id && msg.senderId === selectedUserId)
      )
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aTime - bTime;
      });
  }, [allMessages, selectedUserId, user]);

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { receiverId: string; content: string }) => {
      return await apiRequest("POST", "/api/messages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Message Sent!",
        description: selectedConversation?.otherUser?.firstName && selectedConversation?.otherUser?.lastName
          ? `Your message to ${selectedConversation.otherUser.firstName} ${selectedConversation.otherUser.lastName} has been sent.`
          : "Your message has been sent.",
      });
      setMessageInput("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedUserId) {
      sendMessageMutation.mutate({
        receiverId: selectedUserId,
        content: messageInput.trim(),
      });
    }
  };

  if (!user) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to view messages.</p>
      </div>
    );
  }

  if (messagesLoading || usersLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] bg-background">
      <div className="h-full max-w-7xl mx-auto">
        <div className="flex h-full">
          <aside className="w-80 border-r bg-card flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-foreground mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                  data-testid="input-search-messages"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="flex items-center justify-center h-full p-4">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">
                      No conversations yet
                    </p>
                  </div>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.otherUserId}
                    onClick={() => setSelectedUserId(conv.otherUserId)}
                    className={`w-full p-4 flex items-start gap-3 hover-elevate border-b ${
                      selectedUserId === conv.otherUserId ? "bg-secondary" : ""
                    }`}
                    data-testid={`button-conversation-${conv.otherUserId}`}
                  >
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage 
                        src={conv.otherUser?.profileImageUrl || undefined} 
                        alt={`${conv.otherUser?.firstName} ${conv.otherUser?.lastName}`} 
                      />
                      <AvatarFallback>
                        {conv.otherUser?.firstName && conv.otherUser?.lastName
                          ? `${conv.otherUser.firstName[0]}${conv.otherUser.lastName[0]}`
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground text-sm truncate">
                          {conv.otherUser?.firstName && conv.otherUser?.lastName
                            ? `${conv.otherUser.firstName} ${conv.otherUser.lastName}`
                            : "Unknown User"}
                        </h3>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                          {conv.lastMessage.createdAt && formatDistanceToNow(new Date(conv.lastMessage.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.lastMessage.senderId === user.id ? "You: " : ""}
                          {conv.lastMessage.content}
                        </p>
                        {conv.unreadCount > 0 && (
                          <Badge className="ml-2 flex-shrink-0 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>

          {selectedConversation ? (
            <main className="flex-1 flex flex-col bg-background">
              <div className="p-4 border-b bg-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={selectedConversation.otherUser?.profileImageUrl || undefined}
                      alt={`${selectedConversation.otherUser?.firstName} ${selectedConversation.otherUser?.lastName}`}
                    />
                    <AvatarFallback>
                      {selectedConversation.otherUser?.firstName && selectedConversation.otherUser?.lastName
                        ? `${selectedConversation.otherUser.firstName[0]}${selectedConversation.otherUser.lastName[0]}`
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {selectedConversation.otherUser?.firstName && selectedConversation.otherUser?.lastName
                        ? `${selectedConversation.otherUser.firstName} ${selectedConversation.otherUser.lastName}`
                        : "Unknown User"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation.otherUser?.major || "University of Rochester"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" data-testid="button-more-options">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationMessages.map((message) => {
                  const isMine = message.senderId === user.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      data-testid={`message-${message.id}`}
                    >
                      <div className={`max-w-md ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isMine
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          {message.createdAt && format(new Date(message.createdAt), "h:mm a")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t bg-card">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !sendMessageMutation.isPending && handleSendMessage()}
                    className="flex-1"
                    data-testid="input-message"
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    data-testid="button-send"
                    disabled={sendMessageMutation.isPending || !messageInput.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </main>
          ) : (
            <main className="flex-1 flex items-center justify-center bg-background">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">No conversations yet</h2>
                <p className="text-muted-foreground">
                  Connect with other students to start messaging!
                </p>
              </div>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}
