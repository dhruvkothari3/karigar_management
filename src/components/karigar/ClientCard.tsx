
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Calendar, DollarSign, ShoppingBag, Eye } from "lucide-react";
import type { Client } from "@/services/clientService";

interface ClientCardProps {
  client: Client;
  onViewOrders?: (clientId: string) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onViewOrders }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-karigar-800 dark:text-karigar-200">
            {client.name}
          </CardTitle>
          <Badge 
            variant={client.status === 'active' ? 'default' : 'secondary'}
            className={client.status === 'active' ? 'bg-green-100 text-green-800' : ''}
          >
            {client.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">ID: {client.id}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{client.phone}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{client.email}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{client.address}, {client.city}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Joined: {new Date(client.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Total Orders</p>
                <p className="font-semibold">{client.totalOrders}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Total Value</p>
                <p className="font-semibold">₹{client.totalValue}</p>
              </div>
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-3"
          onClick={() => onViewOrders?.(client.id)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Order History
        </Button>
      </CardContent>
    </Card>
  );
};
