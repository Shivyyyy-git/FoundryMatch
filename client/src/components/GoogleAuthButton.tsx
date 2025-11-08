import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

export function GoogleAuthButton({ action = "signin" }: { action?: "signin" | "signup" }) {
  const handleGoogleAuth = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = "/api/auth/google";
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleAuth}
    >
      <Chrome className="mr-2 h-4 w-4" />
      {action === "signin" ? "Sign in with Google" : "Sign up with Google"}
    </Button>
  );
}

