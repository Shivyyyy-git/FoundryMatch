import { ProjectCard } from "../ProjectCard";

export default function ProjectCardExample() {
  return (
    <div className="p-8 max-w-md">
      <ProjectCard
        title="Mobile App Developer Needed"
        company="HealthTech Startup"
        description="We're building a mobile app to help students track their mental health and wellness. Looking for a React Native developer to join our founding team."
        skills={["React Native", "TypeScript", "Firebase", "UI/UX"]}
        timeCommitment="10-15 hrs/week"
        teamSize="3-4 members"
        deadline="Apply by Feb 15"
        type="credit"
      />
    </div>
  );
}
