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
import { Search, Filter } from "lucide-react";

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

interface FilterSidebarProps {
  filters: {
    search: string;
    skills: string[];
    major: string;
    year: string;
    availability: string;
  };
  onFiltersChange: (filters: any) => void;
  allStudents: StudentWithProfile[];
}

export function FilterSidebar({ filters, onFiltersChange, allStudents }: FilterSidebarProps) {
  const allSkills = Array.from(new Set(allStudents.flatMap(s => s.skills || []))).sort();
  const majors = Array.from(new Set(allStudents.map(s => s.major).filter(Boolean))).sort();
  const years = ["Freshman", "Sophomore", "Junior", "Senior"];

  const handleSkillToggle = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    onFiltersChange({ ...filters, skills: newSkills });
  };

  const handleClear = () => {
    onFiltersChange({
      search: "",
      skills: [],
      major: "",
      year: "",
      availability: ""
    });
  };

  return (
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
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              data-testid="input-filter-search"
            />
          </div>
        </div>

        {allSkills.length > 0 && (
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Skills
            </Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {allSkills.slice(0, 10).map((skill) => (
                <div key={skill} className="flex items-center gap-2">
                  <Checkbox 
                    id={`skill-${skill}`}
                    checked={filters.skills.includes(skill)}
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
        )}

        <div>
          <Label htmlFor="major-select" className="text-sm font-medium mb-2 block">
            Major
          </Label>
          <Select value={filters.major} onValueChange={(value) => onFiltersChange({ ...filters, major: value })}>
            <SelectTrigger id="major-select" data-testid="select-major">
              <SelectValue placeholder="Select major" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Majors</SelectItem>
              {majors.map((major) => (
                <SelectItem key={major} value={major!}>
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
          <Select value={filters.year} onValueChange={(value) => onFiltersChange({ ...filters, year: value })}>
            <SelectTrigger id="year-select" data-testid="select-year">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="availability-select" className="text-sm font-medium mb-2 block">
            Availability
          </Label>
          <Select value={filters.availability} onValueChange={(value) => onFiltersChange({ ...filters, availability: value })}>
            <SelectTrigger id="availability-select" data-testid="select-availability">
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="Available for projects">Available for projects</SelectItem>
              <SelectItem value="Not available">Not available</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleClear}
            data-testid="button-clear-filters"
          >
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}
