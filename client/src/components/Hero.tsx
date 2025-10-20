import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import heroImage from "@assets/generated_images/University_collaboration_hero_image_6cf03e81.png";

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Team. Build Your Future.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Connect with talented University of Rochester students, discover exciting startup opportunities, and turn your ideas into reality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for skills, projects, or people..."
                className="pl-10 h-12 bg-white/95 backdrop-blur-md border-white/40"
                data-testid="input-hero-search"
              />
            </div>
            <Button 
              size="lg" 
              className="h-12 px-8"
              data-testid="button-search"
            >
              Search
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Button 
              variant="outline" 
              size="lg"
              className="backdrop-blur-md bg-white/20 border-white/40 text-white hover:bg-white/30"
              data-testid="button-browse-teams"
            >
              Browse Teams
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="backdrop-blur-md bg-white/20 border-white/40 text-white hover:bg-white/30"
              data-testid="button-post-project"
            >
              Post a Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
