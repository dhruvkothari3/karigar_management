
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Package, DollarSign, Clock } from "lucide-react";
import type { Client } from "@/services/clientService";
import { getOrdersByClientId, type OrderData } from "@/services/orderService";

interface ClientOrderHistoryProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'delayed':
      return 'bg-red-100 text-red-800';
    case 'delivered':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const ClientOrderHistory: React.FC<ClientOrderHistoryProps> = ({
  client,
  open,
  onOpenChange
}) => {
  if (!client) return null;

  const orderHistory = getOrdersByClientId(client.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Order History - {client.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Complete order history and transaction details
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orderHistory.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{orderHistory.reduce((sum, order) => sum + parseInt(order.estimatedPrice), 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orderHistory.filter(order => order.status === 'completed' || order.status === 'delivered').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Order Details</h3>
            {orderHistory.map((order) => (
              <Card key={order.id} className="border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold">
                        {order.orderNumber}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.orderDescription}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Item</p>
                        <p className="text-sm font-medium">
                          {order.quantity}× {order.itemType} ({order.goldKarat})
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Order Date</p>
                        <p className="text-sm font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Delivery Date</p>
                        <p className="text-sm font-medium">
                          {new Date(order.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-sm font-medium">₹{parseInt(order.estimatedPrice).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Materials Section */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Materials Used:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {order.materials.map((material) => (
                        <div key={material.id} className="text-sm">
                          <span className="font-medium">{material.name}:</span> {material.weight} {material.unit}
                          {material.quantity && ` (${material.quantity} pieces)`}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Progress:</p>
                    <div className="text-sm">
                      {order.stages.filter(stage => stage.isComplete).length} of {order.stages.length} stages completed
                      {order.deliveredItems > 0 && (
                        <span className="ml-2 text-green-600">
                          ({order.deliveredItems} of {order.quantity} items delivered)
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {orderHistory.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No order history found for this client.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
