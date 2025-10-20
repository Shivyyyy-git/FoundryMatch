import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";

export default function ProjectGigs() {
  const projects = [
    {
      title: "Mobile App Developer",
      company: "HealthTech Startup",
      description: "We're building a mobile app to help students track their mental health and wellness. Looking for a React Native developer to join our founding team.",
      skills: ["React Native", "TypeScript", "Firebase", "UI/UX"],
      timeCommitment: "10-15 hrs/week",
      teamSize: "3-4 members",
      deadline: "Apply by Feb 15",
      type: "credit" as const
    },
    {
      title: "UX/UI Designer Wanted",
      company: "Social Impact Project",
      description: "Design an intuitive interface for a platform connecting volunteers with local nonprofits. Make a real difference in the community.",
      skills: ["Figma", "UI/UX", "User Research", "Prototyping"],
      timeCommitment: "8-10 hrs/week",
      teamSize: "2-3 members",
      type: "volunteer" as const
    },
    {
      title: "Data Analyst Position",
      company: "Environmental Research Lab",
      description: "Analyze climate data and create compelling visualizations for our environmental research project. Work with real-world datasets.",
      skills: ["Python", "Data Viz", "Statistics", "Pandas"],
      timeCommitment: "5-8 hrs/week",
      teamSize: "1-2 members",
      deadline: "Apply by Feb 20",
      type: "paid" as const
    },
    {
      title: "Full Stack Developer",
      company: "EdTech Platform",
      description: "Build features for an online learning platform used by thousands of students. Work with modern tech stack and agile methodology.",
      skills: ["React", "Node.js", "MongoDB", "TypeScript"],
      timeCommitment: "12-15 hrs/week",
      teamSize: "4-5 members",
      type: "paid" as const
    },
    {
      title: "Marketing Specialist",
      company: "Student Startup",
      description: "Help us grow our user base and build our brand. Create content, manage social media, and develop marketing strategies.",
      skills: ["Marketing", "Social Media", "Content Creation", "Analytics"],
      timeCommitment: "6-8 hrs/week",
      teamSize: "2-3 members",
      type: "credit" as const
    },
    {
      title: "Backend Engineer",
      company: "FinTech Project",
      description: "Develop secure and scalable APIs for a financial services platform. Experience with cloud infrastructure is a plus.",
      skills: ["Python", "Django", "PostgreSQL", "AWS"],
      timeCommitment: "10-12 hrs/week",
      teamSize: "3-4 members",
      deadline: "Apply by Feb 18",
      type: "paid" as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Project Gigs
              </h1>
              <p className="text-muted-foreground">
                Discover exciting opportunities and gain real-world experience
              </p>
            </div>
            <Button data-testid="button-post-gig">
              <Plus className="h-4 w-4 mr-2" />
              Post a Gig
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9"
                data-testid="input-search-projects"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-project-type">
                <SelectValue placeholder="Project Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="credit">For Credit</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="research">Research</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {projects.length} opportunities available
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="outline" data-testid="button-load-more">
            Load More Projects
          </Button>
        </div>
      </div>
    </div>
  );
}
