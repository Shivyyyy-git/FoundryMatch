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
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// Project types matching the API
type ProjectCategory = "software" | "research" | "product" | "design" | "marketing" | "hardware" | "data_science";
type CompensationType = "paid" | "equity" | "academic_credit" | "volunteer";

// API response types
type Project = {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: ProjectCategory;
  compensationType: CompensationType;
  applicationDeadline: string | null;
  requiredSkills: string[];
  status: string;
  createdAt: string;
  creator: {
    id: string;
    email: string;
    name: string;
    profileImageKey: string | null;
  };
};

type ProjectsResponse = {
  projects: Project[];
};

// Form schema matching API
const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["software", "research", "product", "design", "marketing", "hardware", "data_science"]),
  compensationType: z.enum(["paid", "equity", "academic_credit", "volunteer"]),
  requiredSkills: z.array(z.string()).min(1, "At least one skill is required"),
  applicationDeadline: z.string().optional().nullable(),
});

type CreateProjectInput = z.infer<typeof createProjectSchema>;

export default function ProjectGigs() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [compensationFilter, setCompensationFilter] = useState<string>("all");
  const { toast } = useToast();

  // Fetch projects from API
  const { data, isLoading, refetch } = useQuery<ProjectsResponse>({
    queryKey: ["/api/projects", searchQuery, categoryFilter, compensationFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.set("search", searchQuery);
      }
      if (categoryFilter !== "all") {
        params.set("category", categoryFilter);
      }
      if (compensationFilter !== "all") {
        params.set("compensationType", compensationFilter);
      }
      
      const res = await fetch(`/api/projects?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }
      return res.json();
    },
  });

  const projects = data?.projects ?? [];

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: CreateProjectInput) => {
      const res = await apiRequest("POST", "/api/projects", {
        ...data,
        applicationDeadline: data.applicationDeadline || null,
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create project");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Project submitted!",
        description: "Your project has been submitted for admin approval.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "software",
      compensationType: "volunteer",
      requiredSkills: [],
      applicationDeadline: null,
    },
  });

  const onSubmit = (data: CreateProjectInput) => {
    createProjectMutation.mutate(data);
  };

  // Map compensation type to display format
  const getCompensationDisplay = (type: CompensationType): string => {
    const map: Record<CompensationType, string> = {
      paid: "Paid",
      equity: "Equity",
      academic_credit: "For Credit",
      volunteer: "Volunteer",
    };
    return map[type];
  };

  // Map category to display format
  const getCategoryDisplay = (category: ProjectCategory): string => {
    const map: Record<ProjectCategory, string> = {
      software: "Software",
      research: "Research",
      product: "Product",
      design: "Design",
      marketing: "Marketing",
      hardware: "Hardware",
      data_science: "Data Science",
    };
    return map[category];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading projects...</p>
        </div>
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
                          <FormLabel>Project Title *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-project-title" placeholder="e.g., Build a React App" />
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
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              data-testid="textarea-description" 
                              placeholder="Describe your project, what you're looking for, and what makes it exciting..."
                              rows={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="software">Software</SelectItem>
                                <SelectItem value="research">Research</SelectItem>
                                <SelectItem value="product">Product</SelectItem>
                                <SelectItem value="design">Design</SelectItem>
                                <SelectItem value="marketing">Marketing</SelectItem>
                                <SelectItem value="hardware">Hardware</SelectItem>
                                <SelectItem value="data_science">Data Science</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="compensationType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Compensation Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-compensation">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="equity">Equity</SelectItem>
                                <SelectItem value="academic_credit">Academic Credit</SelectItem>
                                <SelectItem value="volunteer">Volunteer</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="requiredSkills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Required Skills * (comma-separated)</FormLabel>
                          <FormControl>
                            <Input
                              value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                              onChange={(e) => {
                                const skills = e.target.value
                                  .split(",")
                                  .map(s => s.trim())
                                  .filter(Boolean);
                                field.onChange(skills);
                              }}
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
                      name="applicationDeadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Application Deadline (optional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              type="datetime-local"
                              value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value ? new Date(value).toISOString() : null);
                              }}
                              data-testid="input-deadline" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      disabled={createProjectMutation.isPending} 
                      data-testid="button-submit-project"
                      className="w-full"
                    >
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
                placeholder="Search projects by title or description..."
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-category-filter">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="hardware">Hardware</SelectItem>
                <SelectItem value="data_science">Data Science</SelectItem>
              </SelectContent>
            </Select>
            <Select value={compensationFilter} onValueChange={setCompensationFilter}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-compensation-filter">
                <SelectValue placeholder="Compensation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="equity">Equity</SelectItem>
                <SelectItem value="academic_credit">Academic Credit</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {projects.length} {projects.length === 1 ? "opportunity" : "opportunities"} available
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery || categoryFilter !== "all" || compensationFilter !== "all"
                ? "No projects found matching your filters."
                : "No projects available yet. Be the first to post one!"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                title={project.title}
                company={project.creator.name}
                description={project.description}
                skills={project.requiredSkills}
                type={project.compensationType === "paid" ? "paid" : project.compensationType === "academic_credit" ? "credit" : "volunteer"}
                timeCommitment=""
                teamSize=""
                deadline={project.applicationDeadline ? new Date(project.applicationDeadline).toLocaleDateString() : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
