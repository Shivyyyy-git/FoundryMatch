import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Users, Briefcase, Rocket, ArrowRight, CheckCircle2, X } from "lucide-react";
import { SiGoogle } from "react-icons/si";

export default function Landing() {
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleGoogleAuth = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Connect, Collaborate, Create
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join the University of Rochester's premier platform for finding teammates, 
            discovering projects, and building the next big thing
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button 
                size="lg"
                data-testid="button-signup"
              >
                Sign Up
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                size="lg"
                variant="outline"
                data-testid="button-login"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're looking for a team, a project, or co-founders, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Team Matching
                </h3>
                <p className="text-muted-foreground">
                  Find teammates who complement your skills and share your passion for building great products
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Project Opportunities
                </h3>
                <p className="text-muted-foreground">
                  Browse paid gigs, volunteer projects, and academic credit opportunities that match your interests
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <Rocket className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Startup Showcase
                </h3>
                <p className="text-muted-foreground">
                  Discover what students are building and connect with founders looking for co-founders
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Rochester Students Choose Us
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  University-Wide Network
                </h3>
                <p className="text-muted-foreground">
                  Connect with students from all schools and programs at the University of Rochester
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Real-World Experience
                </h3>
                <p className="text-muted-foreground">
                  Work on actual projects with tangible outcomes, not just classroom exercises
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Multiple Paths to Success
                </h3>
                <p className="text-muted-foreground">
                  Whether you want to earn money, gain credit, or give back through volunteering
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-8 text-primary-foreground/90">
            Join hundreds of University of Rochester students already building the future
          </p>
          <Link href="/register">
            <Button 
              size="lg" 
              variant="secondary"
              data-testid="button-signup-footer"
            >
              Sign Up
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Signup Modal */}
      <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-signup">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" data-testid="button-close-modal">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Join MatchMeUp Foundry
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Connect with the University of Rochester community
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <Button
              size="lg"
              onClick={handleGoogleAuth}
              className="w-full gap-3"
              data-testid="button-google-signup"
            >
              <SiGoogle className="h-5 w-5" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Quick & Secure
                </span>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Sign up securely with your Google account.
              </p>
              <p className="mt-2">
                No passwords to remember. Quick and easy.
              </p>
            </div>
          </div>

          <div className="text-xs text-center text-muted-foreground border-t pt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
