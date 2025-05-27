
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarIcon, Clock } from "lucide-react";

export interface OrderCardProps {
  id: string;
  orderNumber: string;
  clientName: string;
  itemType: string;
  status: string;
  dueDate: string;
  priority: string;
}

interface OrderListProps {
  orders: OrderCardProps[];
}

export function OrderList({ orders }: OrderListProps) {
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch(priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-6 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No active orders found.</p>
        </div>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="overflow-hidden border">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium">{order.orderNumber}</h3>
                  <p className="text-sm text-muted-foreground">{order.clientName}</p>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Badge variant="outline" className={getPriorityColor(order.priority)}>
                    {order.priority}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm">
                  <span className="font-medium">Item: </span> {order.itemType}
                </p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>Due: {new Date(order.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 p-3 flex gap-2 justify-end border-t">
              <Button size="sm" variant="outline">View Details</Button>
              <Button size="sm">Update Status</Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
