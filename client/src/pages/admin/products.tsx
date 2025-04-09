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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Product } from '@shared/schema';
import { PlusCircle, Loader2, Edit, Trash2, ImagePlus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

const CATEGORIES = [
  'Solar Panels',
  'Inverters',
  'Water Heaters',
  'Water Pumps',
  'Accessories'
];

export default function AdminProducts() {
  const [match, params] = useRoute('/admin/products');
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    specifications: {
      power: '',
      efficiency: '',
      dimensions: '',
      warranty: ''
    },
    stock: '',
    featured: false
  });
  
  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: !!user
  });
  
  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const res = await apiRequest('POST', '/api/products', productData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: 'Product created',
        description: 'The product has been created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create product',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest('PUT', `/api/products/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: 'Product updated',
        description: 'The product has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update product',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsDeleteDialogOpen(false);
      setCurrentProduct(null);
      toast({
        title: 'Product deleted',
        description: 'The product has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete product',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Redirect non-admin users
  useEffect(() => {
    if (user && !['super_admin', 'sales_manager'].includes(user.role)) {
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
  
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      specifications: {
        power: '',
        efficiency: '',
        dimensions: '',
        warranty: ''
      },
      stock: '',
      featured: false
    });
  };
  
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl,
      specifications: {
        power: product.specifications.power || '',
        efficiency: product.specifications.efficiency || '',
        dimensions: product.specifications.dimensions || '',
        warranty: product.specifications.warranty || ''
      },
      stock: product.stock.toString(),
      featured: product.featured
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSpecChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value
      }
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      specifications: formData.specifications,
      stock: parseInt(formData.stock),
      featured: formData.featured
    };
    
    createProductMutation.mutate(productData);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProduct) return;
    
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      imageUrl: formData.imageUrl,
      specifications: formData.specifications,
      stock: parseInt(formData.stock),
      featured: formData.featured
    };
    
    updateProductMutation.mutate({ id: currentProduct.id, data: productData });
  };
  
  const confirmDelete = () => {
    if (currentProduct) {
      deleteProductMutation.mutate(currentProduct.id);
    }
  };
  
  // Table columns
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Product Name',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="h-10 w-10 mr-3 rounded-md border overflow-hidden">
            <img 
              src={row.original.imageUrl} 
              alt={row.original.name} 
              className="h-full w-full object-cover" 
            />
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-sm text-neutral-500">{row.original.category}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => <span className="font-medium">${row.original.price.toFixed(2)}</span>,
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: ({ row }) => (
        <span className={`${row.original.stock < 10 ? 'text-amber-600' : 'text-green-600'}`}>
          {row.original.stock}
        </span>
      ),
    },
    {
      accessorKey: 'featured',
      header: 'Featured',
      cell: ({ row }) => (
        <span className={`${row.original.featured ? 'text-green-600' : 'text-neutral-500'}`}>
          {row.original.featured ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleEditProduct(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-600 hover:text-red-900 hover:bg-red-100"
            onClick={() => handleDeleteProduct(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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
        <title>Manage Products - Limpias Technologies</title>
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
          <Header toggleMobileSidebar={toggleMobileSidebar} pageTitle="Products" />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="flex flex-col space-y-6">
              {/* Page Header & Actions */}
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-neutral-800">Products</h2>
                  <p className="text-neutral-500">Manage solar products catalog</p>
                </div>
                
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)} 
                  className="mt-4 md:mt-0"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
              
              {/* Products Table */}
              <DataTable 
                columns={columns} 
                data={products || []} 
                searchKey="name"
                isLoading={productsLoading}
              />
            </div>
          </main>
        </div>
      </div>
      
      {/* Create Product Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the product details below.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  rows={3} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input 
                    id="stock" 
                    name="stock" 
                    type="number" 
                    min="0" 
                    step="1" 
                    value={formData.stock} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <div className="flex">
                  <Input 
                    id="imageUrl" 
                    name="imageUrl" 
                    value={formData.imageUrl} 
                    onChange={handleInputChange} 
                    placeholder="https://example.com/image.jpg" 
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="ml-2" 
                    onClick={() => {
                      // Future enhancement: image upload
                      toast({
                        title: 'Image upload',
                        description: 'Image upload functionality will be added soon.',
                      });
                    }}
                  >
                    <ImagePlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="power">Power</Label>
                    <Input 
                      id="power" 
                      value={formData.specifications.power} 
                      onChange={(e) => handleSpecChange('power', e.target.value)} 
                      placeholder="e.g. 400W" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="efficiency">Efficiency</Label>
                    <Input 
                      id="efficiency" 
                      value={formData.specifications.efficiency} 
                      onChange={(e) => handleSpecChange('efficiency', e.target.value)} 
                      placeholder="e.g. 21.5%" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input 
                      id="dimensions" 
                      value={formData.specifications.dimensions} 
                      onChange={(e) => handleSpecChange('dimensions', e.target.value)} 
                      placeholder="e.g. 2000 x 1000 mm" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="warranty">Warranty</Label>
                    <Input 
                      id="warranty" 
                      value={formData.specifications.warranty} 
                      onChange={(e) => handleSpecChange('warranty', e.target.value)} 
                      placeholder="e.g. 25 years" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <input
                  id="featured"
                  type="checkbox"
                  className="rounded border-neutral-300 text-primary focus:ring-primary"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                />
                <Label htmlFor="featured" className="cursor-pointer">Featured product</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Create Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details below.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input 
                    id="edit-name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  rows={3} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price ($)</Label>
                  <Input 
                    id="edit-price" 
                    name="price" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input 
                    id="edit-stock" 
                    name="stock" 
                    type="number" 
                    min="0" 
                    step="1" 
                    value={formData.stock} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-imageUrl">Image URL</Label>
                <div className="flex">
                  <Input 
                    id="edit-imageUrl" 
                    name="imageUrl" 
                    value={formData.imageUrl} 
                    onChange={handleInputChange} 
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="ml-2" 
                    onClick={() => {
                      // Future enhancement: image upload
                      toast({
                        title: 'Image upload',
                        description: 'Image upload functionality will be added soon.',
                      });
                    }}
                  >
                    <ImagePlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Specifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-power">Power</Label>
                    <Input 
                      id="edit-power" 
                      value={formData.specifications.power} 
                      onChange={(e) => handleSpecChange('power', e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-efficiency">Efficiency</Label>
                    <Input 
                      id="edit-efficiency" 
                      value={formData.specifications.efficiency} 
                      onChange={(e) => handleSpecChange('efficiency', e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-dimensions">Dimensions</Label>
                    <Input 
                      id="edit-dimensions" 
                      value={formData.specifications.dimensions} 
                      onChange={(e) => handleSpecChange('dimensions', e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-warranty">Warranty</Label>
                    <Input 
                      id="edit-warranty" 
                      value={formData.specifications.warranty} 
                      onChange={(e) => handleSpecChange('warranty', e.target.value)} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <input
                  id="edit-featured"
                  type="checkbox"
                  className="rounded border-neutral-300 text-primary focus:ring-primary"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                />
                <Label htmlFor="edit-featured" className="cursor-pointer">Featured product</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateProductMutation.isPending}
              >
                {updateProductMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Update Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {currentProduct && (
              <div className="flex items-center">
                <div className="h-12 w-12 mr-3 rounded-md border overflow-hidden">
                  <img 
                    src={currentProduct.imageUrl} 
                    alt={currentProduct.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <p className="font-bold">{currentProduct.name}</p>
                  <p className="text-sm text-neutral-500">{currentProduct.category}</p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteProductMutation.isPending}
            >
              {deleteProductMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}