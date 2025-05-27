export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: 'active' | 'inactive';
  created_at: string;
  totalOrders: number;
  totalValue: string;
}

// In-memory storage for clients
let clients: Client[] = [];

// Get all clients
export const getClients = async (): Promise<Client[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...clients];
};

// Get a client by ID
export const getClientById = async (id: string): Promise<Client | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const client = clients.find(c => c.id === id);
  return client || null;
};

// Create a new client
export const createClient = async (client: Omit<Client, 'id' | 'created_at' | 'totalOrders' | 'totalValue'>): Promise<Client> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newClient: Client = {
    ...client,
    id: 'CLI' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    created_at: new Date().toISOString().split('T')[0],
    totalOrders: 0,
    totalValue: '0'
  };
  
  clients.push(newClient);
  return newClient;
};

// Update client status
export const updateClientStatus = async (id: string, status: Client['status']): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  clients = clients.map(c => c.id === id ? { ...c, status } : c);
};

// Delete a client
export const deleteClient = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  clients = clients.filter(c => c.id !== id);
};