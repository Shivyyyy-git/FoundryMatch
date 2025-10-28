import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, UserCheck, Search, Users, Rocket, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export default function GettingStarted() {
  const steps = [
    {
      number: 1,
      title: "Complete Your Profile",
      icon: UserCheck,
      description: "Add your bio, major, year, skills, and availability to help others find you",
      action: "Go to Profile",
      link: "/profile",
    },
    {
      number: 2,
      title: "Explore Opportunities",
      icon: Search,
      description: "Browse project gigs, startups, and find opportunities that match your interests",
      action: "View Projects",
      link: "/project-gigs",
    },
    {
      number: 3,
      title: "Find Teammates",
      icon: Users,
      description: "Connect with students who have complementary skills and shared goals",
      action: "Browse Students",
      link: "/team-matching",
    },
    {
      number: 4,
      title: "Discover Startups",
      icon: Rocket,
      description: "Explore student ventures and early-stage startups looking for team members",
      action: "View Startups",
      link: "/startup-showcase",
    },
    {
      number: 5,
      title: "Start Connecting",
      icon: MessageSquare,
      description: "Reach out to people, apply to projects, and build your network",
      action: "Check Messages",
      link: "/messages",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-primary/80 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-primary-foreground mb-4">
            Welcome to MatchUp Foundry
          </h1>
          <p className="text-2xl text-primary-foreground/90 mb-8">
            Your journey to finding projects, teammates, and opportunities starts here
          </p>
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <Check className="h-5 w-5 text-primary-foreground" />
            <span className="text-primary-foreground font-medium">5 simple steps to get started</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.number} className="hover-elevate transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">{step.number}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-6 w-6 text-primary" />
                        <CardTitle className="text-2xl">{step.title}</CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        {step.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href={step.link} data-testid={`link-${step.action.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Button className="w-full sm:w-auto" data-testid={`button-${step.action.toLowerCase().replace(/\s+/g, '-')}`}>
                      {step.action}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Tips for Success</CardTitle>
            <CardDescription>
              Make the most of MatchUp Foundry with these pro tips
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Complete Your Profile Early</p>
                <p className="text-sm text-muted-foreground">
                  Profiles with bio, skills, and availability get 3x more connection requests
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Be Specific in Your Outreach</p>
                <p className="text-sm text-muted-foreground">
                  Mention why you're reaching out and what you're looking for when connecting with others
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Use Search and Filters</p>
                <p className="text-sm text-muted-foreground">
                  Save time by using search bars and filters to find exactly what you're looking for
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Check Messages Regularly</p>
                <p className="text-sm text-muted-foreground">
                  Respond promptly to connection requests and messages to build strong relationships
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Post Your Own Opportunities</p>
                <p className="text-sm text-muted-foreground">
                  Have a project or startup? Share it with the community to find collaborators
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Need More Help?</CardTitle>
              <CardDescription>Check out our comprehensive resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/user-guide" data-testid="link-user-guide">
                <Button variant="outline" className="w-full justify-start" data-testid="button-user-guide">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Read the User Guide
                </Button>
              </Link>
              <Link href="/faq" data-testid="link-faq-2">
                <Button variant="outline" className="w-full justify-start" data-testid="button-faq">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Browse FAQ
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Support</CardTitle>
              <CardDescription>We're here to help you succeed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">
                Have questions or need assistance? Our support team is ready to help.
              </p>
              <a href="mailto:support@matchupfoundry.com" data-testid="link-contact-support">
                <Button variant="outline" className="w-full" data-testid="button-contact-support">
                  Contact Support
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
