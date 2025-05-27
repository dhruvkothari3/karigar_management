
import React, { useState } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Loader2, Phone, Mail, Map, Star, Award, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { getKarigars, Karigar, updateKarigarStatus, getKarigarById } from "@/services/karigarService";
import { KarigarForm } from "@/components/karigar/KarigarForm";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderList } from "@/components/karigar/OrderList";

const KarigarsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedKarigarId, setSelectedKarigarId] = useState<string | null>(null);
  const [karigarDetailsOpen, setKarigarDetailsOpen] = useState(false);
  
  const { data: karigars = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['karigars'],
    queryFn: getKarigars
  });
  
  const { data: selectedKarigar, isLoading: isLoadingKarigar } = useQuery({
    queryKey: ['karigar', selectedKarigarId],
    queryFn: () => selectedKarigarId ? getKarigarById(selectedKarigarId) : null,
    enabled: !!selectedKarigarId && karigarDetailsOpen
  });
  
  // Filter karigars based on search term, status, and skill
  const filteredKarigars = karigars.filter((karigar) => {
    const matchesSearch = 
      searchTerm === "" || 
      karigar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      karigar.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      karigar.contactNumber.includes(searchTerm) ||
      karigar.skill.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === "all" || 
      karigar.status === statusFilter;
      
    const matchesSkill = 
      skillFilter === "all" || 
      karigar.skill.toLowerCase() === skillFilter.toLowerCase();
      
    return matchesSearch && matchesStatus && matchesSkill;
  });

  const handleStatusChange = async (karigarId: string, newStatus: Karigar['status']) => {
    try {
      await updateKarigarStatus(karigarId, newStatus);
      toast.success("Status updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Error updating status:", error);
    }
  };

  const handleViewKarigar = (id: string) => {
    setSelectedKarigarId(id);
    setKarigarDetailsOpen(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium dark:bg-green-900 dark:text-green-100';
      case 'busy': return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium dark:bg-yellow-900 dark:text-yellow-100';
      case 'unavailable': return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Mock orders for demonstration
  const mockOrders = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      clientName: 'Rahul Sharma',
      itemType: 'Diamond Ring',
      status: 'In Progress',
      dueDate: '2025-06-15',
      priority: 'High'
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      clientName: 'Priya Patel',
      itemType: 'Diamond Necklace',
      status: 'Completed',
      dueDate: '2025-05-20',
      priority: 'Medium'
    }
  ];

  return (
    <SidebarLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-karigar-800 dark:text-karigar-200">Karigars</h1>
            <p className="text-muted-foreground mt-2">Manage all your jewelry artisans in one place.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-karigar-500 hover:bg-karigar-600">
                <Plus className="mr-2 h-4 w-4" />
                Add Karigar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Karigar</DialogTitle>
              </DialogHeader>
              <KarigarForm onClose={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>All Karigars</CardTitle>
            <CardDescription>View and manage all registered jewelry artisans.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search karigars..." 
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select 
                defaultValue="all" 
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                defaultValue="all"
                value={skillFilter}
                onValueChange={setSkillFilter}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  <SelectItem value="diamond setting">Diamond Setting</SelectItem>
                  <SelectItem value="gold work">Gold Work</SelectItem>
                  <SelectItem value="jewelry making">Jewelry Making</SelectItem>
                  <SelectItem value="stone setting">Stone Setting</SelectItem>
                  <SelectItem value="casting">Casting</SelectItem>
                  <SelectItem value="polishing">Polishing</SelectItem>
                  <SelectItem value="designing">Designing</SelectItem>
                  <SelectItem value="engraving">Engraving</SelectItem>
                  <SelectItem value="filigree work">Filigree Work</SelectItem>
                  <SelectItem value="quality control">Quality Control</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-karigar-500" />
                <span className="ml-2 text-muted-foreground">Loading karigars...</span>
              </div>
            ) : isError ? (
              <div className="text-center py-8">
                <p className="text-destructive">Error loading karigars. Please try again.</p>
                <Button variant="outline" className="mt-2" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Skill</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredKarigars.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="py-6 text-center text-muted-foreground">
                            No karigars found. Try adjusting your filters or add a new karigar.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredKarigars.map((karigar) => (
                          <TableRow key={karigar.id} className="hover:bg-muted/30 cursor-default">
                            <TableCell>
                              <div className="font-medium text-foreground">{karigar.name}</div>
                              <div className="text-xs text-muted-foreground">{karigar.contactNumber}</div>
                            </TableCell>
                            <TableCell className="text-sm text-foreground">{karigar.skill}</TableCell>
                            <TableCell className="text-sm text-foreground">{karigar.experience}</TableCell>
                            <TableCell className="text-sm text-foreground">{karigar.location}</TableCell>
                            <TableCell className="text-sm">
                              <Select 
                                defaultValue={karigar.status}
                                onValueChange={(value: Karigar['status']) => handleStatusChange(karigar.id, value)}
                              >
                                <SelectTrigger className={getStatusBadgeClass(karigar.status)}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="available">Available</SelectItem>
                                  <SelectItem value="busy">Busy</SelectItem>
                                  <SelectItem value="unavailable">Unavailable</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center">
                                <span className="mr-1">{karigar.rating.toFixed(1)}</span>
                                <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </div>
                              <div className="text-xs text-muted-foreground">{karigar.assignments} assignments</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewKarigar(karigar.id)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <div>Showing {filteredKarigars.length} of {karigars.length} karigars</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Karigar Details Sheet */}
      <Sheet open={karigarDetailsOpen} onOpenChange={setKarigarDetailsOpen}>
        <SheetContent className="sm:max-w-lg w-[90%] overflow-y-auto">
          {isLoadingKarigar ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-karigar-500" />
            </div>
          ) : selectedKarigar ? (
            <div className="space-y-6">
              <SheetHeader>
                <SheetTitle className="text-2xl flex items-center">
                  {selectedKarigar.name}
                  <span className={`ml-2 inline-block ${getStatusBadgeClass(selectedKarigar.status)}`}>
                    {selectedKarigar.status.charAt(0).toUpperCase() + selectedKarigar.status.slice(1)}
                  </span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="space-y-4">
                {/* Karigar Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-karigar-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Skill</p>
                      <p className="font-medium">{selectedKarigar.skill}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-karigar-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p className="font-medium">{selectedKarigar.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-karigar-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="font-medium">{selectedKarigar.contactNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Map className="h-5 w-5 mr-2 text-karigar-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{selectedKarigar.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="font-medium">{selectedKarigar.rating.toFixed(1)} / 5.0</p>
                    </div>
                  </div>
                </div>

                {/* Current Orders */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Current Orders</h3>
                  <OrderList orders={mockOrders} />
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap gap-2">
                  <Button>Assign New Order</Button>
                  <Button variant="outline">Edit Details</Button>
                  <Button variant="outline" onClick={() => setKarigarDetailsOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Karigar not found</p>
            </div>
          )}
        </SheetContent>
      </Sheet>

    </SidebarLayout>
  );
};

export default KarigarsList;
