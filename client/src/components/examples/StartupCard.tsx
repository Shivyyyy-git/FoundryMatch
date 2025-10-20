import { StartupCard } from "../StartupCard";
import showcaseImage from "@assets/generated_images/Startup_showcase_image_1_6effd381.png";

export default function StartupCardExample() {
  return (
    <div className="p-8 max-w-md">
      <StartupCard
        name="StudyBuddy"
        tagline="AI-powered study companion for students"
        description="StudyBuddy uses machine learning to create personalized study plans and connects you with study partners who match your learning style and schedule."
        category="EdTech"
        teamSize={4}
        image={showcaseImage}
        founded="2024"
      />
    </div>
  );
}
