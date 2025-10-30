import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-primary-foreground/90">
            Find answers to common questions about MatchMeUp Foundry
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold" data-testid="faq-what-is">
              What is MatchMeUp Foundry?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              MatchMeUp Foundry is a networking platform designed specifically for the University of Rochester community. 
              It connects students with startup opportunities, project gigs, and team collaboration experiences. Whether 
              you're looking for paid internships, academic credit projects, or talented teammates, MatchMeUp Foundry helps 
              you find the right match.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold" data-testid="faq-who-can-use">
              Who can use MatchMeUp Foundry?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              MatchMeUp Foundry is currently available to all University of Rochester students. You can sign in using your 
              university Google account. Faculty and staff may also join to post project opportunities or mentor student startups.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold" data-testid="faq-free">
              Is MatchMeUp Foundry free to use?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              Yes! MatchMeUp Foundry is completely free for all University of Rochester students. You can create a profile, 
              browse opportunities, connect with teammates, and message other users at no cost.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-semibold" data-testid="faq-profile">
              How do I complete my profile?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              Click your avatar in the top right corner and select "Profile". From there, you can add your bio, major, year, 
              skills, and availability status. A complete profile helps others understand your background and increases your 
              chances of receiving connection requests and project opportunities.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg font-semibold" data-testid="faq-search">
              How do I find projects or teammates?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Projects:</strong> Navigate to "Project Gigs" and use the search bar or filters to find opportunities</li>
                <li><strong>Teammates:</strong> Go to "Team Matching" and search by name, major, or skills</li>
                <li><strong>Startups:</strong> Visit "Startup Showcase" to explore student ventures</li>
              </ul>
              <p className="mt-2">Each page has search and filter capabilities to help you find exactly what you're looking for.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-lg font-semibold" data-testid="faq-apply">
              How do I apply for a project?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              When you find a project you're interested in, click the "Apply Now" button on the project card. This will 
              open a contact form or provide you with the project owner's contact information so you can reach out directly. 
              Make sure your profile is complete before applying to make a good first impression!
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger className="text-lg font-semibold" data-testid="faq-post">
              How do I post a project or startup?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Projects:</strong> Go to "Project Gigs" and click the "+ Post Project" button</li>
                <li><strong>Startups:</strong> Navigate to "Startup Showcase" and click "+ Add Startup"</li>
              </ul>
              <p className="mt-2">
                Fill out the required information and submit. All submissions are reviewed by our admin team to ensure quality 
                and relevance. You'll be notified once your post is approved and live on the platform (typically within 24-48 hours).
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger className="text-lg font-semibold" data-testid="faq-messages">
              How do messages work?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              The Messages feature allows you to communicate directly with other users on the platform. When you connect with 
              someone or receive a connection request, a conversation will appear in your Messages inbox. Click on any 
              conversation to view the history and send new messages. You'll see unread message counts next to each conversation.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9">
            <AccordionTrigger className="text-lg font-semibold" data-testid="faq-approval">
              Why do my posts need approval?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              We review all project and startup submissions to ensure they're relevant to the University of Rochester community 
              and meet our quality standards. This helps maintain a high-quality platform where students can find legitimate 
              opportunities. Most submissions are reviewed within 24-48 hours.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10">
            <AccordionTrigger className="text-lg font-semibold" data-testid="faq-edit">
              Can I edit or delete my posts?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              Currently, you can edit your own profile at any time by visiting the Profile page. For editing or deleting 
              projects and startups, please contact our admin team at support@matchmeupfoundry.com with your request. We're 
              working on adding self-service editing capabilities in a future update!
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-11">
            <AccordionTrigger className="text-lg font-semibold" data-testid="faq-privacy">
              Is my information private?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              Your profile information (name, major, year, bio, skills) is visible to other authenticated University of Rochester 
              students on the platform. Your email address is only visible to you and platform administrators. Messages are private 
              between you and your conversation partners. We never share your data with third parties without your explicit consent.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-12">
            <AccordionTrigger className="text-lg font-semibold" data-testid="faq-contact">
              How do I report inappropriate content or get help?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              If you encounter inappropriate content or need assistance, please contact our support team at{" "}
              <a href="mailto:support@matchmeupfoundry.com" className="text-primary hover:underline" data-testid="link-report-support">
                support@matchmeupfoundry.com
              </a>. We take reports seriously and will review all issues promptly. For urgent matters, include "URGENT" in your 
              email subject line.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="py-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Still have questions?</h2>
            <p className="text-foreground mb-4">
              If you didn't find the answer you were looking for, check out our{" "}
              <a href="/user-guide" className="text-primary hover:underline font-semibold" data-testid="link-user-guide">User Guide</a> or contact our support team.
            </p>
            <p className="text-foreground">
              Email:{" "}
              <a href="mailto:support@matchmeupfoundry.com" className="text-primary hover:underline" data-testid="link-support-email">
                support@matchmeupfoundry.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
