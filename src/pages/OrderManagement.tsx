import React, { useState } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Filter } from "lucide-react";
import { OrderList, OrderCardProps as OrderListCardProps } from "@/components/karigar/OrderList";
import { CreateOrderForm } from "@/components/karigar/CreateOrderForm";
import GoogleSheetsExport from "@/components/karigar/GoogleSheetsExport";
import type { OrderCardProps } from "@/components/karigar/OrderCard";
import { getOrders, addOrder, type OrderData } from "@/services/orderService";

const OrderManagement = () => {
  // Get orders from the shared service
  const [orders, setOrders] = useState<OrderCardProps[]>(() => {
    const orderData = getOrders();
    return orderData.map(order => ({
      id: order.id,
      orderName: order.orderNumber,
      clientName: order.clientName,
      clientId: order.clientId,
      clientPhone: order.clientPhone,
      orderDescription: order.orderDescription,
      quantity: order.quantity,
      itemType: order.itemType,
      goldKarat: order.goldKarat,
      deadline: order.deadline,
      karigar: order.karigar,
      materials: order.materials,
      stages: order.stages,
      createdAt: order.createdAt,
      status: order.status,
      deliveredItems: order.deliveredItems,
      remainingItems: order.remainingItems,
      estimatedPrice: order.estimatedPrice
    }));
  });
  
  // State to store filtered orders
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Update filtered orders when orders change
  React.useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  // Function to handle new order creation
  const handleOrderCreated = (newOrderData: any) => {
    // Convert form data to OrderData format
    const newOrderServiceData: OrderData = {
      id: newOrderData.orderNumber,
      orderNumber: newOrderData.orderNumber,
      clientId: newOrderData.customerId,
      clientName: newOrderData.customerName,
      clientPhone: newOrderData.customerPhone,
      orderDescription: newOrderData.orderDescription,
      quantity: 1,
      itemType: newOrderData.jewelryType,
      goldKarat: newOrderData.purity,
      deadline: newOrderData.expectedDeliveryDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      karigar: {
        id: "temp",
        name: "Unassigned",
        skill: "TBD"
      },
      materials: newOrderData.materials || [],
      stages: newOrderData.stages || [],
      createdAt: newOrderData.orderDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      status: newOrderData.deliveryStatus || "pending",
      deliveredItems: 0,
      remainingItems: 1,
      estimatedPrice: newOrderData.makingCharges?.toString() || "0"
    };

    // Add to shared service
    addOrder(newOrderServiceData);

    // Convert to OrderCardProps format for local state
    const newOrder: OrderCardProps = {
      id: newOrderServiceData.id,
      orderName: newOrderServiceData.orderNumber,
      clientName: newOrderServiceData.clientName,
      clientId: newOrderServiceData.clientId,
      clientPhone: newOrderServiceData.clientPhone,
      orderDescription: newOrderServiceData.orderDescription,
      quantity: newOrderServiceData.quantity,
      itemType: newOrderServiceData.itemType,
      goldKarat: newOrderServiceData.goldKarat,
      deadline: newOrderServiceData.deadline,
      karigar: newOrderServiceData.karigar,
      materials: newOrderServiceData.materials,
      stages: newOrderServiceData.stages,
      createdAt: newOrderServiceData.createdAt,
      status: newOrderServiceData.status,
      deliveredItems: newOrderServiceData.deliveredItems,
      remainingItems: newOrderServiceData.remainingItems,
      estimatedPrice: newOrderServiceData.estimatedPrice
    };

    // Add the new order to the beginning of the orders list
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    
    // Close the dialog
    setDialogOpen(false);
  };
  
  // Map OrderCardProps to GoogleSheets format
  const mapOrdersToSheetsFormat = (orders: OrderCardProps[]) => {
    return orders.map(order => ({
      id: order.id,
      orderNumber: order.orderName,
      customerName: order.clientName,
      orderDate: order.createdAt,
      jewelryType: order.itemType,
      metal: order.goldKarat === "Platinum" ? "Platinum" : "Gold",
      purity: order.goldKarat,
      size: "N/A", // Not available in current data
      gemName: "Diamond", // Assuming diamond for now
      gemstoneWeight: order.materials.find(m => m.name.includes("Diamond"))?.weight || "0",
      diaColor: "D-E", // Default values
      diaClarity: "VS1-VS2",
      diaWeight: order.materials.find(m => m.name.includes("Diamond"))?.weight || "0",
      numberOfStones: order.materials.find(m => m.name.includes("Diamond"))?.quantity || "0",
      diaStoneWeight: order.materials.find(m => m.name.includes("Gold") || m.name.includes("Platinum"))?.weight || "0",
      grossWeight: order.materials.find(m => m.name.includes("Gold") || m.name.includes("Platinum"))?.weight || "0",
      netWeight: order.materials.find(m => m.name.includes("Gold") || m.name.includes("Platinum"))?.weight || "0",
      goldWeight18kt: order.goldKarat === "18Kt" ? order.materials.find(m => m.name.includes("Gold"))?.weight || "0" : "0",
      makingCharges: "0", // Not available in current data
      expectedDeliveryDate: order.deadline,
      actualDeliveryDate: order.status === "delivered" ? order.deadline : "",
      deliveryStatus: order.status,
      orderGivenBy: "Admin" // Default value
    }));
  };

  // Map OrderCardProps to OrderListCardProps
  const mapOrdersToListFormat = (orders: OrderCardProps[]): OrderListCardProps[] => {
    return orders.map(order => ({
      id: order.id,
      orderNumber: order.orderName,
      clientName: order.clientName,
      itemType: order.itemType,
      status: order.status,
      dueDate: order.deadline,
      priority: getPriorityFromDeadline(order.deadline)
    }));
  };

  // Helper function to determine priority based on deadline
  const getPriorityFromDeadline = (deadline: string): string => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const differenceInDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (differenceInDays < 7) return "High";
    if (differenceInDays < 14) return "Medium";
    return "Low";
  };
  
  // Filter orders based on tab selection
  const filterOrders = (status: string) => {
    if (status === "all") {
      setFilteredOrders(orders);
    } else if (status === "partial") {
      setFilteredOrders(orders.filter(order => order.deliveredItems > 0 && order.deliveredItems < order.quantity));
    } else {
      setFilteredOrders(orders.filter(order => order.status === status));
    }
  };

  // Search by client or order name
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    if (!searchTerm) {
      setFilteredOrders(orders);
      return;
    }
    
    setFilteredOrders(orders.filter(order => 
      order.orderName.toLowerCase().includes(searchTerm) ||
      order.clientName.toLowerCase().includes(searchTerm) ||
      order.id.toLowerCase().includes(searchTerm)
    ));
  };

  return (
    <SidebarLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-karigar-800 dark:text-karigar-200">Order Management</h1>
            <p className="text-muted-foreground mt-2">Create and manage diamond jewelry orders with karigars.</p>
          </div>
          <div className="flex gap-2">
            <GoogleSheetsExport orders={mapOrdersToSheetsFormat(filteredOrders)} />
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-karigar-500 hover:bg-karigar-600">
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Order</DialogTitle>
                </DialogHeader>
                <CreateOrderForm onOrderCreated={handleOrderCreated} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={filterOrders}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <TabsList className="mb-0">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="partial">Partial Delivery</TabsTrigger>
            </TabsList>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search orders..." 
                  className="pl-8 w-full sm:w-[200px]"
                  onChange={handleSearch}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Karigar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Karigars</SelectItem>
                  <SelectItem value="1">Ramesh Kumar</SelectItem>
                  <SelectItem value="2">Suman Devi</SelectItem>
                  <SelectItem value="3">Ahmed Khan</SelectItem>
                  <SelectItem value="4">Lakshmi Patel</SelectItem>
                  <SelectItem value="5">Rajesh Sharma</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <OrderList orders={mapOrdersToListFormat(filteredOrders)} />
          </TabsContent>
          <TabsContent value="in-progress" className="mt-0">
            <OrderList orders={mapOrdersToListFormat(filteredOrders)} />
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            <OrderList orders={mapOrdersToListFormat(filteredOrders)} />
          </TabsContent>
          <TabsContent value="delivered" className="mt-0">
            <OrderList orders={mapOrdersToListFormat(filteredOrders)} />
          </TabsContent>
          <TabsContent value="partial" className="mt-0">
            <OrderList orders={mapOrdersToListFormat(filteredOrders)} />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default OrderManagement;
