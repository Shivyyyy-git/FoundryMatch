import { StartupCard } from "@/components/StartupCard";
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
import showcaseImage from "@assets/generated_images/Startup_showcase_image_1_6effd381.png";
import teamImage from "@assets/generated_images/Startup_team_photo_cb2f6363.png";

export default function StartupShowcase() {
  const startups = [
    {
      name: "StudyBuddy",
      tagline: "AI-powered study companion for students",
      description: "StudyBuddy uses machine learning to create personalized study plans and connects you with study partners who match your learning style and schedule.",
      category: "EdTech",
      teamSize: 4,
      image: showcaseImage,
      founded: "2024"
    },
    {
      name: "CampusEats",
      tagline: "Food delivery made for students",
      description: "Order from local restaurants with student discounts and share delivery fees with friends heading to the same location on campus.",
      category: "Food & Delivery",
      teamSize: 5,
      image: teamImage,
      founded: "2024"
    },
    {
      name: "GreenCommute",
      tagline: "Sustainable campus transportation",
      description: "Connect with students heading the same way and reduce your carbon footprint while saving money on transportation costs.",
      category: "Sustainability",
      teamSize: 3,
      founded: "2023"
    },
    {
      name: "MentorHub",
      tagline: "Connect students with industry mentors",
      description: "A platform that matches students with professionals in their field of interest for guidance, networking, and career advice.",
      category: "Career Development",
      teamSize: 4,
      founded: "2024"
    },
    {
      name: "EventSync",
      tagline: "Campus event management simplified",
      description: "Discover, organize, and manage campus events all in one place. Perfect for student organizations and clubs.",
      category: "Social",
      teamSize: 6,
      founded: "2023"
    },
    {
      name: "SkillSwap",
      tagline: "Learn by teaching, teach by learning",
      description: "Exchange skills with other students. Teach what you know and learn what you want in a collaborative peer-to-peer environment.",
      category: "EdTech",
      teamSize: 3,
      founded: "2024"
    }
  ];

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
            <Button data-testid="button-submit-startup">
              <Plus className="h-4 w-4 mr-2" />
              Submit Startup
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search startups..."
                className="pl-9"
                data-testid="input-search-startups"
              />
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="edtech">EdTech</SelectItem>
                <SelectItem value="food">Food & Delivery</SelectItem>
                <SelectItem value="sustainability">Sustainability</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="career">Career</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="team-size">Team Size</SelectItem>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup, index) => (
            <StartupCard key={index} {...startup} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="outline" data-testid="button-load-more">
            Load More Startups
          </Button>
        </div>
      </div>
    </div>
  );
}
