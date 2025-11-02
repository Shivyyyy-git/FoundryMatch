import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NetworkCardProps {
  name: string;
  userType: string;
  organization?: string;
  headline?: string;
  skills: string[];
  avatar?: string;
}

export function NetworkCard({ 
  name, 
  userType,
  organization,
  headline,
  skills,
  avatar
}: NetworkCardProps) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();
  const { toast } = useToast();

  const handleConnect = () => {
    toast({
      title: "Connection Request Sent!",
      description: `Your connection request has been sent to ${name}.`,
    });
  };

  const displayTitle = organization 
    ? `${userType} • ${organization}` 
    : userType;
  
  return (
    <Card 
      className="p-6 flex flex-col items-center text-center hover-elevate border" 
      style={{ borderColor: '#e5e7eb' }}
      data-testid={`card-network-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <Avatar className="h-20 w-20 mb-4">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
      </Avatar>
      
      <h3 className="text-lg font-bold text-foreground mb-1" data-testid={`text-name-${name.toLowerCase().replace(/\s+/g, '-')}`}>
        {name}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-3" data-testid="text-user-type">
        {displayTitle}
      </p>
      
      {headline && (
        <p className="text-sm text-foreground line-clamp-2 mb-4 w-full" data-testid="text-headline">
          {headline}
        </p>
      )}
      
      <div className="flex flex-wrap justify-center gap-2 mb-4 w-full">
        {skills.slice(0, 3).map((skill) => (
          <Badge 
            key={skill} 
            variant="secondary" 
            className="text-xs bg-gray-100 text-gray-700"
            data-testid={`badge-skill-${skill.toLowerCase()}`}
          >
            {skill}
          </Badge>
        ))}
        {skills.length > 3 && (
          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
            +{skills.length - 3}
          </Badge>
        )}
      </div>
      
      <Button 
        className="w-full mt-auto"
        data-testid="button-connect"
        onClick={handleConnect}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Connect
      </Button>
    </Card>
  );
}
