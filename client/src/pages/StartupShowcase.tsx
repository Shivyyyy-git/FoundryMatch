import { StartupCard } from "@/components/StartupCard";
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
import { Startup, InsertStartup } from "@shared/schema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertStartupSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface PaginatedResponse {
  data: Startup[];
  total: number;
  hasMore: boolean;
}

export default function StartupShowcase() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedResponse>({
    queryKey: ["/api/startups", "approved", searchQuery],
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
        `/api/startups?${params.toString()}`,
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

  const startups = data?.pages.flatMap(page => page.data) ?? [];

  const createStartupMutation = useMutation({
    mutationFn: async (data: InsertStartup) => {
      const res = await apiRequest("POST", "/api/startups", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/startups"] });
      setIsDialogOpen(false);
      toast({
        title: "Startup submitted!",
        description: "Your startup has been submitted for admin approval.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit startup. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<InsertStartup>({
    resolver: zodResolver(insertStartupSchema),
    defaultValues: {
      name: "",
      tagline: "",
      description: "",
      category: "",
      teamSize: 1,
      founded: "",
      imageUrl: "",
    },
  });

  const onSubmit = (data: InsertStartup) => {
    createStartupMutation.mutate(data);
  };

  const filteredStartups = startups.filter(startup =>
    searchQuery === "" ||
    startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    startup.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                Startup Showcase
              </h1>
              <p className="text-muted-foreground">
                Discover innovative startups built by Rochester students
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-submit-startup">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Startup
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Submit Your Startup</DialogTitle>
                  <DialogDescription>
                    Share your startup with the Rochester community
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Startup Name</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-startup-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tagline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tagline</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="One-line description" data-testid="input-tagline" />
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
                            <Textarea {...field} data-testid="textarea-startup-description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., EdTech, FinTech, HealthTech" data-testid="input-category" />
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
                          <FormLabel>Team Size</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                              data-testid="input-team-size-startup"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="founded"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Founded Year (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="2024" data-testid="input-founded" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL (optional)</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} placeholder="https://..." data-testid="input-image-url" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={createStartupMutation.isPending} data-testid="button-submit-startup-form">
                      {createStartupMutation.isPending ? "Submitting..." : "Submit Startup"}
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
                placeholder="Search startups by name, description, or category..."
              />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="edtech">EdTech</SelectItem>
                <SelectItem value="food">Food & Delivery</SelectItem>
                <SelectItem value="sustainability">Sustainability</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="career">Career</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="team-size">Team Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {startups.length} startups in the showcase
          </p>
        </div>

        {startups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No startups found{searchQuery ? " for your search" : ". Be the first to showcase yours!"}!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup) => (
              <StartupCard 
                key={startup.id} 
                name={startup.name}
                tagline={startup.tagline}
                description={startup.description}
                category={startup.category}
                teamSize={startup.teamSize}
                founded={startup.founded || undefined}
                image={startup.imageUrl || undefined}
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
              {isFetchingNextPage ? "Loading..." : "Load More Startups"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
