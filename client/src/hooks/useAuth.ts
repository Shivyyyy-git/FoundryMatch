import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { User } from "@shared/schema";
import { apiRequest, clearCsrfToken } from "@/lib/queryClient";

// User context type matching backend response
export type UserContext = {
  id: string;
  email: string;
  userType: User["userType"];
  isAdmin: boolean;
  emailVerified: boolean;
  profileStatus: string;
  profileComplete: boolean;
  profile: {
    userId: string;
    name: string;
    headline?: string | null;
    bio?: string | null;
    skills: string[];
    profileImageKey?: string | null;
    linkedInUrl?: string | null;
    websiteUrl?: string | null;
    graduationYear?: number | null;
    major?: string | null;
    seekingOpportunities: boolean;
    department?: string | null;
    researchAreas?: string[] | null;
    companyName?: string | null;
    industry?: string | null;
    employeeCount?: number | null;
    startupName?: string | null;
    foundingYear?: number | null;
    profileStatus: string;
    approvedBy?: string | null;
    approvedAt?: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Fetch current user
  const { data: user, isLoading, error } = useQuery<UserContext | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const response = await fetch("/api/auth/user", {
        credentials: "include",
      });

      if (response.status === 401) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      return await response.json();
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
      userType?: "student" | "professor" | "company" | "entrepreneur";
    }) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return await response.json();
    },
    onSuccess: () => {
      // Clear CSRF token to get a fresh one
      clearCsrfToken();
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      const userData = await response.json();
      // Invalidate user query to refetch
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      return userData;
    },
    onSuccess: () => {
      // Redirect to home after successful login
      setLocation("/home");
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/logout");
      return await response.json();
    },
    onSuccess: () => {
      clearCsrfToken();
      queryClient.setQueryData(["/api/auth/user"], null);
      setLocation("/");
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
        credentials: "include",
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Verification failed");
      }

      const userData = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      return userData;
    },
    onSuccess: () => {
      setLocation("/home");
    },
  });

  return {
    user: user || undefined,
    isLoading,
    isAuthenticated: !!user,
    error,
    // Auth actions
    register: registerMutation.mutateAsync,
    registerLoading: registerMutation.isPending,
    registerError: registerMutation.error,
    login: loginMutation.mutateAsync,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutateAsync,
    logoutLoading: logoutMutation.isPending,
    verifyEmail: verifyEmailMutation.mutateAsync,
    verifyEmailLoading: verifyEmailMutation.isPending,
    verifyEmailError: verifyEmailMutation.error,
  };
}
