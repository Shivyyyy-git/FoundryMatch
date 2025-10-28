import { StudentCard } from "@/components/StudentCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export default function TeamMatching() {
  const [showFilters, setShowFilters] = useState(false);

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const students = users.filter(u => u.major || u.bio || (u.skills && u.skills.length > 0));

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
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {students.length} students
              </p>
            </div>

            {students.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No students found. Complete your profile to appear here!</p>
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

            <div className="mt-8 flex justify-center">
              <Button variant="outline" data-testid="button-load-more">
                Load More
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
