import { Hero } from "@/components/Hero";
import { StartupCard } from "@/components/StartupCard";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Briefcase, Rocket } from "lucide-react";
import { Link, useLocation } from "wouter";
import showcaseImage from "@assets/generated_images/Startup_showcase_image_1_6effd381.png";
import teamImage from "@assets/generated_images/Startup_team_photo_cb2f6363.png";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen">
      <Hero />
      
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to connect with your next team and start building
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Create Your Profile
              </h3>
              <p className="text-muted-foreground">
                Showcase your skills, interests, and what you're looking for in a team or project.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Browse Opportunities
              </h3>
              <p className="text-muted-foreground">
                Discover projects, startups, and teams that match your skills and interests.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Rocket className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Start Building
              </h3>
              <p className="text-muted-foreground">
                Connect with your team and turn your ideas into reality with real-world experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Featured Startups
              </h2>
              <p className="text-muted-foreground">
                Check out what Rochester students are building
              </p>
            </div>
            <Link href="/startup-showcase" data-testid="link-view-all-startups">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StartupCard
              name="StudyBuddy"
              tagline="AI-powered study companion"
              description="StudyBuddy uses machine learning to create personalized study plans and connects you with study partners."
              category="EdTech"
              teamSize={4}
              image={showcaseImage}
            />
            <StartupCard
              name="CampusEats"
              tagline="Food delivery made for students"
              description="Order from local restaurants with student discounts and share delivery fees with friends on campus."
              category="Food & Delivery"
              teamSize={5}
              image={teamImage}
            />
            <StartupCard
              name="GreenCommute"
              tagline="Sustainable campus transportation"
              description="Connect with students heading the same way and reduce your carbon footprint while saving money."
              category="Sustainability"
              teamSize={3}
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Latest Project Gigs
              </h2>
              <p className="text-muted-foreground">
                Join exciting projects and gain real-world experience
              </p>
            </div>
            <Link href="/project-gigs" data-testid="link-view-all-projects">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard
              title="Mobile App Developer"
              company="HealthTech Startup"
              description="Build a React Native app to help students track mental health and wellness."
              skills={["React Native", "TypeScript", "Firebase"]}
              timeCommitment="10-15 hrs/week"
              teamSize="3-4 members"
              type="credit"
            />
            <ProjectCard
              title="UX/UI Designer"
              company="Social Impact Project"
              description="Design an intuitive interface for a platform connecting volunteers with local nonprofits."
              skills={["Figma", "UI/UX", "User Research"]}
              timeCommitment="8-10 hrs/week"
              teamSize="2-3 members"
              type="volunteer"
            />
            <ProjectCard
              title="Data Analyst"
              company="Research Lab"
              description="Analyze climate data and create visualizations for environmental research project."
              skills={["Python", "Data Viz", "Statistics"]}
              timeCommitment="5-8 hrs/week"
              teamSize="1-2 members"
              deadline="Apply by Feb 20"
              type="paid"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg mb-8 text-primary-foreground/90">
            Join hundreds of University of Rochester students building the future
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary"
              data-testid="button-create-profile"
              onClick={() => setLocation("/team-matching")}
            >
              Create Your Profile
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
              data-testid="button-browse-opportunities"
              onClick={() => setLocation("/project-gigs")}
            >
              Browse Opportunities
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
