import { StudentCard } from "../StudentCard";
import avatar1 from "@assets/generated_images/Student_profile_avatar_1_237efb63.png";

export default function StudentCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <StudentCard
        name="Sarah Chen"
        major="Computer Science"
        year="Junior"
        bio="Passionate about AI/ML and building products that make a difference. Looking for a team to work on healthcare tech."
        skills={["Python", "React", "Machine Learning", "UI/UX", "Data Science"]}
        avatar={avatar1}
        availability="Available for projects"
      />
    </div>
  );
}
