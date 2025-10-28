import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchBar } from "@/components/SearchBar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Project, InsertProject } from "@shared/schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface PaginatedResponse {
  data: Project[];
  total: number;
  hasMore: boolean;
}

export default function ProjectGigs() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedResponse>({
    queryKey: ["/api/projects", "approved", searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams({
        approved: "true",
        limit: "20",
        offset: String(pageParam),
      });
      if (searchQuery) {
        params.set("q", searchQuery);
      }
      const res = await fetch(
        `/api/projects?${params.toString()}`,
        { credentials: "include" }
      );
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;
      return allPages.length * 20;
    },
    initialPageParam: 0,
  });

  const allProjects = data?.pages.flatMap(page => page.data) ?? [];
  
  // Apply client-side filters
  const projects = allProjects.filter(project => {
    if (typeFilter !== "all" && project.type !== typeFilter) {
      return false;
    }
    return true;
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsDialogOpen(false);
      toast({
        title: "Project submitted!",
        description: "Your project gig has been submitted for admin approval.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: "",
      company: "",
      description: "",
      skills: [],
      timeCommitment: "",
      teamSize: "",
      deadline: "",
      type: "volunteer",
    },
  });

  const onSubmit = (data: InsertProject) => {
    createProjectMutation.mutate(data);
  };

  const filteredProjects = projects.filter(project =>
    searchQuery === "" ||
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mockProjects = [
    {
      title: "Mobile App Developer",
      company: "HealthTech Startup",
      description: "We're building a mobile app to help students track their mental health and wellness. Looking for a React Native developer to join our founding team.",
      skills: ["React Native", "TypeScript", "Firebase", "UI/UX"],
      timeCommitment: "10-15 hrs/week",
      teamSize: "3-4 members",
      deadline: "Apply by Feb 15",
      type: "credit" as const
    },
    {
      title: "UX/UI Designer Wanted",
      company: "Social Impact Project",
      description: "Design an intuitive interface for a platform connecting volunteers with local nonprofits. Make a real difference in the community.",
      skills: ["Figma", "UI/UX", "User Research", "Prototyping"],
      timeCommitment: "8-10 hrs/week",
      teamSize: "2-3 members",
      type: "volunteer" as const
    },
    {
      title: "Data Analyst Position",
      company: "Environmental Research Lab",
      description: "Analyze climate data and create compelling visualizations for our environmental research project. Work with real-world datasets.",
      skills: ["Python", "Data Viz", "Statistics", "Pandas"],
      timeCommitment: "5-8 hrs/week",
      teamSize: "1-2 members",
      deadline: "Apply by Feb 20",
      type: "paid" as const
    },
    {
      title: "Full Stack Developer",
      company: "EdTech Platform",
      description: "Build features for an online learning platform used by thousands of students. Work with modern tech stack and agile methodology.",
      skills: ["React", "Node.js", "MongoDB", "TypeScript"],
      timeCommitment: "12-15 hrs/week",
      teamSize: "4-5 members",
      type: "paid" as const
    },
    {
      title: "Marketing Specialist",
      company: "Student Startup",
      description: "Help us grow our user base and build our brand. Create content, manage social media, and develop marketing strategies.",
      skills: ["Marketing", "Social Media", "Content Creation", "Analytics"],
      timeCommitment: "6-8 hrs/week",
      teamSize: "2-3 members",
      type: "credit" as const
    },
    {
      title: "Backend Engineer",
      company: "FinTech Project",
      description: "Develop secure and scalable APIs for a financial services platform. Experience with cloud infrastructure is a plus.",
      skills: ["Python", "Django", "PostgreSQL", "AWS"],
      timeCommitment: "10-12 hrs/week",
      teamSize: "3-4 members",
      deadline: "Apply by Feb 18",
      type: "paid" as const
    }
  ];

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-post-gig">
                  <Plus className="h-4 w-4 mr-2" />
                  Post a Gig
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Post a Project Gig</DialogTitle>
                  <DialogDescription>
                    Share your project opportunity with the Rochester community
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Title</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-project-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company/Organization</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-company" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} data-testid="textarea-description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Required Skills (comma-separated)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value?.join(", ") || ""}
                              onChange={(e) => field.onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                              placeholder="React, TypeScript, Node.js"
                              data-testid="input-skills"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-project-type-form">
                                <SelectValue placeholder="Select project type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="credit">For Credit</SelectItem>
                              <SelectItem value="volunteer">Volunteer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timeCommitment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Commitment (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="10-15 hrs/week" data-testid="input-time-commitment" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="teamSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Size (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="3-4 members" data-testid="input-team-size" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Application Deadline (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="Apply by Feb 15" data-testid="input-deadline" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={createProjectMutation.isPending} data-testid="button-submit-project">
                      {createProjectMutation.isPending ? "Submitting..." : "Submit Project"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search projects by title, company, or description..."
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-project-type">
                <SelectValue placeholder="Project Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="credit">For Credit</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {projects.length} opportunities available
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found{searchQuery ? " for your search" : ". Be the first to post one!"}!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                title={project.title}
                company={project.company}
                description={project.description}
                skills={project.skills}
                type={project.type as "paid" | "credit" | "volunteer"}
                timeCommitment={project.timeCommitment || ""}
                teamSize={project.teamSize || ""}
                deadline={project.deadline || undefined}
              />
            ))}
          </div>
        )}

        {hasNextPage && (
          <div className="mt-8 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              data-testid="button-load-more"
            >
              {isFetchingNextPage ? "Loading..." : "Load More Projects"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
