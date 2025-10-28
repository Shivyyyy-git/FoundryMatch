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

export function FilterSidebar() {
  const skills = ["React", "Python", "UI/UX", "Machine Learning", "Mobile Dev"];
  const majors = ["Computer Science", "Engineering", "Business", "Design"];
  const years = ["Freshman", "Sophomore", "Junior", "Senior"];

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
              data-testid="input-filter-search"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">
            Skills
          </Label>
          <div className="space-y-2">
            {skills.map((skill) => (
              <div key={skill} className="flex items-center gap-2">
                <Checkbox id={`skill-${skill}`} data-testid={`checkbox-skill-${skill.toLowerCase()}`} />
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
          <Select>
            <SelectTrigger id="major-select" data-testid="select-major">
              <SelectValue placeholder="Select major" />
            </SelectTrigger>
            <SelectContent>
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
          <Select>
            <SelectTrigger id="year-select" data-testid="select-year">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-3 block">
            Availability
          </Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="available" data-testid="checkbox-available" />
              <label
                htmlFor="available"
                className="text-sm text-foreground cursor-pointer"
              >
                Available for projects
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="open-to-teams" data-testid="checkbox-open-to-teams" />
              <label
                htmlFor="open-to-teams"
                className="text-sm text-foreground cursor-pointer"
              >
                Open to join teams
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" size="sm" className="flex-1" data-testid="button-clear-filters">
            Clear
          </Button>
          <Button size="sm" className="flex-1" data-testid="button-apply-filters">
            Apply
          </Button>
        </div>
      </div>
    </Card>
  );
}
