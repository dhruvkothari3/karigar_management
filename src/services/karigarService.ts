import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Make sure these environment variables are set in your Supabase project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client
let supabase: SupabaseClient;

try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error("Error initializing Supabase client:", error);
}

export interface Karigar {
  id: string;
  name: string;
  skill: string;
  experience: string;
  location: string;
  status: 'available' | 'busy' | 'unavailable';
  contactNumber: string;
  rating: number;
  assignments: number;
  created_at?: string;
}

// In-memory storage for karigars when Supabase is not available
let mockKarigars: Karigar[] = [];

// Check if Supabase is available
const isSupabaseAvailable = () => {
  return supabase !== undefined;
};

// Get all karigars
export const getKarigars = async (): Promise<Karigar[]> => {
  if (!isSupabaseAvailable()) {
    console.warn("Using mock data: Supabase client not available");
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockKarigars];
  }

  try {
    const { data, error } = await supabase
      .from('karigars')
      .select('*');

    if (error) {
      console.error('Error fetching karigars:', error);
      return [...mockKarigars];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getKarigars:', error);
    return [...mockKarigars];
  }
};

// Get a karigar by ID
export const getKarigarById = async (id: string): Promise<Karigar | null> => {
  if (!isSupabaseAvailable()) {
    console.warn("Using mock data: Supabase client not available");
    await new Promise(resolve => setTimeout(resolve, 300));
    const karigar = mockKarigars.find(k => k.id === id);
    return karigar || null;
  }

  try {
    const { data, error } = await supabase
      .from('karigars')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching karigar by ID:', error);
      const karigar = mockKarigars.find(k => k.id === id);
      return karigar || null;
    }

    return data || null;
  } catch (error) {
    console.error('Error in getKarigarById:', error);
    const karigar = mockKarigars.find(k => k.id === id);
    return karigar || null;
  }
};

// Create a new karigar
export const createKarigar = async (karigar: Omit<Karigar, 'id'>): Promise<Karigar> => {
  if (!isSupabaseAvailable()) {
    console.warn("Using mock data: Supabase client not available");
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create a new karigar with a random ID
    const newKarigar: Karigar = {
      ...karigar,
      id: Math.random().toString(36).substring(2, 11),
    };
    
    // Add to mock storage
    mockKarigars.push(newKarigar);
    
    return newKarigar;
  }

  try {
    // Add created_at timestamp if not provided
    const karigarWithTimestamp = {
      ...karigar,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('karigars')
      .insert([karigarWithTimestamp])
      .select();

    if (error) {
      console.error('Error creating karigar:', error);
      const newKarigar = {
        ...karigar,
        id: Math.random().toString(36).substring(2, 11),
      };
      mockKarigars.push(newKarigar);
      return newKarigar;
    }

    return data[0];
  } catch (error) {
    console.error('Error in createKarigar:', error);
    const newKarigar = {
      ...karigar,
      id: Math.random().toString(36).substring(2, 11),
    };
    mockKarigars.push(newKarigar);
    return newKarigar;
  }
};

// Update karigar status
export const updateKarigarStatus = async (id: string, status: Karigar['status']): Promise<void> => {
  if (!isSupabaseAvailable()) {
    console.warn("Using mock data: Supabase client not available");
    await new Promise(resolve => setTimeout(resolve, 600));
    // Update in mock storage
    mockKarigars = mockKarigars.map(k => k.id === id ? { ...k, status } : k);
    return;
  }

  try {
    const { error } = await supabase
      .from('karigars')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating karigar status:', error);
      mockKarigars = mockKarigars.map(k => k.id === id ? { ...k, status } : k);
    }
  } catch (error) {
    console.error('Error in updateKarigarStatus:', error);
    mockKarigars = mockKarigars.map(k => k.id === id ? { ...k, status } : k);
  }
};

// Delete a karigar
export const deleteKarigar = async (id: string): Promise<void> => {
  if (!isSupabaseAvailable()) {
    console.warn("Using mock data: Supabase client not available");
    await new Promise(resolve => setTimeout(resolve, 700));
    // Remove from mock storage
    mockKarigars = mockKarigars.filter(k => k.id !== id);
    return;
  }

  try {
    const { error } = await supabase
      .from('karigars')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting karigar:', error);
      mockKarigars = mockKarigars.filter(k => k.id !== id);
    }
  } catch (error) {
    console.error('Error in deleteKarigar:', error);
    mockKarigars = mockKarigars.filter(k => k.id !== id);
  }
};

// Toast integration for operations
export const useKarigarToasts = () => {
  const showSuccessToast = (message: string) => {
    import('@/hooks/use-toast').then(({ toast }) => {
      toast({
        title: "Success",
        description: message,
      });
    });
  };

  const showErrorToast = (message: string) => {
    import('@/hooks/use-toast').then(({ toast }) => {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    });
  };

  return { showSuccessToast, showErrorToast };
};