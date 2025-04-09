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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { User } from '@shared/schema';
import { PlusCircle, Loader2, Edit, Trash2, Lock, UserPlus, ShieldAlert } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

const USER_ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'sales_manager', label: 'Sales Manager' },
  { value: 'blog_editor', label: 'Blog Editor' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'customer', label: 'Customer' },
];

export default function AdminUsers() {
  const [match, params] = useRoute('/admin/users');
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
    enabled: !!user && user.role === 'super_admin'
  });
  
  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const res = await apiRequest('POST', '/api/register', userData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: 'User created',
        description: 'The user has been created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create user',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest('PUT', `/api/users/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: 'User updated',
        description: 'The user has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update user',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async ({ id, password }: { id: number; password: string }) => {
      const res = await apiRequest('PUT', `/api/users/${id}`, { password });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setIsPasswordDialogOpen(false);
      setPasswordData({ password: '', confirmPassword: '' });
      toast({
        title: 'Password updated',
        description: 'The user password has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update password',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setIsDeleteDialogOpen(false);
      setCurrentUser(null);
      toast({
        title: 'User deleted',
        description: 'The user has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete user',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Redirect non-super admin users
  useEffect(() => {
    if (user && user.role !== 'super_admin') {
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
      username: '',
      email: '',
      fullName: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: ''
    });
  };
  
  const handleEditUser = (userData: User) => {
    setCurrentUser(userData);
    setFormData({
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      phone: userData.phone || '',
      password: '',
      confirmPassword: '',
      role: userData.role
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteUser = (userData: User) => {
    setCurrentUser(userData);
    setIsDeleteDialogOpen(true);
  };
  
  const handleChangePassword = (userData: User) => {
    setCurrentUser(userData);
    setPasswordData({
      password: '',
      confirmPassword: ''
    });
    setIsPasswordDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };
  
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'The passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    
    const userData = {
      username: formData.username,
      email: formData.email,
      fullName: formData.fullName,
      phone: formData.phone || undefined,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: formData.role
    };
    
    createUserMutation.mutate(userData);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const userData = {
      username: formData.username,
      email: formData.email,
      fullName: formData.fullName,
      phone: formData.phone || undefined,
      role: formData.role
    };
    
    updateUserMutation.mutate({ id: currentUser.id, data: userData });
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    if (passwordData.password !== passwordData.confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'The passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    
    if (passwordData.password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }
    
    updatePasswordMutation.mutate({ 
      id: currentUser.id, 
      password: passwordData.password 
    });
  };
  
  const confirmDelete = () => {
    if (currentUser) {
      deleteUserMutation.mutate(currentUser.id);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return (
          <Badge className="bg-purple-100 text-purple-800 flex items-center">
            <ShieldAlert className="h-3 w-3 mr-1" />
            Super Admin
          </Badge>
        );
      case 'sales_manager':
        return <Badge className="bg-blue-100 text-blue-800">Sales Manager</Badge>;
      case 'blog_editor':
        return <Badge className="bg-amber-100 text-amber-800">Blog Editor</Badge>;
      case 'accountant':
        return <Badge className="bg-green-100 text-green-800">Accountant</Badge>;
      case 'customer':
        return <Badge className="bg-neutral-100 text-neutral-800">Customer</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };
  
  // Table columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'username',
      header: 'Username',
      cell: ({ row }) => <span className="font-medium">{row.original.username}</span>,
    },
    {
      accessorKey: 'fullName',
      header: 'Name',
      cell: ({ row }) => <span>{row.original.fullName}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <span className="text-neutral-500">{row.original.email}</span>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => <span>{row.original.phone || '-'}</span>,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => getRoleBadge(row.original.role),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => <span className="text-sm">{formatDate(row.original.createdAt)}</span>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleEditUser(row.original)}
            title="Edit User"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleChangePassword(row.original)}
            title="Change Password"
          >
            <Lock className="h-4 w-4" />
          </Button>
          {/* Don't allow deleting your own account or the main admin account */}
          {row.original.id !== user?.id && row.original.id !== 1 && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-600 hover:text-red-900 hover:bg-red-100"
              onClick={() => handleDeleteUser(row.original)}
              title="Delete User"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];
  
  if (!user || user.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Manage Users - Limpias Technologies</title>
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
          <Header toggleMobileSidebar={toggleMobileSidebar} pageTitle="Users" />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="flex flex-col space-y-6">
              {/* Page Header & Actions */}
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-neutral-800">Users</h2>
                  <p className="text-neutral-500">Manage system users and their roles</p>
                </div>
                
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)} 
                  className="mt-4 md:mt-0"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
              
              {/* Users Table */}
              <DataTable 
                columns={columns} 
                data={users || []} 
                searchKey="username"
                isLoading={usersLoading}
              />
            </div>
          </main>
        </div>
      </div>
      
      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with specific role and permissions.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    name="username" 
                    value={formData.username} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    value={formData.password} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    value={formData.confirmPassword} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
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
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Create User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details and role.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-username">Username</Label>
                  <Input 
                    id="edit-username" 
                    name="username" 
                    value={formData.username} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input 
                    id="edit-email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-fullName">Full Name</Label>
                  <Input 
                    id="edit-fullName" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone (optional)</Label>
                  <Input 
                    id="edit-phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-neutral-500 bg-neutral-50 p-3 rounded-md flex items-start">
                <Lock className="h-4 w-4 mr-2 mt-0.5" />
                <p>To change the user's password, use the "Change Password" option.</p>
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
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Update User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              {currentUser && (
                <p>Update password for user: {currentUser.username}</p>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePasswordSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                  id="new-password" 
                  name="password" 
                  type="password" 
                  value={passwordData.password} 
                  onChange={handlePasswordInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input 
                  id="confirm-password" 
                  name="confirmPassword" 
                  type="password" 
                  value={passwordData.confirmPassword} 
                  onChange={handlePasswordInputChange} 
                  required 
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsPasswordDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updatePasswordMutation.isPending}
              >
                {updatePasswordMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Update Password
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
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {currentUser && (
              <div>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 font-bold mr-3">
                    {currentUser.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold">{currentUser.fullName}</p>
                    <p className="text-sm text-neutral-500">{currentUser.email}</p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-amber-50 text-amber-800 text-sm rounded-md">
                  <p>This will permanently delete the user account and all associated data.</p>
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
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}