import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentCardProps {
  name: string;
  major: string;
  year: string;
  bio: string;
  skills: string[];
  avatar?: string;
  availability?: string;
}

export function StudentCard({ 
  name, 
  major, 
  year, 
  bio, 
  skills, 
  avatar,
  availability = "Available"
}: StudentCardProps) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();
  const { toast } = useToast();

  const handleViewProfile = () => {
    toast({
      title: "Profile View",
      description: `Viewing ${name}'s full profile...`,
    });
  };

  const handleConnect = () => {
    toast({
      title: "Connection Request Sent!",
      description: `Your connection request has been sent to ${name}.`,
    });
  };
  
  return (
    <Card className="p-6 hover-elevate" data-testid={`card-student-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {major} • {year}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {availability}
            </p>
          </div>
        </div>
        
        <p className="text-sm text-foreground line-clamp-2">
          {bio}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 4).map((skill) => (
            <Badge 
              key={skill} 
              variant="secondary" 
              className="text-xs"
              data-testid={`badge-skill-${skill.toLowerCase()}`}
            >
              {skill}
            </Badge>
          ))}
          {skills.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{skills.length - 4}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            data-testid="button-view-profile"
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            data-testid="button-connect"
            onClick={handleConnect}
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Connect
          </Button>
        </div>
      </div>
    </Card>
  );
}
