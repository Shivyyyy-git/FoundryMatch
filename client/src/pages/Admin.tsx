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
import { Users, Briefcase, Rocket, TrendingUp, Search, MoreVertical } from "lucide-react";

export default function Admin() {
  const stats = [
    { label: "Total Users", value: "1,247", change: "+12%", icon: Users, color: "text-primary" },
    { label: "Active Projects", value: "89", change: "+8%", icon: Briefcase, color: "text-chart-2" },
    { label: "Startups", value: "34", change: "+5%", icon: Rocket, color: "text-chart-3" },
    { label: "Matches Made", value: "456", change: "+23%", icon: TrendingUp, color: "text-chart-4" }
  ];

  const recentUsers = [
    { id: 1, name: "Sarah Chen", email: "schen@u.rochester.edu", status: "active", joined: "2024-01-15" },
    { id: 2, name: "Marcus Rodriguez", email: "mrodriguez@u.rochester.edu", status: "active", joined: "2024-01-14" },
    { id: 3, name: "Aisha Johnson", email: "ajohnson@u.rochester.edu", status: "pending", joined: "2024-01-13" },
    { id: 4, name: "David Kim", email: "dkim@u.rochester.edu", status: "active", joined: "2024-01-12" },
    { id: 5, name: "Emily Patterson", email: "epatterson@u.rochester.edu", status: "active", joined: "2024-01-11" }
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
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "default" : "secondary"}
                        className="capitalize"
                        data-testid={`badge-status-${user.status}`}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.joined}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" data-testid={`button-actions-${user.id}`}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-center">
            <Button variant="outline" data-testid="button-view-all-users">
              View All Users
            </Button>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Pending Approvals
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">New Startup Submission</p>
                  <p className="text-sm text-muted-foreground">CampusEats</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" data-testid="button-reject">
                    Reject
                  </Button>
                  <Button size="sm" data-testid="button-approve">
                    Approve
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-foreground">Project Gig Post</p>
                  <p className="text-sm text-muted-foreground">ML Engineer Needed</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" data-testid="button-reject-2">
                    Reject
                  </Button>
                  <Button size="sm" data-testid="button-approve-2">
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" data-testid="button-export-data">
                Export User Data
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-send-announcement">
                Send Platform Announcement
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-view-reports">
                View Activity Reports
              </Button>
              <Button variant="outline" className="w-full justify-start" data-testid="button-manage-categories">
                Manage Categories
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
