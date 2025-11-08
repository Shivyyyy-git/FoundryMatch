import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export function EmailVerification() {
  const [location, setLocation] = useLocation();
  const { verifyEmail, verifyEmailLoading, verifyEmailError } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Get token from URL query params
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    
    if (tokenParam) {
      setToken(tokenParam);
      handleVerify(tokenParam);
    }
  }, []);

  const handleVerify = async (verifyToken: string) => {
    try {
      await verifyEmail(verifyToken);
      setVerified(true);
    } catch (err) {
      // Error is handled by verifyEmailError
    }
  };

  if (verified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <CheckCircle2 className="h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold">Email Verified!</h2>
        <p className="text-muted-foreground">Your email has been verified successfully.</p>
        <Button onClick={() => setLocation("/")}>Go to Dashboard</Button>
      </div>
    );
  }

  if (verifyEmailError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {verifyEmailError instanceof Error
              ? verifyEmailError.message
              : "Verification failed. The token may be invalid or expired."}
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => setLocation("/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Alert>
          <AlertDescription>
            No verification token found. Please check your email for the verification link.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => setLocation("/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p>Verifying your email...</p>
    </div>
  );
}

