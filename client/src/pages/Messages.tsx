import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search, MoreVertical } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Message, User } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

interface Conversation {
  otherUser: User;
  lastMessage: Message;
  unreadCount: number;
}

export default function Messages() {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: conversationMessages = [] } = useQuery<Message[]>({
    queryKey: ['/api/messages/conversation', selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return [];
      const response = await fetch(`/api/messages/${selectedUserId}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch conversation');
      return response.json();
    },
    enabled: !!selectedUserId,
    refetchInterval: 3000, // Poll every 3 seconds for active conversation
  });

  const sendMutation = useMutation({
    mutationFn: (data: { receiverId: string; content: string }) =>
      apiRequest("POST", "/api/messages", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      if (selectedUserId) {
        queryClient.invalidateQueries({ queryKey: ['/api/messages/conversation', selectedUserId] });
      }
      setMessageInput("");
    },
  });

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedUserId) {
      sendMutation.mutate({
        receiverId: selectedUserId,
        content: messageInput.trim(),
      });
    }
  };

  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (selectedUserId && conversationMessages.length > 0) {
        const unreadMessages = conversationMessages.filter(
          m => m.receiverId === user?.id && !m.read
        );
        
        if (unreadMessages.length > 0) {
          try {
            await Promise.all(
              unreadMessages.map(message =>
                apiRequest("PATCH", `/api/messages/${message.id}/read`)
              )
            );
            
            queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
            queryClient.invalidateQueries({ queryKey: ['/api/messages/conversation', selectedUserId] });
          } catch (error) {
            console.error("Failed to mark messages as read:", error);
          }
        }
      }
    };

    markMessagesAsRead();
  }, [selectedUserId, conversationMessages.length, user?.id]);

  const sortedMessages = [...messages].sort((a, b) => 
    new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  );

  const conversations: Conversation[] = [];
  const seenUsers = new Set<string>();

  sortedMessages.forEach((message) => {
    const otherUserId = message.senderId === user?.id ? message.receiverId : message.senderId;
    
    if (seenUsers.has(otherUserId)) return;
    seenUsers.add(otherUserId);

    const otherUser = users.find(u => u.id === otherUserId);
    if (!otherUser) return;

    const userMessages = sortedMessages.filter(
      m => m.senderId === otherUserId || m.receiverId === otherUserId
    );

    const lastMessage = userMessages[0];
    const unreadCount = userMessages.filter(
      m => m.receiverId === user?.id && !m.read && m.senderId === otherUserId
    ).length;

    conversations.push({
      otherUser,
      lastMessage,
      unreadCount,
    });
  });

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!selectedUserId && filteredConversations.length > 0) {
      setSelectedUserId(filteredConversations[0].otherUser.id);
    }
  }, [filteredConversations.length, selectedUserId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (filteredConversations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No conversations yet.</p>
          <p className="text-sm text-muted-foreground">
            Start a conversation by connecting with other students!
          </p>
        </div>
      </div>
    );
  }

  const selectedConversation = filteredConversations.find(
    c => c.otherUser.id === selectedUserId
  );

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-messages"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => {
                const displayName = [conv.otherUser.firstName, conv.otherUser.lastName]
                  .filter(Boolean)
                  .join(" ") || conv.otherUser.email || "Unknown User";
                
                const initials = conv.otherUser.firstName && conv.otherUser.lastName
                  ? `${conv.otherUser.firstName[0]}${conv.otherUser.lastName[0]}`
                  : conv.otherUser.email?.[0]?.toUpperCase() || "?";

                return (
                  <button
                    key={conv.otherUser.id}
                    onClick={() => setSelectedUserId(conv.otherUser.id)}
                    className={`w-full p-4 flex items-start gap-3 hover-elevate border-b ${
                      selectedUserId === conv.otherUser.id ? "bg-secondary" : ""
                    }`}
                    data-testid={`button-conversation-${conv.otherUser.id}`}
                  >
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      {conv.otherUser.profileImageUrl && (
                        <AvatarImage src={conv.otherUser.profileImageUrl} alt={displayName} />
                      )}
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground text-sm truncate">
                          {displayName}
                        </h3>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                          {new Date(conv.lastMessage.createdAt!).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
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
                );
              })}
            </div>
          </aside>

          {selectedConversation && (
            <main className="flex-1 flex flex-col bg-background">
              <div className="p-4 border-b bg-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {selectedConversation.otherUser.profileImageUrl && (
                      <AvatarImage 
                        src={selectedConversation.otherUser.profileImageUrl} 
                        alt={[selectedConversation.otherUser.firstName, selectedConversation.otherUser.lastName].filter(Boolean).join(" ")} 
                      />
                    )}
                    <AvatarFallback>
                      {selectedConversation.otherUser.firstName && selectedConversation.otherUser.lastName
                        ? `${selectedConversation.otherUser.firstName[0]}${selectedConversation.otherUser.lastName[0]}`
                        : selectedConversation.otherUser.email?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {[selectedConversation.otherUser.firstName, selectedConversation.otherUser.lastName]
                        .filter(Boolean)
                        .join(" ") || selectedConversation.otherUser.email}
                    </h3>
                    <p className="text-xs text-muted-foreground">Rochester student</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" data-testid="button-more-options">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationMessages.map((message) => {
                  const isMine = message.senderId === user?.id;
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
                          {new Date(message.createdAt!).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
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
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    className="flex-1"
                    disabled={sendMutation.isPending}
                    data-testid="input-message"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sendMutation.isPending}
                    data-testid="button-send"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}
