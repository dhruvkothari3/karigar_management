import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2, Upload, FileImage, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { getClients, type Client } from "@/services/clientService";

// Define form schema with zod
const formSchema = z.object({
  orderNumber: z.string().min(3, {
    message: "Order number must be at least 3 characters.",
  }),
  customerId: z.string().min(1, {
    message: "Please select a client.",
  }),
  customerName: z.string().min(2, {
    message: "Customer name is required.",
  }),
  customerPhone: z.string().min(10, {
    message: "Valid phone number is required.",
  }),
  orderDate: z.date({
    required_error: "Order date is required.",
  }),
  jewelryType: z.string().min(2, {
    message: "Jewelry type is required.",
  }),
  metal: z.string().min(2, {
    message: "Metal type is required.",
  }),
  purity: z.string().min(1, {
    message: "Purity is required.",
  }),
  size: z.string().min(1, {
    message: "Size is required.",
  }),
  gemName: z.string().optional(),
  gemstoneWeight: z.coerce.number().min(0).optional(),
  diamondColor: z.string().optional(),
  diamondClarity: z.string().optional(),
  diamondWeight: z.coerce.number().min(0).optional(),
  numberOfStones: z.coerce.number().min(0).optional(),
  diamondAndStoneWeight: z.coerce.number().min(0, {
    message: "Weight must be positive.",
  }).max(1000, {
    message: "Weight cannot exceed 1000 grams.",
  }),
  grossWeight: z.coerce.number().min(0, {
    message: "Weight must be positive.",
  }).max(1000, {
    message: "Weight cannot exceed 1000 grams.",
  }),
  netWeight: z.coerce.number().min(0, {
    message: "Weight must be positive.",
  }).max(1000, {
    message: "Weight cannot exceed 1000 grams.",
  }),
  goldWeight18kt: z.coerce.number().min(0, {
    message: "Weight must be positive.",
  }).max(1000, {
    message: "Weight cannot exceed 1000 grams.",
  }),
  makingCharges: z.coerce.number().min(0, {
    message: "Making charges must be positive.",
  }),
  expectedDeliveryDate: z.date({
    required_error: "Expected delivery date is required.",
  }),
  actualDeliveryDate: z.date().optional(),
  deliveryStatus: z.string(),
  orderGivenBy: z.string().min(2, {
    message: "Order given by is required.",
  }),
  orderDescription: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  // New fields for range
  rangeMin: z.coerce.number().min(0).optional(),
  rangeMax: z.coerce.number().min(0).optional(),
});

type MaterialItem = {
  id: string;
  name: string;
  weight: string;
  unit: string;
  quantity?: string;
  description?: string;
};

type StageItem = {
  id: string;
  name: string;
  estimatedDays: string;
  isComplete: boolean;
};

type UploadedFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
};

const defaultStages = [
  { id: "stage-1", name: "Design Creation", estimatedDays: "3", isComplete: false },
  { id: "stage-2", name: "Wax Model", estimatedDays: "2", isComplete: false },
  { id: "stage-3", name: "Casting", estimatedDays: "2", isComplete: false },
  { id: "stage-4", name: "Setting", estimatedDays: "3", isComplete: false },
  { id: "stage-5", name: "Polishing", estimatedDays: "1", isComplete: false },
  { id: "stage-6", name: "Quality Check", estimatedDays: "1", isComplete: false }
];

interface CreateOrderFormProps {
  onOrderCreated?: (orderData: any) => void;
}

export function CreateOrderForm({ onOrderCreated }: CreateOrderFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [materialItems, setMaterialItems] = useState<MaterialItem[]>([]);
  const [materialName, setMaterialName] = useState("");
  const [materialWeight, setMaterialWeight] = useState("");
  const [materialUnit, setMaterialUnit] = useState("grams");
  const [materialQuantity, setMaterialQuantity] = useState("");
  const [materialDescription, setMaterialDescription] = useState("");

  const [stages, setStages] = useState<StageItem[]>(defaultStages);
  const [stageName, setStageName] = useState("");
  const [stageEstimatedDays, setStageEstimatedDays] = useState("");

  // New state for file uploads
  const [cadFiles, setCadFiles] = useState<UploadedFile[]>([]);
  const [imageFiles, setImageFiles] = useState<UploadedFile[]>([]);

  // Load clients on component mount
  useEffect(() => {
    const loadClients = async () => {
      try {
        const clientsData = await getClients();
        setClients(clientsData);
      } catch (error) {
        console.error("Failed to load clients:", error);
        toast({
          title: "Error",
          description: "Failed to load clients",
          variant: "destructive"
        });
      }
    };
    loadClients();
  }, []);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderNumber: "",
      customerId: "",
      customerName: "",
      customerPhone: "",
      jewelryType: "",
      metal: "",
      purity: "18kt",
      size: "",
      gemName: "",
      diamondColor: "",
      diamondClarity: "",
      deliveryStatus: "pending",
      orderGivenBy: "",
      orderDescription: "",
      diamondAndStoneWeight: 0,
      grossWeight: 0,
      netWeight: 0,
      goldWeight18kt: 0,
      makingCharges: 0,
      rangeMin: 0,
      rangeMax: 0,
    },
  });

  // Handle client selection
  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      form.setValue("customerId", client.id);
      form.setValue("customerName", client.name);
      form.setValue("customerPhone", client.phone);
    }
  };

  // File upload handlers
  const handleCADUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.includes('application') || file.name.endsWith('.dwg') || file.name.endsWith('.step') || file.name.endsWith('.iges')) {
          const newFile: UploadedFile = {
            id: `cad-${Date.now()}-${Math.random()}`,
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file)
          };
          setCadFiles(prev => [...prev, newFile]);
        } else {
          toast({
            title: "Invalid file type",
            description: "Please upload CAD files (.dwg, .step, .iges, etc.)",
            variant: "destructive"
          });
        }
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const newFile: UploadedFile = {
            id: `img-${Date.now()}-${Math.random()}`,
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file)
          };
          setImageFiles(prev => [...prev, newFile]);
        } else {
          toast({
            title: "Invalid file type",
            description: "Please upload image files only",
            variant: "destructive"
          });
        }
      });
    }
  };

  const removeCADFile = (id: string) => {
    setCadFiles(prev => prev.filter(file => file.id !== id));
  };

  const removeImageFile = (id: string) => {
    setImageFiles(prev => prev.filter(file => file.id !== id));
  };

  // Add material function
  const addMaterial = () => {
    if (materialName.trim() && materialWeight.trim() && materialUnit.trim()) {
      setMaterialItems([
        ...materialItems,
        {
          id: `material-${Date.now()}`,
          name: materialName,
          weight: materialWeight,
          unit: materialUnit,
          quantity: materialQuantity,
          description: materialDescription,
        },
      ]);
      setMaterialName("");
      setMaterialWeight("");
      setMaterialUnit("grams");
      setMaterialQuantity("");
      setMaterialDescription("");
    }
  };

  // Remove material function
  const removeMaterial = (id: string) => {
    setMaterialItems(materialItems.filter((material) => material.id !== id));
  };

  // Add custom stage function
  const addStage = () => {
    if (stageName.trim() && stageEstimatedDays.trim()) {
      setStages([
        ...stages,
        {
          id: `stage-${Date.now()}`,
          name: stageName,
          estimatedDays: stageEstimatedDays,
          isComplete: false,
        },
      ]);
      setStageName("");
      setStageEstimatedDays("");
    }
  };

  // Remove stage function
  const removeStage = (id: string) => {
    setStages(stages.filter((stage) => stage.id !== id));
  };

  // Form submission - Updated to call the callback
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Combine form data with materials, stages, and files
    const orderData = {
      ...data,
      materials: materialItems,
      stages: stages,
      cadFiles: cadFiles,
      imageFiles: imageFiles,
      createdAt: new Date(),
      status: "pending",
    };
    
    console.log("Order Data:", orderData);
    
    toast({
      title: "Order Created!",
      description: `Order ${data.orderNumber} has been created successfully.`,
    });

    // Call the callback function to update the parent component
    if (onOrderCreated) {
      onOrderCreated(orderData);
    }
    
    // Reset form after submission
    form.reset();
    setSelectedClient(null);
    setMaterialItems([]);
    setStages(defaultStages);
    setCadFiles([]);
    setImageFiles([]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-karigar-800 dark:text-karigar-200">Create New Order</CardTitle>
        <CardDescription>Enter detailed jewelry order information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-karigar-700 dark:text-karigar-300">Basic Order Information</h3>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="orderNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Number</FormLabel>
                      <FormControl>
                        <Input placeholder="ORD001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Client</FormLabel>
                      <Select onValueChange={handleClientSelect} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                              <div>
                                <div className="font-medium">{client.name}</div>
                                <div className="text-sm text-muted-foreground">{client.phone}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose from existing clients or their details will be auto-filled
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Phone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter phone number" 
                          {...field} 
                          disabled={!!selectedClient}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter customer name" 
                          {...field} 
                          disabled={!!selectedClient}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="orderDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Order Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick order date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="orderGivenBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Given By</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter person/company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-karigar-700 dark:text-karigar-300">Jewelry Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="jewelryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jewelry Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Ring, Necklace, Earrings" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="metal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select metal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                          <SelectItem value="platinum">Platinum</SelectItem>
                          <SelectItem value="white-gold">White Gold</SelectItem>
                          <SelectItem value="rose-gold">Rose Gold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="purity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select purity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="18kt">18kt</SelectItem>
                          <SelectItem value="22kt">22kt</SelectItem>
                          <SelectItem value="24kt">24kt</SelectItem>
                          <SelectItem value="14kt">14kt</SelectItem>
                          <SelectItem value="925">925 Silver</SelectItem>
                          <SelectItem value="950">950 Platinum</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter size (e.g., 7, M, 16 inches)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-karigar-700 dark:text-karigar-300">Gemstone & Diamond Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gemName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gem Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Ruby, Sapphire, Emerald" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gemstoneWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gemstone Weight (ct)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" max="100" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="diamondColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diamond Color</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="D">D (Colorless)</SelectItem>
                          <SelectItem value="E">E (Colorless)</SelectItem>
                          <SelectItem value="F">F (Colorless)</SelectItem>
                          <SelectItem value="G">G (Near Colorless)</SelectItem>
                          <SelectItem value="H">H (Near Colorless)</SelectItem>
                          <SelectItem value="I">I (Near Colorless)</SelectItem>
                          <SelectItem value="J">J (Near Colorless)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="diamondClarity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diamond Clarity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select clarity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="FL">FL (Flawless)</SelectItem>
                          <SelectItem value="IF">IF (Internally Flawless)</SelectItem>
                          <SelectItem value="VVS1">VVS1 (Very Very Slightly Included)</SelectItem>
                          <SelectItem value="VVS2">VVS2 (Very Very Slightly Included)</SelectItem>
                          <SelectItem value="VS1">VS1 (Very Slightly Included)</SelectItem>
                          <SelectItem value="VS2">VS2 (Very Slightly Included)</SelectItem>
                          <SelectItem value="SI1">SI1 (Slightly Included)</SelectItem>
                          <SelectItem value="SI2">SI2 (Slightly Included)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="diamondWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diamond Weight (ct)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" max="10" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="numberOfStones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Stones</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="1000" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-karigar-700 dark:text-karigar-300">Weight Details (grams)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="diamondAndStoneWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diamond & Stone Weight (grams)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" min="0" max="1000" placeholder="0.000" {...field} />
                      </FormControl>
                      <FormDescription>Range: 0-1000 grams</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="grossWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gross Weight (grams)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" min="0" max="1000" placeholder="0.000" {...field} />
                      </FormControl>
                      <FormDescription>Range: 0-1000 grams</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="netWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Net Weight (grams)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" min="0" max="1000" placeholder="0.000" {...field} />
                      </FormControl>
                      <FormDescription>Range: 0-1000 grams</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="goldWeight18kt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gold Weight (18kt) (grams)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" min="0" max="1000" placeholder="0.000" {...field} />
                      </FormControl>
                      <FormDescription>Range: 0-1000 grams</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* New Range Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-karigar-700 dark:text-karigar-300">Range Values</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rangeMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Range Minimum</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" min="0" placeholder="0.000" {...field} />
                      </FormControl>
                      <FormDescription>Minimum range value</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rangeMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Range Maximum</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.001" min="0" placeholder="0.000" {...field} />
                      </FormControl>
                      <FormDescription>Maximum range value</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-karigar-700 dark:text-karigar-300">Pricing & Delivery</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="makingCharges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Making Charges (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deliveryStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="ready">Ready for Delivery</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="delayed">Delayed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expectedDeliveryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expected Delivery Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick expected date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="actualDeliveryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Actual Delivery Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick actual date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />
            
            {/* File Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-karigar-700 dark:text-karigar-300">File Uploads</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CAD Files Upload */}
                <div className="space-y-3">
                  <FormLabel>CAD Files</FormLabel>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <File className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="cad-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                          Upload CAD files
                        </span>
                        <span className="text-xs text-gray-500">
                          .dwg, .step, .iges files accepted
                        </span>
                      </label>
                      <input
                        id="cad-upload"
                        type="file"
                        multiple
                        accept=".dwg,.step,.iges,.stp,.igs"
                        onChange={handleCADUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                  
                  {cadFiles.length > 0 && (
                    <div className="space-y-2">
                      {cadFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex items-center space-x-2">
                            <File className="h-4 w-4" />
                            <span className="text-sm truncate">{file.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCADFile(file.id)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Files Upload */}
                <div className="space-y-3">
                  <FormLabel>Images</FormLabel>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                          Upload images
                        </span>
                        <span className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                  
                  {imageFiles.length > 0 && (
                    <div className="space-y-2">
                      {imageFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex items-center space-x-2">
                            <img 
                              src={file.url} 
                              alt={file.name}
                              className="h-8 w-8 object-cover rounded"
                            />
                            <span className="text-sm truncate">{file.name}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImageFile(file.id)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="orderDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter detailed order description" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-karigar-700 dark:text-karigar-300">Additional Materials</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <FormLabel htmlFor="materialName">Material Name</FormLabel>
                  <Input
                    id="materialName"
                    placeholder="e.g., Chain, Findings"
                    value={materialName}
                    onChange={(e) => setMaterialName(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <FormLabel htmlFor="materialWeight">Weight</FormLabel>
                    <Input
                      id="materialWeight"
                      placeholder="Weight"
                      value={materialWeight}
                      onChange={(e) => setMaterialWeight(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <FormLabel htmlFor="materialUnit">Unit</FormLabel>
                    <Select value={materialUnit} onValueChange={setMaterialUnit}>
                      <SelectTrigger id="materialUnit">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grams">Grams</SelectItem>
                        <SelectItem value="carats">Carats</SelectItem>
                        <SelectItem value="pieces">Pieces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <FormLabel htmlFor="materialQuantity">Quantity (Optional)</FormLabel>
                  <Input
                    id="materialQuantity"
                    placeholder="Quantity"
                    value={materialQuantity}
                    onChange={(e) => setMaterialQuantity(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <FormLabel htmlFor="materialDescription">Description (Optional)</FormLabel>
                <Input
                  id="materialDescription"
                  placeholder="Additional details about material"
                  value={materialDescription}
                  onChange={(e) => setMaterialDescription(e.target.value)}
                />
              </div>
              
              <Button 
                type="button" 
                onClick={addMaterial} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Material
              </Button>
              
              <div className="space-y-2 mt-2">
                {materialItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No additional materials added</p>
                ) : (
                  <div className="border rounded-md divide-y">
                    {materialItems.map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-3 bg-background">
                        <div>
                          <div className="font-medium">{material.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {material.weight} {material.unit}
                            {material.quantity && ` × ${material.quantity}`}
                            {material.description && ` - ${material.description}`}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeMaterial(material.id)}
                          className="h-8 w-8 p-0 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-karigar-700 dark:text-karigar-300">Production Stages</h3>
              <p className="text-sm text-muted-foreground">Predefined stages are already added. You can add additional stages if needed.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel htmlFor="stageName">Stage Name</FormLabel>
                  <Input
                    id="stageName"
                    placeholder="e.g., Stone Setting"
                    value={stageName}
                    onChange={(e) => setStageName(e.target.value)}
                  />
                </div>
                
                <div>
                  <FormLabel htmlFor="stageEstimatedDays">Estimated Days</FormLabel>
                  <Input
                    id="stageEstimatedDays"
                    type="number"
                    min="1"
                    placeholder="Estimated days to complete"
                    value={stageEstimatedDays}
                    onChange={(e) => setStageEstimatedDays(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                type="button" 
                onClick={addStage} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Stage
              </Button>
              
              <div className="space-y-2 mt-2">
                {stages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No stages added yet</p>
                ) : (
                  <div className="border rounded-md divide-y">
                    {stages.map((stage) => (
                      <div key={stage.id} className="flex items-center justify-between p-3 bg-background">
                        <div>
                          <div className="font-medium">{stage.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Estimated: {stage.estimatedDays} days
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeStage(stage.id)}
                          className="h-8 w-8 p-0 text-destructive"
                          disabled={stage.id.startsWith("stage-") && parseInt(stage.id.split("-")[1]) <= 6}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                className="bg-karigar-500 hover:bg-karigar-600 text-white"
                size="lg"
              >
                Create Order
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
