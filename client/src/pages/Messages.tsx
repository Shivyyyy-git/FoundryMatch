import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import avatar1 from "@assets/generated_images/Student_profile_avatar_1_237efb63.png";
import avatar2 from "@assets/generated_images/Student_profile_avatar_2_a3ed9adb.png";
import avatar3 from "@assets/generated_images/Student_profile_avatar_3_bd597b3b.png";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(0);
  const [messageInput, setMessageInput] = useState("");
  const { toast } = useToast();

  const conversations = [
    {
      id: 0,
      name: "Sarah Chen",
      avatar: avatar1,
      lastMessage: "That sounds great! When can we meet?",
      timestamp: "2m ago",
      unread: 2
    },
    {
      id: 1,
      name: "Marcus Rodriguez",
      avatar: avatar2,
      lastMessage: "I'll send over the project specs",
      timestamp: "1h ago",
      unread: 0
    },
    {
      id: 2,
      name: "Aisha Johnson",
      avatar: avatar3,
      lastMessage: "Thanks for the feedback!",
      timestamp: "3h ago",
      unread: 1
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Chen",
      content: "Hey! I saw your profile and noticed we're both interested in AI/ML projects.",
      timestamp: "10:30 AM",
      isMine: false
    },
    {
      id: 2,
      sender: "You",
      content: "Hi Sarah! Yes, I'd love to collaborate on something. What did you have in mind?",
      timestamp: "10:32 AM",
      isMine: true
    },
    {
      id: 3,
      sender: "Sarah Chen",
      content: "I'm working on a healthcare app that uses ML for diagnosis assistance. Would you be interested in joining the team?",
      timestamp: "10:35 AM",
      isMine: false
    },
    {
      id: 4,
      sender: "You",
      content: "That sounds really interesting! I have experience with TensorFlow and PyTorch. What stage is the project at?",
      timestamp: "10:37 AM",
      isMine: true
    },
    {
      id: 5,
      sender: "Sarah Chen",
      content: "We're in early stages, just finished the MVP. Perfect timing for you to join! We meet Tuesdays and Thursdays.",
      timestamp: "10:40 AM",
      isMine: false
    },
    {
      id: 6,
      sender: "You",
      content: "That works for me! I'm free those days.",
      timestamp: "10:42 AM",
      isMine: true
    },
    {
      id: 7,
      sender: "Sarah Chen",
      content: "That sounds great! When can we meet?",
      timestamp: "10:45 AM",
      isMine: false
    }
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log("Sending message:", messageInput);
      toast({
        title: "Message Sent!",
        description: `Your message to ${conversations[selectedChat].name} has been sent.`,
      });
      setMessageInput("");
    }
  };

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
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`w-full p-4 flex items-start gap-3 hover-elevate border-b ${
                    selectedChat === conv.id ? "bg-secondary" : ""
                  }`}
                  data-testid={`button-conversation-${conv.id}`}
                >
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={conv.avatar} alt={conv.name} />
                    <AvatarFallback>{conv.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground text-sm truncate">
                        {conv.name}
                      </h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {conv.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <Badge className="ml-2 flex-shrink-0 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <main className="flex-1 flex flex-col bg-background">
            <div className="p-4 border-b bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversations[selectedChat].avatar} alt={conversations[selectedChat].name} />
                  <AvatarFallback>{conversations[selectedChat].name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {conversations[selectedChat].name}
                  </h3>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" data-testid="button-more-options">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}
                  data-testid={`message-${message.id}`}
                >
                  <div className={`max-w-md ${message.isMine ? "items-end" : "items-start"} flex flex-col`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        message.isMine
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-card">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                  data-testid="input-message"
                />
                <Button 
                  onClick={handleSendMessage}
                  data-testid="button-send"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
