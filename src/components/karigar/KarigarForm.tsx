import React from "react";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createKarigar } from "@/services/karigarService";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  skill: z.string().min(1, "Skill is required"),
  experience: z.string().min(1, "Experience is required"),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["available", "busy", "unavailable"]),
  contactNumber: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number"),
});

type FormValues = z.infer<typeof formSchema>;

interface KarigarFormProps {
  onClose: () => void;
}

export function KarigarForm({ onClose }: KarigarFormProps) {
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      skill: "",
      experience: "",
      location: "",
      status: "available",
      contactNumber: "+91 ",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Make sure all required fields are defined (not optional)
      const karigarData = {
        name: data.name,
        skill: data.skill,
        experience: data.experience,
        location: data.location,
        status: data.status,
        contactNumber: data.contactNumber,
        rating: 0,
        assignments: 0
      };
      
      await createKarigar(karigarData);
      
      toast.success("Karigar added successfully");
      queryClient.invalidateQueries({ queryKey: ["karigars"] });
      onClose();
    } catch (error) {
      console.error("Error adding karigar:", error);
      toast.error("Failed to add karigar");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="skill"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Skill</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Diamond Setting">Diamond Setting</SelectItem>
                  <SelectItem value="Gold Work">Gold Work</SelectItem>
                  <SelectItem value="Jewelry Making">Jewelry Making</SelectItem>
                  <SelectItem value="Stone Setting">Stone Setting</SelectItem>
                  <SelectItem value="Casting">Casting</SelectItem>
                  <SelectItem value="Polishing">Polishing</SelectItem>
                  <SelectItem value="Designing">Designing</SelectItem>
                  <SelectItem value="Engraving">Engraving</SelectItem>
                  <SelectItem value="Filigree Work">Filigree Work</SelectItem>
                  <SelectItem value="Quality Control">Quality Control</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 5 years" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="City/Town" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="+91 1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" className="bg-karigar-500 hover:bg-karigar-600">Add Karigar</Button>
        </div>
      </form>
    </Form>
  );
}
