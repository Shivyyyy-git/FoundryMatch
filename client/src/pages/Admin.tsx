import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Briefcase, Rocket, TrendingUp, Search } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Project, Startup, User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Admin() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: allProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects", { credentials: "include" });
      return res.json();
    },
  });

  const { data: allStartups = [] } = useQuery<Startup[]>({
    queryKey: ["/api/startups"],
    queryFn: async () => {
      const res = await fetch("/api/startups", { credentials: "include" });
      return res.json();
    },
  });

  const pendingProjects = allProjects.filter(p => !p.isApproved);
  const pendingStartups = allStartups.filter(s => !s.isApproved);
  const approvedProjects = allProjects.filter(p => p.isApproved);

  const approveProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/projects/${id}/approve`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project approved!",
        description: "The project is now visible to all users.",
      });
    },
  });

  const approveStartupMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/startups/${id}/approve`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/startups"] });
      toast({
        title: "Startup approved!",
        description: "The startup is now visible to all users.",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/projects/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project rejected",
        description: "The project has been removed.",
      });
    },
  });

  const deleteStartupMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/startups/${id}`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/startups"] });
      toast({
        title: "Startup rejected",
        description: "The startup has been removed.",
      });
    },
  });

  const filteredUsers = users.filter(user =>
    searchQuery === "" ||
    user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Users", value: users.length.toString(), change: "+12%", icon: Users, color: "text-primary" },
    { label: "Active Projects", value: approvedProjects.length.toString(), change: "+8%", icon: Briefcase, color: "text-chart-2" },
    { label: "Startups", value: allStartups.filter(s => s.isApproved).length.toString(), change: "+5%", icon: Rocket, color: "text-chart-3" },
    { label: "Pending Approvals", value: (pendingProjects.length + pendingStartups.length).toString(), change: "+23%", icon: TrendingUp, color: "text-chart-4" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Manage users, projects, and monitor platform activity
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-muted-foreground">
                {stat.label}
              </p>
            </Card>
          ))}
        </div>

        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Recent Users
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-users"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-32" data-testid="select-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Major</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.slice(0, 10).map((user) => (
                  <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell className="text-muted-foreground">{user.major || "Not set"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-center">
            <Button variant="outline" data-testid="button-view-all-users">
              View All Users ({users.length})
            </Button>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Pending Approvals
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pendingProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{project.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{project.company}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteProjectMutation.mutate(project.id)}
                      disabled={deleteProjectMutation.isPending}
                      data-testid={`button-reject-project-${project.id}`}
                    >
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => approveProjectMutation.mutate(project.id)}
                      disabled={approveProjectMutation.isPending}
                      data-testid={`button-approve-project-${project.id}`}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
              {pendingStartups.map((startup) => (
                <div key={startup.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{startup.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{startup.category}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => deleteStartupMutation.mutate(startup.id)}
                      disabled={deleteStartupMutation.isPending}
                      data-testid={`button-reject-startup-${startup.id}`}
                    >
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => approveStartupMutation.mutate(startup.id)}
                      disabled={approveStartupMutation.isPending}
                      data-testid={`button-approve-startup-${startup.id}`}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
              {pendingProjects.length === 0 && pendingStartups.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No pending approvals
                </p>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Quick Stats
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-foreground">Total Projects</span>
                <span className="text-lg font-bold text-foreground">{allProjects.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-foreground">Approved Projects</span>
                <span className="text-lg font-bold text-chart-2">{approvedProjects.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-foreground">Total Startups</span>
                <span className="text-lg font-bold text-foreground">{allStartups.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-foreground">Approved Startups</span>
                <span className="text-lg font-bold text-chart-3">{allStartups.filter(s => s.isApproved).length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
