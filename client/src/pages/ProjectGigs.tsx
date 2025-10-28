import { ProjectCard } from "@/components/ProjectCard";
import { PostProjectDialog } from "@/components/PostProjectDialog";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";

export default function ProjectGigs() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const filteredProjects = projects?.filter((project) => {
    if (search) {
      const searchLower = search.toLowerCase();
      const titleMatch = project.title.toLowerCase().includes(searchLower);
      const descMatch = project.description ? project.description.toLowerCase().includes(searchLower) : false;
      if (!titleMatch && !descMatch) {
        return false;
      }
    }
    if (typeFilter && project.compensation !== typeFilter) {
      return false;
    }
    if (categoryFilter && project.category !== categoryFilter) {
      return false;
    }
    return true;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Project Gigs
              </h1>
              <p className="text-muted-foreground">
                Discover exciting opportunities and gain real-world experience
              </p>
            </div>
            <PostProjectDialog />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search-projects"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-project-type">
                <SelectValue placeholder="Project Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="credit">For Credit</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Research">Research</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredProjects.length} projects available
          </p>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                company={project.userId}
                description={project.description}
                skills={project.skillsNeeded || []}
                timeCommitment={project.commitment || ""}
                teamSize=""
                type={project.compensation as "paid" | "volunteer" | "credit" | undefined}
                status={project.status || "open"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
