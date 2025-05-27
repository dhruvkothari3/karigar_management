
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Karigar } from "@/services/karigarService";
import { useToast } from "@/hooks/use-toast";

// Define the task and material types
interface Task {
  id: string;
  name: string;
  completed: boolean;
}

interface Material {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

const assignmentFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  client: z.string().min(2, { message: "Client name is required." }),
  karigarId: z.string({ required_error: "Please select a karigar." }),
  startDate: z.date({ required_error: "Start date is required." }),
  deadline: z.date({ required_error: "Deadline is required." }),
  priority: z.enum(["low", "medium", "high"], { required_error: "Priority is required." }),
  payment: z.string().min(1, { message: "Payment amount is required." })
})
.refine(data => data.deadline >= data.startDate, {
  message: "Deadline must be after the start date",
  path: ["deadline"],
});

type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;

// Mock karigars data for the select dropdown - updated for diamond jewelry focus
const mockKarigars: Karigar[] = [
  {
    id: "1",
    name: "Ramesh Kumar",
    skill: "Diamond Setting",
    experience: "10 years",
    location: "Delhi",
    status: "available",
    contactNumber: "+91 98765 43210",
    rating: 4.8,
    assignments: 36,
  },
  {
    id: "2",
    name: "Suman Devi",
    skill: "Gold Casting",
    experience: "8 years",
    location: "Jaipur",
    status: "busy",
    contactNumber: "+91 98765 43211",
    rating: 4.5,
    assignments: 42,
  },
  {
    id: "3",
    name: "Ahmed Khan",
    skill: "Polishing",
    experience: "15 years",
    location: "Mumbai",
    status: "available",
    contactNumber: "+91 98765 43212",
    rating: 4.9,
    assignments: 51,
  },
  {
    id: "4",
    name: "Lakshmi Patel",
    skill: "Stone Sorting",
    experience: "7 years",
    location: "Surat",
    status: "unavailable",
    contactNumber: "+91 98765 43213",
    rating: 4.3,
    assignments: 28,
  },
  {
    id: "5",
    name: "Rajesh Sharma",
    skill: "Jewelry Design",
    experience: "12 years",
    location: "Mumbai",
    status: "available",
    contactNumber: "+91 98765 43214",
    rating: 4.7,
    assignments: 63,
  },
];

interface CreateAssignmentFormProps {
  onSuccess?: () => void;
}

export function CreateAssignmentForm({ onSuccess }: CreateAssignmentFormProps) {
  const { toast } = useToast();
  
  // State for tasks and materials
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', name: '', completed: false }
  ]);
  
  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', name: '', quantity: '', unit: 'grams' }
  ]);
  
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: "",
      description: "",
      client: "",
      priority: "medium",
      payment: "",
    },
  });

  // Add a new task
  const addTask = () => {
    const newId = (tasks.length + 1).toString();
    setTasks([...tasks, { id: newId, name: '', completed: false }]);
  };
  
  // Remove a task
  const removeTask = (id: string) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };
  
  // Update a task
  const updateTask = (id: string, name: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, name } : task
    ));
  };
  
  // Add a new material
  const addMaterial = () => {
    const newId = (materials.length + 1).toString();
    setMaterials([...materials, { id: newId, name: '', quantity: '', unit: 'grams' }]);
  };
  
  // Remove a material
  const removeMaterial = (id: string) => {
    if (materials.length > 1) {
      setMaterials(materials.filter(material => material.id !== id));
    }
  };
  
  // Update a material
  const updateMaterial = (id: string, field: 'name' | 'quantity' | 'unit', value: string) => {
    setMaterials(materials.map(material => 
      material.id === id ? { ...material, [field]: value } : material
    ));
  };

  function onSubmit(data: AssignmentFormValues) {
    console.log("Form submitted:", data);
    // Filter out empty tasks and materials
    const filteredTasks = tasks.filter(task => task.name.trim() !== '');
    const filteredMaterials = materials.filter(material => material.name.trim() !== '' && material.quantity.trim() !== '');
    
    // Add the karigar name from the selected ID for display purposes
    const selectedKarigar = mockKarigars.find(k => k.id === data.karigarId);
    
    // Complete form data with tasks and materials
    const completeData = {
      ...data,
      tasks: filteredTasks,
      materials: filteredMaterials
    };
    
    console.log("Complete form data:", completeData);
    
    toast({
      title: "Assignment Created",
      description: `New assignment "${data.title}" has been created for ${selectedKarigar?.name}.`,
    });

    // Reset the form
    form.reset();
    setTasks([{ id: '1', name: '', completed: false }]);
    setMaterials([{ id: '1', name: '', quantity: '', unit: 'grams' }]);
    
    // Call the success callback if provided
    if (onSuccess) {
      onSuccess();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Assignment title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Client */}
          <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <FormControl>
                  <Input placeholder="Client name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed description of the assignment"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Karigar Selection */}
          <FormField
            control={form.control}
            name="karigarId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign to Karigar</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a karigar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockKarigars.map((karigar) => (
                      <SelectItem key={karigar.id} value={karigar.id}>
                        {karigar.name} - {karigar.skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Priority */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Start Date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Deadline */}
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Deadline</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment */}
          <FormField
            control={form.control}
            name="payment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment (₹)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 15,000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Tasks Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Tasks</h3>
            <Button 
              type="button" 
              onClick={addTask} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </div>
          
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div key={task.id} className="flex items-center gap-2">
                <Input 
                  placeholder="Task name" 
                  value={task.name} 
                  onChange={(e) => updateTask(task.id, e.target.value)}
                  className="flex-grow"
                />
                <Button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  variant="ghost"
                  size="sm"
                  disabled={tasks.length === 1}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Materials Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Materials</h3>
            <Button 
              type="button" 
              onClick={addMaterial} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Material
            </Button>
          </div>
          
          <div className="space-y-3">
            {materials.map((material) => (
              <div key={material.id} className="grid grid-cols-1 md:grid-cols-10 gap-2 items-center">
                <div className="md:col-span-4">
                  <Input 
                    placeholder="Material name" 
                    value={material.name} 
                    onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input 
                    placeholder="Quantity" 
                    value={material.quantity} 
                    onChange={(e) => updateMaterial(material.id, 'quantity', e.target.value)}
                  />
                </div>
                <div className="md:col-span-3">
                  <Select
                    value={material.unit}
                    onValueChange={(value) => updateMaterial(material.id, 'unit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grams">Grams</SelectItem>
                      <SelectItem value="carats">Carats</SelectItem>
                      <SelectItem value="pieces">Pieces</SelectItem>
                      <SelectItem value="inches">Inches</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => removeMaterial(material.id)}
                    variant="ghost"
                    size="sm"
                    disabled={materials.length === 1}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Cancel
          </Button>
          <Button type="submit">Create Assignment</Button>
        </div>
      </form>
    </Form>
  );
}
