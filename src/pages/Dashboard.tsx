
import React from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Briefcase, FileText } from "lucide-react";

const Dashboard = () => {
  // Mock data for initial render
  const statsData = {
    totalKarigars: 120,
    activeKarigars: 87,
    completedTasks: 254,
    pendingTasks: 43,
    averageRating: 4.8
  };

  const recentKarigars = [
    { id: 1, name: "Ramesh Kumar", skill: "Embroidery", status: "available", rating: 4.9 },
    { id: 2, name: "Suman Devi", skill: "Block Printing", status: "busy", rating: 4.7 },
    { id: 3, name: "Ahmed Khan", skill: "Metalwork", status: "available", rating: 4.8 },
    { id: 4, name: "Lakshmi Patel", skill: "Weaving", status: "unavailable", rating: 4.5 }
  ];

  const recentAssignments = [
    { id: 1, title: "Wedding Sherwani Embroidery", karigar: "Ramesh Kumar", deadline: "2025-05-30", status: "In Progress" },
    { id: 2, title: "Saree Block Printing", karigar: "Suman Devi", deadline: "2025-06-05", status: "Not Started" },
    { id: 3, title: "Decorative Metal Lamp", karigar: "Ahmed Khan", deadline: "2025-05-25", status: "In Progress" },
    { id: 4, title: "Handloom Textile", karigar: "Lakshmi Patel", deadline: "2025-06-10", status: "Not Started" }
  ];

  const getStatusBadgeClass = (status: string) => {
    switch(status.toLowerCase()) {
      case 'available': return 'status-badge status-available';
      case 'busy': return 'status-badge status-busy';
      case 'unavailable': return 'status-badge status-unavailable';
      default: return 'status-badge bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-karigar-800 dark:text-karigar-200">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to your karigar management dashboard.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Card className="stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Karigars</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-karigar-700 dark:text-karigar-300">{statsData.totalKarigars}</span>
                <Users className="h-8 w-8 text-karigar-500" />
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Active</span>
                  <span>{statsData.activeKarigars} ({Math.round(statsData.activeKarigars/statsData.totalKarigars*100)}%)</span>
                </div>
                <Progress value={statsData.activeKarigars/statsData.totalKarigars*100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-karigar-700 dark:text-karigar-300">{statsData.completedTasks + statsData.pendingTasks}</span>
                <Briefcase className="h-8 w-8 text-karigar-500" />
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Completed</span>
                  <span>{statsData.completedTasks} ({Math.round(statsData.completedTasks/(statsData.completedTasks + statsData.pendingTasks)*100)}%)</span>
                </div>
                <Progress value={statsData.completedTasks/(statsData.completedTasks + statsData.pendingTasks)*100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-karigar-700 dark:text-karigar-300">{statsData.averageRating}/5</span>
                <FileText className="h-8 w-8 text-karigar-500" />
              </div>
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star} 
                    className={`h-5 w-5 ${star <= Math.round(statsData.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-karigar-700 dark:text-karigar-300">{statsData.pendingTasks}</span>
                <Briefcase className="h-8 w-8 text-karigar-500" />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {statsData.pendingTasks > 20 ? 
                  <span className="text-amber-600 dark:text-amber-400">High volume of pending tasks</span> : 
                  <span className="text-green-600 dark:text-green-400">Workload is manageable</span>
                }
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="karigars">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
            <TabsTrigger value="karigars">Recent Karigars</TabsTrigger>
            <TabsTrigger value="assignments">Recent Assignments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="karigars" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Recently Active Karigars</CardTitle>
                <CardDescription>View and manage your most recent artisans.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentKarigars.map((karigar) => (
                    <div key={karigar.id} className="karigar-item flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-karigar-800 dark:text-karigar-200">{karigar.name}</div>
                        <div className="text-sm text-muted-foreground">{karigar.skill}</div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className={getStatusBadgeClass(karigar.status)}>
                          {karigar.status.charAt(0).toUpperCase() + karigar.status.slice(1)}
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="mr-1">{karigar.rating}</span>
                          <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  Showing 4 of {statsData.totalKarigars} karigars
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="assignments" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Recent Assignments</CardTitle>
                <CardDescription>Track and manage ongoing work assignments.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAssignments.map((assignment) => (
                    <div key={assignment.id} className="karigar-item flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-karigar-800 dark:text-karigar-200">{assignment.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Assigned to: <span className="font-medium">{assignment.karigar}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className={assignment.status === "In Progress" ? "status-badge status-busy" : "status-badge bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"}>
                          {assignment.status}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Due: {new Date(assignment.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  Showing 4 of {statsData.completedTasks + statsData.pendingTasks} assignments
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default Dashboard;
