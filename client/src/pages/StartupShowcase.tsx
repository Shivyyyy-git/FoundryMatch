import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StartupCard } from "@/components/StartupCard";
import { SubmitStartupDialog } from "@/components/SubmitStartupDialog";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { Startup } from "@shared/schema";

export default function StartupShowcase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: startups = [], isLoading } = useQuery<Startup[]>({
    queryKey: ["/api/startups"],
  });

  const filteredStartups = startups
    .filter((startup) => {
      const matchesSearch = 
        startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startup.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        startup.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        categoryFilter === "all" || 
        startup.category.toLowerCase() === categoryFilter.toLowerCase();
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
        case "oldest":
          return new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime();
        case "upvotes":
          return (b.upvotes || 0) - (a.upvotes || 0);
        case "team-size":
          return (b.teamSize || 0) - (a.teamSize || 0);
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading startups...</p>
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
                Startup Showcase
              </h1>
              <p className="text-muted-foreground">
                Discover innovative startups built by Rochester students
              </p>
            </div>
            <SubmitStartupDialog />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search startups..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-startups"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="edtech">EdTech</SelectItem>
                <SelectItem value="fintech">FinTech</SelectItem>
                <SelectItem value="healthtech">HealthTech</SelectItem>
                <SelectItem value="food & delivery">Food & Delivery</SelectItem>
                <SelectItem value="sustainability">Sustainability</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="career development">Career Development</SelectItem>
                <SelectItem value="e-commerce">E-commerce</SelectItem>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="upvotes">Most Upvoted</SelectItem>
                <SelectItem value="team-size">Team Size</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredStartups.length} {filteredStartups.length === 1 ? 'startup' : 'startups'} in the showcase
          </p>
        </div>

        {filteredStartups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No startups found matching your criteria.
            </p>
            {searchQuery || categoryFilter !== "all" ? (
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            ) : (
              <SubmitStartupDialog />
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <StartupCard
                key={startup.id}
                id={startup.id}
                name={startup.name}
                tagline={startup.tagline}
                description={startup.description}
                category={startup.category}
                teamSize={startup.teamSize || undefined}
                founded={startup.founded || undefined}
                image={startup.imageUrl || undefined}
                websiteUrl={startup.websiteUrl || undefined}
                upvotes={startup.upvotes || 0}
                stage={startup.stage}
                seeking={startup.seeking || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
