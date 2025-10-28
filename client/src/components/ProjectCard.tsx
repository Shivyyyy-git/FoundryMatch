import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Calendar } from "lucide-react";

interface ProjectCardProps {
  id: number;
  title: string;
  company: string;
  description: string;
  skills: string[];
  timeCommitment: string;
  teamSize: string;
  deadline?: string;
  type?: "paid" | "volunteer" | "credit";
  status?: string;
}

export function ProjectCard({
  id,
  title,
  company,
  description,
  skills,
  timeCommitment,
  teamSize,
  deadline,
  type = "volunteer",
  status = "open"
}: ProjectCardProps) {
  const typeColors = {
    paid: "bg-chart-3/20 text-chart-3 border-chart-3/30",
    volunteer: "bg-primary/20 text-primary border-primary/30",
    credit: "bg-chart-2/20 text-chart-2 border-chart-2/30"
  };

  return (
    <Card className="p-6 hover-elevate" data-testid={`card-project-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-foreground mb-1">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {company}
            </p>
          </div>
          <Badge className={typeColors[type]} data-testid={`badge-type-${type}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        </div>
        
        <p className="text-sm text-foreground line-clamp-3">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge 
              key={skill} 
              variant="secondary" 
              className="text-xs"
              data-testid={`badge-skill-${skill.toLowerCase()}`}
            >
              {skill}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{timeCommitment}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{teamSize}</span>
          </div>
          {deadline && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{deadline}</span>
            </div>
          )}
        </div>
        
        <Button 
          className="w-full"
          data-testid="button-apply"
        >
          Apply Now
        </Button>
      </div>
    </Card>
  );
}
