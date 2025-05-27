import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Clock, Package, Percent, FileText, SquarePen, Eye, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface Task {
  id: string;
  name: string;
  completed: boolean;
}

interface Material {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
}

export interface JobCardProps {
  id: string;
  title: string;
  description: string;
  client: string;
  startDate: string;
  deadline: string;
  status: "not-started" | "in-progress" | "completed" | "delayed";
  priority: "low" | "medium" | "high";
  progress: number;
  payment: string;
  tasks: Task[];
  materials: Material[];
  karigarName: string;
}

export function JobCard({
  id,
  title,
  description,
  client,
  startDate,
  deadline,
  status,
  priority,
  progress,
  payment,
  tasks,
  materials,
  karigarName,
}: JobCardProps) {
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [progressDialogOpen, setProgressDialogOpen] = useState(false);
  const [updatedProgress, setUpdatedProgress] = useState(progress);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(
    tasks.filter(task => task.completed).map(task => task.id)
  );
  const { toast } = useToast();

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate days remaining until deadline
  const calculateDaysRemaining = () => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

  // Helper function to get status badge color
  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">In Progress</Badge>;
      case "not-started":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Not Started</Badge>;
      case "delayed":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Delayed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper function to get priority badge color
  const getPriorityBadge = () => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">Medium Priority</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Low Priority</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Count completed tasks
  const completedTasksCount = tasks.filter(task => task.completed).length;

  // Handle task toggle in progress update dialog
  const toggleTaskCompletion = (taskId: string) => {
    if (completedTaskIds.includes(taskId)) {
      setCompletedTaskIds(completedTaskIds.filter(id => id !== taskId));
    } else {
      setCompletedTaskIds([...completedTaskIds, taskId]);
    }
  };

  // Calculate progress based on completed tasks
  const calculateTaskProgress = () => {
    return Math.round((completedTaskIds.length / tasks.length) * 100);
  };

  // Handle progress update submission
  const handleProgressUpdate = () => {
    // In a real app, we would send this to an API
    // For now, we'll just show a toast notification
    toast({
      title: "Progress Updated",
      description: `${title} progress updated to ${updatedProgress}%`,
    });
    setProgressDialogOpen(false);
  };

  return (
    <>
      <Card className="mb-6 overflow-hidden border-l-4 transition-all hover:shadow-md" 
        style={{ 
          borderLeftColor: priority === "high" ? "rgb(239 68 68)" : 
                          priority === "medium" ? "rgb(245 158 11)" : 
                          "rgb(34 197 94)" 
        }}>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">Assigned to: <span className="font-medium text-foreground">{karigarName}</span></p>
            </div>
            <div className="flex flex-wrap gap-2">
              {getStatusBadge()}
              {getPriorityBadge()}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{description}</p>
            <p className="text-sm text-muted-foreground">Client: <span className="font-medium text-foreground">{client}</span></p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Percent className="h-3.5 w-3.5 text-karigar-600" />
                  <span>Work Progress</span>
                </div>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Deadline Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm">
                <Clock className="h-3.5 w-3.5 text-karigar-600" />
                <span className="text-muted-foreground">
                  Deadline: <span className="font-medium text-foreground">{formatDate(deadline)}</span>
                </span>
              </div>
              <Badge className={
                daysRemaining < 0 ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" :
                daysRemaining < 3 ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" :
                "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              }>
                {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : 
                 daysRemaining === 0 ? "Due today" : 
                 `${daysRemaining} days left`}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Tasks Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-karigar-600" />
                <h4 className="font-medium">Tasks</h4>
              </div>
              <span className="text-xs text-muted-foreground">{completedTasksCount} of {tasks.length} completed</span>
            </div>
            <ul className="space-y-1 text-sm">
              {tasks.slice(0, 3).map((task) => (
                <li key={task.id} className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${task.completed ? "bg-green-500" : "bg-amber-500"}`} />
                  <span className={task.completed ? "line-through text-muted-foreground" : ""}>{task.name}</span>
                </li>
              ))}
              {tasks.length > 3 && (
                <li className="text-xs text-muted-foreground pl-4">
                  + {tasks.length - 3} more tasks
                </li>
              )}
            </ul>
          </div>

          {/* Materials Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Package className="h-4 w-4 text-karigar-600" />
              <h4 className="font-medium">Materials</h4>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
              {materials.slice(0, 4).map((material) => (
                <li key={material.id} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-karigar-500" />
                  <span>{material.name} - {material.quantity} {material.unit || ""}</span>
                </li>
              ))}
              {materials.length > 4 && (
                <li className="text-xs text-muted-foreground pl-4">
                  + {materials.length - 4} more materials
                </li>
              )}
            </ul>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold text-karigar-700 dark:text-karigar-300">
              {payment}
            </div>
            <div className="flex gap-2">
              <span className="text-xs text-muted-foreground">Started: {formatDate(startDate)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-2 pb-3">
          <Button variant="outline" size="sm" onClick={() => setDetailsDialogOpen(true)}>
            <Eye className="mr-1 h-3.5 w-3.5" />
            View Details
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            setUpdatedProgress(progress);
            setProgressDialogOpen(true);
          }}>
            <SquarePen className="mr-1 h-3.5 w-3.5" />
            Update Progress
          </Button>
        </CardFooter>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Complete details for assignment #{id}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Assignment Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned to:</span>
                    <span>{karigarName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client:</span>
                    <span>{client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span>{formatDate(startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline:</span>
                    <span>{formatDate(deadline)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span>{getStatusBadge()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority:</span>
                    <span>{getPriorityBadge()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment:</span>
                    <span className="font-medium">{payment}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm">{description}</p>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Progress</h3>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">Tasks</h3>
              <ul className="space-y-2">
                {tasks.map(task => (
                  <li key={task.id} className="flex gap-2 items-center">
                    <div className={`h-3 w-3 rounded-full ${task.completed ? "bg-green-500" : "bg-amber-500"}`} />
                    <span className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>{task.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Materials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {materials.map(material => (
                  <div key={material.id} className="flex gap-2 items-center">
                    <div className="h-3 w-3 rounded-full bg-karigar-500" />
                    <span className="text-sm">{material.name} - {material.quantity} {material.unit || ""}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Update Progress Dialog */}
      <Dialog open={progressDialogOpen} onOpenChange={setProgressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Progress</DialogTitle>
            <DialogDescription>Update the progress for {title}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="progress" className="text-sm font-medium leading-none pb-1 block">
                  Progress Percentage
                </label>
                <div className="flex items-center gap-4">
                  <Input 
                    id="progress" 
                    type="number" 
                    value={updatedProgress} 
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 100) {
                        setUpdatedProgress(value);
                      }
                    }}
                    className="w-24" 
                    min="0" 
                    max="100"
                  />
                  <span>%</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium leading-none pb-2 block">
                  Update Tasks
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id={`task-${task.id}`}
                        checked={completedTaskIds.includes(task.id)}
                        onChange={() => toggleTaskCompletion(task.id)}
                        className="h-4 w-4 rounded border-gray-300 text-karigar-600 focus:ring-karigar-500"
                      />
                      <label htmlFor={`task-${task.id}`} className="text-sm">
                        {task.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <AlertDialog>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Mark as Completed?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Do you want to mark this assignment as completed? This will set progress to 100% and mark all tasks as done.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                      setUpdatedProgress(100);
                      setCompletedTaskIds(tasks.map(task => task.id));
                      toast({
                        title: "Assignment Completed",
                        description: `${title} has been marked as completed`,
                      });
                    }}>
                      Mark as Completed
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className="mt-2">
              <span className="text-sm text-muted-foreground">
                Task progress: {calculateTaskProgress()}% ({completedTaskIds.length} of {tasks.length} tasks completed)
              </span>
              <Progress value={calculateTaskProgress()} className="h-2 mt-1" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setProgressDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleProgressUpdate} className="bg-karigar-500 hover:bg-karigar-600">
              <CheckCircle className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
