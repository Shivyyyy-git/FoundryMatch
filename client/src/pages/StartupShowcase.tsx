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
import { Plus, Upload } from "lucide-react";
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
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [uploadedImagePath, setUploadedImagePath] = useState<string>("");
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string>("");
  const [customCategory, setCustomCategory] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [fileUploadError, setFileUploadError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Reset form and state when dialog closes
  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      form.reset();
      setUploadedImagePath("");
      setUploadedImagePreview("");
      setCustomCategory("");
      setSelectedFileName("");
      setFileUploadError("");
    }
  };

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

  const allStartups = data?.pages.flatMap(page => page.data) ?? [];
  
  // Apply client-side filters
  const startups = allStartups.filter(startup => {
    if (categoryFilter !== "all" && startup.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const createStartupMutation = useMutation({
    mutationFn: async (data: InsertStartup) => {
      const res = await apiRequest("POST", "/api/startups", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/startups"] });
      toast({
        title: "Startup submitted!",
        description: "Your startup has been submitted for admin approval.",
      });
      handleDialogChange(false);
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
      imagePath: "",
      externalUrl: "",
    },
  });

  const onSubmit = (data: InsertStartup) => {
    // Validate custom category if "Other" is selected
    if (data.category === "Other") {
      if (!customCategory.trim()) {
        form.setError("category", {
          type: "manual",
          message: "Please specify a custom category",
        });
        return;
      }
      // Use custom category value
      const submitData = {
        ...data,
        category: customCategory,
        imagePath: uploadedImagePath || undefined,
      };
      createStartupMutation.mutate(submitData);
    } else {
      // Use selected category
      const submitData = {
        ...data,
        imagePath: uploadedImagePath || undefined,
      };
      createStartupMutation.mutate(submitData);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset errors
    setFileUploadError("");

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setFileUploadError("Please select a PNG or JPG image file.");
      event.target.value = ""; // Reset input so user can retry
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setFileUploadError("File too large, please select a smaller image (max 5MB).");
      event.target.value = ""; // Reset input so user can retry
      return;
    }

    try {
      setIsUploading(true);
      setSelectedFileName(file.name);

      // Get presigned upload URL
      const uploadRes = await fetch("/api/objects/upload", {
        method: "POST",
        credentials: "include",
      });
      const { uploadURL } = await uploadRes.json();

      // Upload file to object storage
      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      // Save image path to backend
      const saveRes = await apiRequest("PUT", "/api/startup-images", {
        imageURL: uploadURL,
      });
      const data = await saveRes.json();

      // Create preview from file
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setUploadedImagePath(data.objectPath);
      
      toast({
        title: "Image uploaded!",
        description: "Your startup logo has been uploaded successfully.",
      });
    } catch (error) {
      // Clear preview and filename on error
      setSelectedFileName("");
      setUploadedImagePreview("");
      setFileUploadError("Failed to upload image. Please try again.");
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      event.target.value = ""; // Always reset input for retry capability
    }
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
            <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
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
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-startup-category">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="EdTech">EdTech</SelectItem>
                              <SelectItem value="FinTech">FinTech</SelectItem>
                              <SelectItem value="HealthTech">HealthTech</SelectItem>
                              <SelectItem value="AI/ML">AI/ML</SelectItem>
                              <SelectItem value="Data & Analytics">Data & Analytics</SelectItem>
                              <SelectItem value="Consumer App">Consumer App</SelectItem>
                              <SelectItem value="B2B SaaS">B2B SaaS</SelectItem>
                              <SelectItem value="Social Impact">Social Impact</SelectItem>
                              <SelectItem value="Sustainability">Sustainability</SelectItem>
                              <SelectItem value="Robotics">Robotics</SelectItem>
                              <SelectItem value="Hardware">Hardware</SelectItem>
                              <SelectItem value="Media & Creator">Media & Creator</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.watch("category") === "Other" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Specify Category</label>
                        <Input 
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="Enter custom category"
                          data-testid="input-custom-category"
                        />
                      </div>
                    )}
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
                      name="externalUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website or LinkedIn URL (optional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              value={field.value || ""} 
                              type="url"
                              placeholder="https://example.com or https://linkedin.com/..." 
                              data-testid="input-external-url" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Startup Image / Logo (optional)</label>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="logo-upload"
                        data-testid="input-file-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        disabled={isUploading}
                        data-testid="button-upload-logo"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploading ? "Uploading..." : "Upload Logo"}
                      </Button>
                      {fileUploadError && (
                        <p className="text-sm text-destructive" data-testid="text-file-error">
                          {fileUploadError}
                        </p>
                      )}
                      {uploadedImagePreview && !fileUploadError && (
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-3">
                            <img 
                              src={uploadedImagePreview} 
                              alt="Preview" 
                              className="h-16 w-16 object-cover rounded border"
                              data-testid="img-upload-preview"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium" data-testid="text-filename">
                                {selectedFileName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Logo uploaded successfully
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="EdTech">EdTech</SelectItem>
                <SelectItem value="FinTech">FinTech</SelectItem>
                <SelectItem value="HealthTech">HealthTech</SelectItem>
                <SelectItem value="AI/ML">AI/ML</SelectItem>
                <SelectItem value="Data & Analytics">Data & Analytics</SelectItem>
                <SelectItem value="Consumer App">Consumer App</SelectItem>
                <SelectItem value="B2B SaaS">B2B SaaS</SelectItem>
                <SelectItem value="Social Impact">Social Impact</SelectItem>
                <SelectItem value="Sustainability">Sustainability</SelectItem>
                <SelectItem value="Robotics">Robotics</SelectItem>
                <SelectItem value="Hardware">Hardware</SelectItem>
                <SelectItem value="Media & Creator">Media & Creator</SelectItem>
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
                image={startup.imagePath || undefined}
                externalUrl={startup.externalUrl || undefined}
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
