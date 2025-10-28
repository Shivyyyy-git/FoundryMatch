import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, TrendingUp, ExternalLink } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface StartupCardProps {
  id: number;
  name: string;
  tagline: string;
  description: string;
  category: string;
  teamSize?: number;
  founded?: string;
  image?: string;
  websiteUrl?: string;
  upvotes?: number;
  stage?: string;
  seeking?: string[];
}

export function StartupCard({
  id,
  name,
  tagline,
  description,
  category,
  teamSize,
  founded,
  image,
  websiteUrl,
  upvotes = 0,
  stage,
  seeking = [],
}: StartupCardProps) {
  const { toast } = useToast();

  const upvoteMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/startups/${id}/upvote`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/startups"] });
      toast({
        title: "Upvoted!",
        description: "Thanks for supporting this startup!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upvote",
        variant: "destructive",
      });
    },
  });

  const handleUpvote = () => {
    upvoteMutation.mutate();
  };

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
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" data-testid="badge-category">
            {category}
          </Badge>
          {stage && (
            <Badge variant="secondary" data-testid="badge-stage">
              {stage}
            </Badge>
          )}
        </div>

        {seeking && seeking.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {seeking.slice(0, 3).map((item) => (
              <Badge 
                key={item}
                className="bg-primary/20 text-primary border-primary/30 text-xs"
                data-testid={`badge-seeking-${item.toLowerCase()}`}
              >
                Seeking: {item}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          {teamSize && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{teamSize} members</span>
            </div>
          )}
          {founded && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Founded {founded}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpvote}
            disabled={upvoteMutation.isPending}
            className="flex-1"
            data-testid="button-upvote"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            {upvotes}
          </Button>
          {websiteUrl ? (
            <Button 
              size="sm" 
              className="flex-1"
              asChild
              data-testid="button-visit"
            >
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Visit
              </a>
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
