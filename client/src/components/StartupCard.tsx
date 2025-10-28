import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ExternalLink } from "lucide-react";

interface StartupCardProps {
  name: string;
  tagline: string;
  description: string;
  category: string;
  teamSize: number;
  image?: string;
  founded?: string;
}

export function StartupCard({
  name,
  tagline,
  description,
  category,
  teamSize,
  image,
  founded = "2024"
}: StartupCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`card-startup-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      {image && (
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-bold text-white mb-1">
              {name}
            </h3>
            <p className="text-sm text-white/90">
              {tagline}
            </p>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {!image && (
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {tagline}
            </p>
          </div>
        )}
        
        <p className="text-sm text-foreground mb-4 line-clamp-3">
          {description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <Badge variant="secondary" data-testid="badge-category">
            {category}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{teamSize} members</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            data-testid="button-learn-more"
          >
            Learn More
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            data-testid="button-visit"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Visit
          </Button>
        </div>
      </div>
    </Card>
  );
}
