import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, X, Building2, GraduationCap, BookOpen, Users } from "lucide-react";
import type { User } from "@shared/schema";

export default function Profile() {
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  const [skillInput, setSkillInput] = useState("");

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
  });

  // Initialize formData state
  const [formData, setFormData] = useState<{
    userType: string;
    organization: string;
    bio: string;
    major: string;
    year: string;
    availability: string;
    skills: string[];
  }>({
    userType: "",
    organization: "",
    bio: "",
    major: "",
    year: "",
    availability: "",
    skills: [],
  });

  // Update form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        userType: user.userType || "",
        organization: user.organization || "",
        bio: user.bio || "",
        major: user.major || "",
        year: user.year || "",
        availability: user.availability || "",
        skills: user.skills || [],
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("PATCH", "/api/users/profile", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty strings to prevent sending invalid data
    const cleanedData: any = {
      userType: formData.userType?.trim() || undefined,
      organization: formData.organization?.trim() || undefined,
      bio: formData.bio || undefined,
      major: formData.major?.trim() || undefined,
      year: formData.year?.trim() || undefined,
      availability: formData.availability?.trim() || undefined,
      skills: formData.skills,
    };
    
    // Remove undefined fields
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === undefined) {
        delete cleanedData[key];
      }
    });
    
    updateProfileMutation.mutate(cleanedData);
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove),
    });
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.profileImageUrl || undefined} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="text-2xl">
                  {initials || <UserIcon className="h-12 w-12" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl">
                  {user.firstName} {user.lastName}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {user.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Tell us who you are section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">Tell us who you are</h3>
                  <p className="text-sm text-muted-foreground">
                    Select the option that best describes you
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Company Card */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: "Company" })}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover-elevate ${
                      formData.userType === "Company"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                    data-testid="card-user-type-company"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        formData.userType === "Company" ? "bg-primary/10" : "bg-muted"
                      }`}>
                        <Building2 className={`h-5 w-5 ${
                          formData.userType === "Company" ? "text-primary" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Company outside Rochester</h4>
                        <p className="text-sm text-muted-foreground">
                          I'm an organization looking to connect with students or researchers.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* University Student Card */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: "University Student" })}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover-elevate ${
                      formData.userType === "University Student"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                    data-testid="card-user-type-university-student"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        formData.userType === "University Student" ? "bg-primary/10" : "bg-muted"
                      }`}>
                        <GraduationCap className={`h-5 w-5 ${
                          formData.userType === "University Student" ? "text-primary" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">University student in Rochester</h4>
                        <p className="text-sm text-muted-foreground">
                          I'm a student looking to join or start a project.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Professor Card */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: "Professor" })}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover-elevate ${
                      formData.userType === "Professor"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                    data-testid="card-user-type-professor"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        formData.userType === "Professor" ? "bg-primary/10" : "bg-muted"
                      }`}>
                        <BookOpen className={`h-5 w-5 ${
                          formData.userType === "Professor" ? "text-primary" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Professor</h4>
                        <p className="text-sm text-muted-foreground">
                          I'm a faculty member interested in mentoring or collaboration.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Student in Rochester Card */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: "Student in Rochester" })}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover-elevate ${
                      formData.userType === "Student in Rochester"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                    data-testid="card-user-type-student-rochester"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        formData.userType === "Student in Rochester" ? "bg-primary/10" : "bg-muted"
                      }`}>
                        <Users className={`h-5 w-5 ${
                          formData.userType === "Student in Rochester" ? "text-primary" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Student in Rochester</h4>
                        <p className="text-sm text-muted-foreground">
                          I'm a student looking for opportunities within Rochester.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Conditional Organization Input for Company */}
                {formData.userType === "Company" && (
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization Name</Label>
                    <Input
                      id="organization"
                      placeholder="Enter your company or organization name"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      data-testid="input-organization"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself, your interests, and what you're looking for..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="min-h-32"
                  data-testid="textarea-bio"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="major">Major</Label>
                  <Select
                    value={formData.major}
                    onValueChange={(value) => setFormData({ ...formData, major: value })}
                  >
                    <SelectTrigger id="major" data-testid="select-major">
                      <SelectValue placeholder="Select your major" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Economics">Economics</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Psychology">Psychology</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => setFormData({ ...formData, year: value })}
                  >
                    <SelectTrigger id="year" data-testid="select-year">
                      <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Freshman">Freshman</SelectItem>
                      <SelectItem value="Sophomore">Sophomore</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value) => setFormData({ ...formData, availability: value })}
                >
                  <SelectTrigger id="availability" data-testid="select-availability">
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available Now</SelectItem>
                    <SelectItem value="Part-time">Part-time Only</SelectItem>
                    <SelectItem value="Looking">Actively Looking</SelectItem>
                    <SelectItem value="Not Available">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <div className="flex gap-2">
                  <Input
                    id="skills"
                    placeholder="Add a skill (e.g., React, Python, UI/UX)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    data-testid="input-skill"
                  />
                  <Button
                    type="button"
                    onClick={addSkill}
                    variant="outline"
                    data-testid="button-add-skill"
                  >
                    Add
                  </Button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="gap-1" data-testid={`badge-skill-${skill}`}>
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover-elevate active-elevate-2 rounded-full p-0.5"
                          data-testid={`button-remove-skill-${skill}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="flex-1"
                  data-testid="button-save-profile"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
