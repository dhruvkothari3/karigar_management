
import React, { useState } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus } from "lucide-react";
import { JobCardList } from "@/components/karigar/JobCardList";
import { CreateAssignmentForm } from "@/components/karigar/CreateAssignmentForm";
import type { JobCardProps } from "@/components/karigar/JobCard";

const Assignments = () => {
  // Mock data for assignments as job cards
  const jobs: JobCardProps[] = [
    { 
      id: "1", 
      title: "Diamond Wedding Set", 
      description: "Bridal necklace and earrings with princess cut diamonds",
      client: "Sharma Family",
      karigarName: "Ramesh Kumar",
      startDate: "2025-05-15",
      deadline: "2025-05-30", 
      status: "in-progress",
      priority: "high",
      progress: 35,
      payment: "₹125,000",
      tasks: [
        { id: "t1", name: "Design finalization", completed: true },
        { id: "t2", name: "Diamond selection", completed: true },
        { id: "t3", name: "Gold framework", completed: true },
        { id: "t4", name: "Diamond setting", completed: false },
        { id: "t5", name: "Final polishing", completed: false }
      ],
      materials: [
        { id: "m1", name: "18Kt White Gold", quantity: "50", unit: "grams" },
        { id: "m2", name: "Diamonds", quantity: "32", unit: "carats" },
        { id: "m3", name: "Small brilliants", quantity: "1.5", unit: "carats" },
        { id: "m4", name: "Safety clasp", quantity: "1", unit: "piece" }
      ]
    },
    { 
      id: "2", 
      title: "Custom Solitaire Ring", 
      description: "2-carat diamond engagement ring with pavé setting",
      client: "Malhotra Family",
      karigarName: "Suman Devi", 
      startDate: "2025-05-20",
      deadline: "2025-06-05", 
      status: "not-started",
      priority: "medium",
      progress: 0,
      payment: "₹280,000",
      tasks: [
        { id: "t1", name: "Metal casting", completed: false },
        { id: "t2", name: "Main diamond setting", completed: false },
        { id: "t3", name: "Pavé settings", completed: false },
        { id: "t4", name: "Polishing", completed: false },
        { id: "t5", name: "Quality check", completed: false }
      ],
      materials: [
        { id: "m1", name: "Platinum", quantity: "8", unit: "grams" },
        { id: "m2", name: "Diamond solitaire", quantity: "1", unit: "piece" },
        { id: "m3", name: "Small diamonds", quantity: "0.5", unit: "carats" }
      ]
    },
    { 
      id: "3", 
      title: "Diamond Tennis Bracelet", 
      description: "35 diamonds in line setting with secure clasp",
      client: "Heritage Jewels",
      karigarName: "Ahmed Khan", 
      startDate: "2025-05-12",
      deadline: "2025-05-25", 
      status: "in-progress",
      priority: "medium",
      progress: 60,
      payment: "₹185,000",
      tasks: [
        { id: "t1", name: "Link preparation", completed: true },
        { id: "t2", name: "Diamond sorting", completed: true },
        { id: "t3", name: "Channel setting", completed: true },
        { id: "t4", name: "Clasp mechanism", completed: false },
        { id: "t5", name: "Final polish", completed: false }
      ],
      materials: [
        { id: "m1", name: "18Kt White Gold", quantity: "25", unit: "grams" },
        { id: "m2", name: "Diamonds", quantity: "35", unit: "pieces" },
        { id: "m3", name: "Safety clasp", quantity: "1", unit: "piece" },
        { id: "m4", name: "Rhodium plating", quantity: "1", unit: "service" }
      ]
    },
    { 
      id: "4", 
      title: "Diamond Statement Earrings", 
      description: "Chandelier earrings with diamonds and emerald accents",
      client: "Celebrity Stylist",
      karigarName: "Lakshmi Patel", 
      startDate: "2025-05-25",
      deadline: "2025-06-10", 
      status: "not-started",
      priority: "low",
      progress: 0,
      payment: "₹215,000",
      tasks: [
        { id: "t1", name: "Design approval", completed: false },
        { id: "t2", name: "Metal framework", completed: false },
        { id: "t3", name: "Stone sorting", completed: false },
        { id: "t4", name: "Setting work", completed: false },
        { id: "t5", name: "Ear post assembly", completed: false }
      ],
      materials: [
        { id: "m1", name: "18Kt Yellow Gold", quantity: "15", unit: "grams" },
        { id: "m2", name: "Diamonds", quantity: "3.2", unit: "carats" },
        { id: "m3", name: "Emeralds", quantity: "2.5", unit: "carats" },
        { id: "m4", name: "Lever backs", quantity: "2", unit: "pieces" }
      ]
    },
    { 
      id: "5", 
      title: "Diamond Mangalsutra", 
      description: "Traditional mangalsutra with modern diamond pendant",
      client: "Kapoor Residence",
      karigarName: "Rajesh Sharma", 
      startDate: "2025-04-30",
      deadline: "2025-05-20", 
      status: "completed",
      priority: "high",
      progress: 100,
      payment: "₹95,000",
      tasks: [
        { id: "t1", name: "Chain selection", completed: true },
        { id: "t2", name: "Pendant casting", completed: true },
        { id: "t3", name: "Diamond setting", completed: true },
        { id: "t4", name: "Black beading", completed: true },
        { id: "t5", name: "Final assembly", completed: true },
        { id: "t6", name: "Quality check", completed: true }
      ],
      materials: [
        { id: "m1", name: "22Kt Gold", quantity: "12", unit: "grams" },
        { id: "m2", name: "Diamonds", quantity: "0.75", unit: "carats" },
        { id: "m3", name: "Black beads", quantity: "45", unit: "pieces" },
        { id: "m4", name: "Gold chain", quantity: "18", unit: "inches" }
      ]
    }
  ];

  // State to store filtered jobs
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filter jobs based on tab selection
  const filterJobs = (status: string) => {
    if (status === "all") {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter(job => job.status === status));
    }
  };

  // Handle successful assignment creation
  const handleAssignmentCreated = () => {
    setDialogOpen(false);
    // In a real app, we would fetch updated assignments here
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-karigar-800 dark:text-karigar-200">Assignments</h1>
            <p className="text-muted-foreground mt-2">Manage all jewelry work assignments for your karigars.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-karigar-500 hover:bg-karigar-600">
                <Plus className="mr-2 h-4 w-4" />
                New Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
                <DialogDescription>
                  Create a new assignment for a karigar. Fill in all the required details below.
                </DialogDescription>
              </DialogHeader>
              <CreateAssignmentForm onSuccess={handleAssignmentCreated} />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" onValueChange={filterJobs}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <TabsList className="mb-0">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="not-started">Not Started</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search assignments..." 
                  className="pl-8 w-full sm:w-[200px]"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <JobCardList jobs={filteredJobs} />
          </TabsContent>
          <TabsContent value="in-progress" className="mt-0">
            <JobCardList jobs={filteredJobs} />
          </TabsContent>
          <TabsContent value="not-started" className="mt-0">
            <JobCardList jobs={filteredJobs} />
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            <JobCardList jobs={filteredJobs} />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default Assignments;
