import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, Briefcase, Rocket, MessageSquare, Search, Filter, UserCheck } from "lucide-react";

export default function UserGuide() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">User Guide</h1>
          <p className="text-xl text-primary-foreground/90">
            Learn how to make the most of MatchUp Foundry
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <UserCheck className="h-6 w-6 text-primary" />
              <CardTitle>Setting Up Your Profile</CardTitle>
            </div>
            <CardDescription>
              Complete your profile to maximize your visibility and connections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3 text-foreground">
              <li>Click your avatar in the top right corner and select "Profile"</li>
              <li>Add a bio describing your interests, goals, and what you're looking for</li>
              <li>Select your major and year to help others find you</li>
              <li>Add your skills (e.g., Python, React, UI/UX, Machine Learning)</li>
              <li>Set your availability status to let others know you're open to opportunities</li>
            </ol>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Pro Tip:</strong> A complete profile with skills and a detailed bio gets 3x more connection requests!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Search className="h-6 w-6 text-primary" />
              <CardTitle>Finding Project Opportunities</CardTitle>
            </div>
            <CardDescription>
              Discover gigs, internships, and project opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold text-foreground">Using Search</h4>
            <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
              <li>Navigate to "Project Gigs" from the main navigation</li>
              <li>Use the search bar to find projects by title, company, or description</li>
              <li>Filter by project type: Paid, For Credit, or Volunteer</li>
              <li>Click "Apply Now" on projects that interest you</li>
            </ul>

            <h4 className="font-semibold text-foreground mt-6">Project Types</h4>
            <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
              <li><strong>Paid:</strong> Paid internships and freelance work</li>
              <li><strong>For Credit:</strong> Academic credit opportunities and research positions</li>
              <li><strong>Volunteer:</strong> Volunteer projects and community initiatives</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <CardTitle>Finding Teammates</CardTitle>
            </div>
            <CardDescription>
              Connect with students who have complementary skills
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3 text-foreground">
              <li>Go to the "Team Matching" page</li>
              <li>Use the search bar to find students by name, major, or skills</li>
              <li>Filter by major (Computer Science, Engineering, Business, etc.)</li>
              <li>Filter by year (Freshman, Sophomore, Junior, Senior, Graduate)</li>
              <li>Click "View Profile" to see detailed information</li>
              <li>Click "Connect" to reach out and start a conversation</li>
            </ol>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Pro Tip:</strong> Look for students with complementary skills to yours for the best team balance!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Rocket className="h-6 w-6 text-primary" />
              <CardTitle>Exploring Startups</CardTitle>
            </div>
            <CardDescription>
              Discover student startups and early-stage ventures
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-3 text-foreground">
              <li>Visit the "Startup Showcase" page</li>
              <li>Browse startups by category (EdTech, FinTech, HealthTech, etc.)</li>
              <li>Search for startups by name, description, or keywords</li>
              <li>View startup details, team size, and website links</li>
              <li>Click "Learn More" to get in touch with the founding team</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-primary" />
              <CardTitle>Using Messages</CardTitle>
            </div>
            <CardDescription>
              Communicate with connections and potential teammates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold text-foreground">Messaging Basics</h4>
            <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
              <li>Access messages from the main navigation</li>
              <li>Click on a conversation to view the full chat history</li>
              <li>Type your message and press Enter or click Send</li>
              <li>Unread message counts appear next to each conversation</li>
            </ul>

            <h4 className="font-semibold text-foreground mt-6">Best Practices</h4>
            <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
              <li>Introduce yourself and mention why you're reaching out</li>
              <li>Be specific about what you're looking for (teammate, advice, collaboration)</li>
              <li>Respond promptly to messages to build good relationships</li>
              <li>Keep conversations professional and respectful</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Still have questions? Check out our FAQ or contact support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">
              Visit the <a href="/faq" className="text-primary hover:underline font-semibold" data-testid="link-faq">FAQ page</a> for answers to common questions, or reach out to our support team at{" "}
              <a href="mailto:support@matchupfoundry.com" className="text-primary hover:underline" data-testid="link-support-email">
                support@matchupfoundry.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
