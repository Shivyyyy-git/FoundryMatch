import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, Rocket, MessageSquare, TrendingUp, Network } from "lucide-react";
import heroImage from "@assets/generated_images/University_collaboration_hero_image_6cf03e81.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-gradient-to-br from-primary/20 via-background to-accent/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Welcome to Foundry StartupMatch
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Connect with talented students, discover exciting projects, and build the next big thing at the University of Rochester
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="min-h-12 px-8 text-lg bg-white text-primary hover-elevate active-elevate-2 border border-white"
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-login"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="min-h-12 px-8 text-lg text-white border-white/80 bg-black/20 backdrop-blur-sm hover-elevate active-elevate-2"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Everything You Need to Build Your Startup
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive platform designed specifically for University of Rochester students to collaborate, innovate, and launch successful ventures
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="hover-elevate">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Team Matching</h3>
              <p className="text-muted-foreground">
                Find co-founders and teammates with complementary skills. Filter by major, interests, and experience level.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Project Gigs</h3>
              <p className="text-muted-foreground">
                Discover exciting projects looking for contributors. Post your own projects and find talented students to help.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Startup Showcase</h3>
              <p className="text-muted-foreground">
                Browse student startups and vote for your favorites. Get inspired by what your peers are building.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Direct Messaging</h3>
              <p className="text-muted-foreground">
                Connect directly with other students. Build relationships and collaborate on ideas.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Network className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">UR Network</h3>
              <p className="text-muted-foreground">
                Access a network of entrepreneurial students all from the University of Rochester.
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Grow Together</h3>
              <p className="text-muted-foreground">
                Learn from peers, share resources, and grow your startup with community support.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center py-16 space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the Foundry StartupMatch community today and take your startup journey to the next level
          </p>
          <Button
            size="lg"
            className="min-h-12 px-8 text-lg"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-cta-login"
          >
            Sign In with Replit
          </Button>
        </div>
      </div>
    </div>
  );
}
