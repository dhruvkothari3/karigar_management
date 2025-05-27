
import React from "react";
import { ClientCard } from "./ClientCard";
import type { Client } from "@/services/clientService";

interface ClientListProps {
  clients: Client[];
  onViewOrders?: (clientId: string) => void;
}

export const ClientList: React.FC<ClientListProps> = ({ clients, onViewOrders }) => {
  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No clients found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <ClientCard 
          key={client.id} 
          client={client} 
          onViewOrders={onViewOrders}
        />
      ))}
    </div>
  );
};
