import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { useLocation, useRoute } from 'wouter';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/admin/sidebar';
import Header from '@/components/admin/header';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Order, OrderItem } from '@shared/schema';
import { ShoppingBag, Loader2, Eye, DollarSign, Calendar, Package, User, Phone, MapPin } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

interface OrderWithItems extends Order {
  items?: OrderItem[];
}

export default function AdminOrders() {
  const [match, params] = useRoute('/admin/orders');
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderWithItems | null>(null);
  const [newStatus, setNewStatus] = useState('');
  
  // Fetch orders
  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
    enabled: !!user
  });
  
  // Fetch order details (with items)
  const fetchOrderDetails = async (orderId: number) => {
    const res = await apiRequest('GET', `/api/orders/${orderId}`);
    const data = await res.json();
    setCurrentOrder(data);
    setIsViewDialogOpen(true);
  };
  
  // Update order status mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest('PUT', `/api/orders/${id}`, { paymentStatus: status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      setIsStatusDialogOpen(false);
      toast({
        title: 'Order updated',
        description: 'The order status has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update order',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Redirect non-admin users
  useEffect(() => {
    if (user && !['super_admin', 'sales_manager', 'accountant'].includes(user.role)) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Auto-collapse sidebar on small screens
  useEffect(() => {
    setSidebarCollapsed(window.innerWidth < 1280);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };
  
  const handleViewOrder = async (order: Order) => {
    await fetchOrderDetails(order.id);
  };
  
  const handleUpdateStatus = (order: Order) => {
    setCurrentOrder(order);
    setNewStatus(order.paymentStatus);
    setIsStatusDialogOpen(true);
  };
  
  const confirmStatusUpdate = () => {
    if (currentOrder && newStatus) {
      updateOrderMutation.mutate({ id: currentOrder.id, status: newStatus });
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Table columns
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'id',
      header: 'Order ID',
      cell: ({ row }) => <span className="font-medium">#{row.original.id}</span>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }) => <span>{row.original.customerName}</span>,
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => <span className="font-medium">${row.original.total.toFixed(2)}</span>,
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment Status',
      cell: ({ row }) => getStatusBadge(row.original.paymentStatus),
    },
    {
      accessorKey: 'shippingStatus',
      header: 'Shipping Status',
      cell: ({ row }) => <span className="capitalize">{row.original.shippingStatus}</span>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleViewOrder(row.original)}
            title="View Order Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {(user?.role === 'super_admin' || user?.role === 'accountant') && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleUpdateStatus(row.original)}
              title="Update Payment Status"
            >
              <DollarSign className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Manage Orders - Limpias Technologies</title>
      </Helmet>
      
      <div className="flex h-screen bg-neutral-50 overflow-hidden">
        {/* Sidebar */}
        {(isMobile && mobileSidebarOpen) && (
          <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setMobileSidebarOpen(false)}></div>
        )}
        
        {(mobileSidebarOpen || !isMobile) && (
          <Sidebar 
            isMobile={isMobile} 
            isCollapsed={sidebarCollapsed} 
            toggleSidebar={toggleSidebar}
            closeMobileSidebar={() => setMobileSidebarOpen(false)}
          />
        )}
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleMobileSidebar={toggleMobileSidebar} pageTitle="Orders" />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="flex flex-col space-y-6">
              {/* Page Header */}
              <div>
                <h2 className="text-2xl font-heading font-bold text-neutral-800">Orders</h2>
                <p className="text-neutral-500">Manage and track customer orders</p>
              </div>
              
              {/* Orders Table */}
              <DataTable 
                columns={columns} 
                data={orders || []} 
                searchKey="customerName"
                isLoading={ordersLoading}
              />
            </div>
          </main>
        </div>
      </div>
      
      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {currentOrder && (
                <p>Order #{currentOrder.id} - {formatDate(currentOrder.createdAt)}</p>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {currentOrder && (
            <div className="space-y-6 py-2">
              {/* Order Status */}
              <div className="flex flex-wrap gap-2 justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5 text-neutral-500" />
                  <span className="font-medium">Payment:</span>
                  {getStatusBadge(currentOrder.paymentStatus)}
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-neutral-500" />
                  <span className="font-medium">Shipping:</span>
                  <Badge variant="outline" className="capitalize">{currentOrder.shippingStatus}</Badge>
                </div>
              </div>
              
              {/* Customer Information */}
              <div className="rounded-md border p-4 space-y-2">
                <h3 className="font-medium flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-neutral-500">Name:</p>
                    <p className="font-medium">{currentOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Email:</p>
                    <p className="font-medium">{currentOrder.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Phone:</p>
                    <p className="font-medium flex items-center">
                      <Phone className="h-3 w-3 mr-1 text-neutral-500" />
                      {currentOrder.customerPhone}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div className="rounded-md border p-4 space-y-2">
                <h3 className="font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Shipping Address
                </h3>
                <p className="text-sm whitespace-pre-line">
                  {currentOrder.shippingAddress}
                </p>
              </div>
              
              {/* Order Items */}
              <div className="space-y-3">
                <h3 className="font-medium">Order Items</h3>
                {currentOrder.items && currentOrder.items.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-neutral-200">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Product</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Price</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-neutral-200">
                        {currentOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-neutral-900">
                              {item.productName}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500 text-right">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500 text-right">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right">
                              ${(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-neutral-50">
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-sm font-medium text-right">
                            Subtotal:
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-right">
                            ${currentOrder.subtotal.toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-sm font-medium text-right">
                            Shipping:
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-right">
                            ${currentOrder.shippingCost.toFixed(2)}
                          </td>
                        </tr>
                        {currentOrder.taxAmount > 0 && (
                          <tr>
                            <td colSpan={3} className="px-4 py-3 text-sm font-medium text-right">
                              Tax:
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-right">
                              ${currentOrder.taxAmount.toFixed(2)}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-sm font-bold text-right">
                            Total:
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-right">
                            ${currentOrder.total.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className="text-neutral-500 text-sm">No items found for this order.</p>
                )}
              </div>
              
              {/* Order Notes */}
              {currentOrder.notes && (
                <div className="space-y-2">
                  <h3 className="font-medium">Notes</h3>
                  <p className="text-sm p-3 bg-neutral-50 rounded-md">{currentOrder.notes}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            {(user?.role === 'super_admin' || user?.role === 'accountant') && currentOrder && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsViewDialogOpen(false);
                  handleUpdateStatus(currentOrder);
                }}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Update Payment Status
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
            <DialogDescription>
              {currentOrder && (
                <p>Order #{currentOrder.id} - {currentOrder.customerName}</p>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment-status">Payment Status</Label>
                <Select 
                  value={newStatus} 
                  onValueChange={setNewStatus}
                >
                  <SelectTrigger id="payment-status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={confirmStatusUpdate}
              disabled={updateOrderMutation.isPending}
            >
              {updateOrderMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}