import { StudentCard } from "@/components/StudentCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface PaginatedResponse {
  data: User[];
  total: number;
  hasMore: boolean;
}

export default function TeamMatching() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [majorFilter, setMajorFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const { toast } = useToast();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PaginatedResponse>({
    queryKey: ["/api/users", searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams({
        limit: "20",
        offset: String(pageParam),
      });
      if (searchQuery) {
        params.set("q", searchQuery);
      }
      const res = await fetch(
        `/api/users?${params.toString()}`,
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

  const allUsers = data?.pages.flatMap(page => page.data) ?? [];
  
  // Apply client-side filters
  const students = allUsers
    .filter(u => u.major || u.bio || (u.skills && u.skills.length > 0))
    .filter(student => {
      if (majorFilter !== "all" && student.major !== majorFilter) {
        return false;
      }
      if (yearFilter !== "all" && student.year !== yearFilter) {
        return false;
      }
      return true;
    });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Team Matching
              </h1>
              <p className="text-muted-foreground">
                Find talented students to collaborate with on your next project
              </p>
            </div>
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="button-toggle-filters"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="mb-4">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search students by name, major, or skills..."
              />
            </div>
            
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <Select value={majorFilter} onValueChange={setMajorFilter}>
                <SelectTrigger className="w-full sm:w-64" data-testid="select-major-filter">
                  <SelectValue placeholder="Filter by Major" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Majors</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-full sm:w-64" data-testid="select-year-filter">
                  <SelectValue placeholder="Filter by Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="Freshman">Freshman</SelectItem>
                  <SelectItem value="Sophomore">Sophomore</SelectItem>
                  <SelectItem value="Junior">Junior</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Graduate">Graduate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {students.length} students
              </p>
            </div>

            {students.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No students found{searchQuery ? " for your search" : ". Complete your profile to appear here"}!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {students.map((student) => (
                  <StudentCard 
                    key={student.id} 
                    name={`${student.firstName} ${student.lastName}`}
                    major={student.major || "Not specified"}
                    year={student.year || "Not specified"}
                    bio={student.bio || "No bio yet"}
                    skills={student.skills || []}
                    avatar={student.profileImageUrl || undefined}
                    availability={student.availability || "Available"}
                  />
                ))}
              </div>
            )}

            {hasNextPage && (
              <div className="mt-8 flex justify-center">
                <Button 
                  variant="outline" 
                  data-testid="button-load-more"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
