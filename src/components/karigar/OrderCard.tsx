
import React from "react";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Calendar, 
  MessageSquare, 
  Circle, 
  Check,
  ArrowUp,
  ArrowDown,
  CircleDollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

export type OrderStage = {
  id: string;
  name: string;
  estimatedDays: string;
  isComplete: boolean;
};

export type OrderMaterial = {
  id: string;
  name: string;
  weight: string;
  unit: string;
  quantity?: string;
  description?: string;
};

export interface OrderCardProps {
  id: string;
  orderName: string;
  clientName: string;
  clientId?: string; // Add clientId field
  clientPhone: string;
  orderDescription?: string;
  quantity: number;
  itemType: string;
  goldKarat: string;
  deadline: string;
  karigar: {
    id: string;
    name: string;
    skill: string;
  };
  materials: OrderMaterial[];
  stages: OrderStage[];
  createdAt: string;
  status: "pending" | "in-progress" | "completed" | "delivered" | "delayed";
  deliveredItems: number;
  remainingItems: number;
  estimatedPrice: string;
}

export function OrderCard({
  id,
  orderName,
  clientName,
  clientId,
  clientPhone,
  orderDescription,
  quantity,
  itemType,
  goldKarat,
  deadline,
  karigar,
  materials,
  stages,
  createdAt,
  status,
  deliveredItems,
  remainingItems,
  estimatedPrice
}: OrderCardProps) {
  // Calculate progress percentage based on completed stages
  const completedStages = stages.filter(stage => stage.isComplete).length;
  const totalStages = stages.length;
  const progressPercentage = Math.round((completedStages / totalStages) * 100);
  
  // Current stage
  const currentStage = stages.find(stage => !stage.isComplete)?.name || "Completed";

  // Status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case "pending": return "bg-yellow-500 hover:bg-yellow-600";
      case "in-progress": return "bg-blue-500 hover:bg-blue-600";
      case "completed": return "bg-green-500 hover:bg-green-600";
      case "delivered": return "bg-purple-500 hover:bg-purple-600";
      case "delayed": return "bg-red-500 hover:bg-red-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };
  
  // Format deadline for display
  const formattedDeadline = new Date(deadline).toLocaleDateString();
  
  // Status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "pending": return <Circle className="w-4 h-4" />;
      case "in-progress": return <ArrowUp className="w-4 h-4" />;
      case "completed": return <Check className="w-4 h-4" />;
      case "delivered": return <Check className="w-4 h-4" />;
      case "delayed": return <ArrowDown className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold text-karigar-800 dark:text-karigar-200">
              {orderName}
            </CardTitle>
            <CardDescription className="mt-1">
              {quantity}× {itemType} ({goldKarat})
            </CardDescription>
          </div>
          <Badge className={cn("font-medium", getStatusColor(status))}>
            <span className="flex items-center gap-1">
              {getStatusIcon(status)} {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-medium uppercase text-muted-foreground">
                Client
              </h4>
              <p className="text-sm font-medium">{clientName}</p>
              <p className="text-xs text-muted-foreground">{clientPhone}</p>
            </div>
            
            <div>
              <h4 className="text-xs font-medium uppercase text-muted-foreground">
                Karigar
              </h4>
              <p className="text-sm font-medium">{karigar.name}</p>
              <p className="text-xs text-muted-foreground">{karigar.skill}</p>
            </div>
            
            <div>
              <h4 className="text-xs font-medium uppercase text-muted-foreground">
                Materials
              </h4>
              <ul className="text-sm">
                {materials.slice(0, 2).map((material) => (
                  <li key={material.id} className="text-sm">
                    {material.name}: {material.weight} {material.unit}
                    {material.quantity && ` × ${material.quantity}`}
                  </li>
                ))}
                {materials.length > 2 && (
                  <li className="text-xs text-muted-foreground">
                    +{materials.length - 2} more
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="text-sm font-medium">{formattedDeadline}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Estimated Price</p>
                <p className="text-sm font-medium">₹{estimatedPrice}</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Progress ({progressPercentage}%)</span>
                <span>{completedStages}/{totalStages} stages</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs mt-1">Current: <span className="font-medium">{currentStage}</span></p>
            </div>
            
            <div>
              <h4 className="text-xs font-medium uppercase text-muted-foreground">
                Delivery Status
              </h4>
              <p className="text-sm">
                <span className="font-medium text-green-600">{deliveredItems}</span> of {quantity} delivered
                {remainingItems > 0 && (
                  <span className="text-muted-foreground text-xs"> ({remainingItems} remaining)</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-3 border-t">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <FileText className="h-3.5 w-3.5" />
          <span>Order #{id}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8">
            <MessageSquare className="h-3.5 w-3.5 mr-1" /> Send Reminder
          </Button>
          <Button size="sm" className="h-8">View Details</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
