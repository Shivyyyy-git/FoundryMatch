import { NetworkCard } from "@/components/NetworkCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

interface PaginatedResponse {
  data: User[];
  total: number;
  hasMore: boolean;
}

export default function TeamMatching() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [majorFilter, setMajorFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

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
  const filteredUsers = allUsers
    .filter(u => u.major || u.bio || u.headline || (u.skills && u.skills.length > 0))
    .filter(user => {
      if (userTypeFilter !== "all" && user.userType !== userTypeFilter) {
        return false;
      }
      if (majorFilter !== "all" && user.major !== majorFilter) {
        return false;
      }
      if (yearFilter !== "all" && user.year !== yearFilter) {
        return false;
      }
      if (selectedSkills.length > 0) {
        const userSkills = user.skills || [];
        const hasSelectedSkill = selectedSkills.some(skill => 
          userSkills.includes(skill)
        );
        if (!hasSelectedSkill) return false;
      }
      return true;
    });

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setUserTypeFilter("all");
    setMajorFilter("all");
    setYearFilter("all");
    setSelectedSkills([]);
  };

  const availableSkills = ["React", "Python", "UI/UX", "Machine Learning", "Mobile Dev"];
  const majors = ["Computer Science", "Engineering", "Business", "Design", "Data Science"];
  const years = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];

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
                My Network
              </h1>
              <p className="text-muted-foreground">
                Connect with students, companies, and professors at the University of Rochester
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
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="search-filter" className="text-sm font-medium mb-2 block">
                      Search
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search-filter"
                        placeholder="Search by name or keyword..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        data-testid="input-filter-search"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="user-type-select" className="text-sm font-medium mb-2 block">
                      User Type
                    </Label>
                    <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                      <SelectTrigger id="user-type-select" data-testid="select-user-type">
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Company">Company</SelectItem>
                        <SelectItem value="Professor">Professor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Skills
                    </Label>
                    <div className="space-y-2">
                      {availableSkills.map((skill) => (
                        <div key={skill} className="flex items-center gap-2">
                          <Checkbox 
                            id={`skill-${skill}`} 
                            checked={selectedSkills.includes(skill)}
                            onCheckedChange={() => handleSkillToggle(skill)}
                            data-testid={`checkbox-skill-${skill.toLowerCase()}`} 
                          />
                          <label
                            htmlFor={`skill-${skill}`}
                            className="text-sm text-foreground cursor-pointer"
                          >
                            {skill}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="major-select" className="text-sm font-medium mb-2 block">
                      Major
                    </Label>
                    <Select value={majorFilter} onValueChange={setMajorFilter}>
                      <SelectTrigger id="major-select" data-testid="select-major">
                        <SelectValue placeholder="Select major" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Majors</SelectItem>
                        {majors.map((major) => (
                          <SelectItem key={major} value={major}>
                            {major}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="year-select" className="text-sm font-medium mb-2 block">
                      Year
                    </Label>
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger id="year-select" data-testid="select-year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1" 
                      onClick={handleClearFilters}
                      data-testid="button-clear-filters"
                    >
                      Clear
                    </Button>
                    <Button size="sm" className="flex-1" data-testid="button-apply-filters">
                      Apply
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'}
              </p>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No users found{searchQuery ? " for your search" : ". Complete your profile to appear here"}!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsers.map((user) => (
                  <NetworkCard 
                    key={user.id} 
                    name={`${user.firstName} ${user.lastName}`}
                    userType={user.userType || "Student"}
                    organization={user.organization ?? undefined}
                    headline={user.headline || user.bio || ""}
                    skills={user.skills || []}
                    avatar={user.profileImageUrl ?? undefined}
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
