export interface OrderData {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  orderDescription: string;
  quantity: number;
  itemType: string;
  goldKarat: string;
  deadline: string;
  karigar: {
    id: string;
    name: string;
    skill: string;
  };
  materials: Array<{
    id: string;
    name: string;
    weight: string;
    unit: string;
    quantity?: string;
  }>;
  stages: Array<{
    id: string;
    name: string;
    estimatedDays: string;
    isComplete: boolean;
  }>;
  createdAt: string;
  status: "pending" | "in-progress" | "completed" | "delivered" | "delayed";
  deliveredItems: number;
  remainingItems: number;
  estimatedPrice: string;
}

// In-memory storage for orders
let orders: OrderData[] = [];

export const getOrders = (): OrderData[] => {
  return orders;
};

export const getOrdersByClientId = (clientId: string): OrderData[] => {
  return orders.filter(order => order.clientId === clientId);
};

export const addOrder = (order: OrderData): void => {
  orders = [order, ...orders];
};

export const updateOrder = (orderId: string, updatedOrder: Partial<OrderData>): void => {
  orders = orders.map(order => 
    order.id === orderId ? { ...order, ...updatedOrder } : order
  );
};