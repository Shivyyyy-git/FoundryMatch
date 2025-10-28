import { StudentCard } from "@/components/StudentCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface StudentWithProfile {
  id: number;
  userId: string;
  name: string;
  email: string | null;
  major: string | null;
  year: string | null;
  skills: string[] | null;
  interests: string[] | null;
  bio: string | null;
  lookingForTeam: boolean | null;
  portfolioUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  avatarUrl: string | null;
  availability: string;
}

export default function TeamMatching() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    skills: [] as string[],
    major: "",
    year: "",
    availability: ""
  });

  const { data: students, isLoading } = useQuery<StudentWithProfile[]>({
    queryKey: ['/api/students'],
  });

  const filteredStudents = students?.filter((student) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const nameMatch = student.name.toLowerCase().includes(searchLower);
      const bioMatch = student.bio ? student.bio.toLowerCase().includes(searchLower) : false;
      if (!nameMatch && !bioMatch) {
        return false;
      }
    }
    if (filters.major && student.major !== filters.major) {
      return false;
    }
    if (filters.year && student.year !== filters.year) {
      return false;
    }
    if (filters.availability && student.availability !== filters.availability) {
      return false;
    }
    if (filters.skills.length > 0) {
      const studentSkills = student.skills || [];
      const hasAllSkills = filters.skills.every((skill) => 
        studentSkills.some((s: string) => s.toLowerCase() === skill.toLowerCase())
      );
      if (!hasAllSkills) {
        return false;
      }
    }
    return true;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading students...</p>
      </div>
    );
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
              <FilterSidebar 
                filters={filters}
                onFiltersChange={setFilters}
                allStudents={students || []}
              />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredStudents.length} students
              </p>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No students found matching your filters.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <StudentCard 
                    key={student.id}
                    id={student.id}
                    name={student.name}
                    major={student.major || ""}
                    year={student.year || ""}
                    bio={student.bio || ""}
                    skills={student.skills || []}
                    avatar={student.avatarUrl || undefined}
                    availability={student.availability || ""}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
