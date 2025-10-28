import { StudentCard } from "@/components/StudentCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import avatar1 from "@assets/generated_images/Student_profile_avatar_1_237efb63.png";
import avatar2 from "@assets/generated_images/Student_profile_avatar_2_a3ed9adb.png";
import avatar3 from "@assets/generated_images/Student_profile_avatar_3_bd597b3b.png";

export default function TeamMatching() {
  const [showFilters, setShowFilters] = useState(false);

  const students = [
    {
      name: "Sarah Chen",
      major: "Computer Science",
      year: "Junior",
      bio: "Passionate about AI/ML and building products that make a difference. Looking for a team to work on healthcare tech.",
      skills: ["Python", "React", "Machine Learning", "UI/UX", "Data Science"],
      avatar: avatar1,
      availability: "Available for projects"
    },
    {
      name: "Marcus Rodriguez",
      major: "Electrical Engineering",
      year: "Senior",
      bio: "Hardware enthusiast with a knack for IoT projects. Experienced in embedded systems and mobile app development.",
      skills: ["C++", "React Native", "IoT", "Embedded Systems", "Flutter"],
      avatar: avatar2,
      availability: "Open to join teams"
    },
    {
      name: "Aisha Johnson",
      major: "Business Administration",
      year: "Sophomore",
      bio: "Business strategy and marketing expert. Love helping startups grow and reach their target audience.",
      skills: ["Marketing", "Strategy", "Analytics", "Fundraising", "Sales"],
      avatar: avatar3,
      availability: "Available for projects"
    },
    {
      name: "David Kim",
      major: "Computer Science",
      year: "Junior",
      bio: "Full-stack developer interested in building scalable web applications. Open to frontend, backend, or DevOps roles.",
      skills: ["Node.js", "React", "PostgreSQL", "AWS", "Docker"],
      availability: "Available for projects"
    },
    {
      name: "Emily Patterson",
      major: "Graphic Design",
      year: "Senior",
      bio: "UI/UX designer with a passion for creating beautiful, user-friendly interfaces. Experience in branding and visual identity.",
      skills: ["Figma", "Adobe XD", "Illustrator", "Branding", "Prototyping"],
      availability: "Open to join teams"
    },
    {
      name: "James Thompson",
      major: "Data Science",
      year: "Sophomore",
      bio: "Data wizard who loves turning complex datasets into actionable insights. Passionate about data visualization.",
      skills: ["Python", "R", "Tableau", "SQL", "Machine Learning"],
      availability: "Available for projects"
    }
  ];

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

            <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {students.map((student) => (
                <StudentCard key={student.name} {...student} />
              ))}
            </div>

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
