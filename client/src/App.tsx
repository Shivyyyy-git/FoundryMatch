import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navigation } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import VerifyEmail from "@/pages/VerifyEmail";
import Home from "@/pages/Home";
import TeamMatching from "@/pages/TeamMatching";
import ProjectGigs from "@/pages/ProjectGigs";
import StartupShowcase from "@/pages/StartupShowcase";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import UserGuide from "@/pages/UserGuide";
import FAQ from "@/pages/FAQ";
import GettingStarted from "@/pages/GettingStarted";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/verify-email" component={VerifyEmail} />
      
      {/* Protected routes */}
      <Route path="/home">
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Route>
      <Route path="/team-matching">
        <ProtectedRoute>
          <TeamMatching />
        </ProtectedRoute>
      </Route>
      <Route path="/project-gigs">
        <ProtectedRoute>
          <ProjectGigs />
        </ProtectedRoute>
      </Route>
      <Route path="/startup-showcase">
        <ProtectedRoute>
          <StartupShowcase />
        </ProtectedRoute>
      </Route>
      <Route path="/messages">
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>
      <Route path="/user-guide">
        <ProtectedRoute>
          <UserGuide />
        </ProtectedRoute>
      </Route>
      <Route path="/faq">
        <ProtectedRoute>
          <FAQ />
        </ProtectedRoute>
      </Route>
      <Route path="/getting-started">
        <ProtectedRoute>
          <GettingStarted />
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      </Route>
      <Route path="/:rest*" component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
