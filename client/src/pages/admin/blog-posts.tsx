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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { BlogPost } from '@shared/schema';
import { PlusCircle, Loader2, Edit, Trash2, ImagePlus, CheckCircle, Clock } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export default function AdminBlogPosts() {
  const [match, params] = useRoute('/admin/blog-posts');
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBlogPost, setCurrentBlogPost] = useState<BlogPost | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    isApproved: false
  });
  
  // Fetch blog posts
  const { data: blogPosts, isLoading: blogPostsLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
    enabled: !!user
  });
  
  // Create blog post mutation
  const createBlogPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const res = await apiRequest('POST', '/api/blog-posts', postData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: 'Blog post created',
        description: 'The blog post has been created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create blog post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Update blog post mutation
  const updateBlogPostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest('PUT', `/api/blog-posts/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: 'Blog post updated',
        description: 'The blog post has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update blog post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Delete blog post mutation
  const deleteBlogPostMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/blog-posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      setIsDeleteDialogOpen(false);
      setCurrentBlogPost(null);
      toast({
        title: 'Blog post deleted',
        description: 'The blog post has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete blog post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Redirect non-admin users
  useEffect(() => {
    if (user && !['super_admin', 'blog_editor'].includes(user.role)) {
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
      title: '',
      content: '',
      imageUrl: '',
      isApproved: false
    });
  };
  
  const handleEditBlogPost = (post: BlogPost) => {
    setCurrentBlogPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      isApproved: post.isApproved
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteBlogPost = (post: BlogPost) => {
    setCurrentBlogPost(post);
    setIsDeleteDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      title: formData.title,
      content: formData.content,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      isApproved: user?.role === 'super_admin' ? formData.isApproved : false
    };
    
    createBlogPostMutation.mutate(postData);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentBlogPost) return;
    
    const postData = {
      title: formData.title,
      content: formData.content,
      imageUrl: formData.imageUrl,
      isApproved: user?.role === 'super_admin' ? formData.isApproved : currentBlogPost.isApproved
    };
    
    updateBlogPostMutation.mutate({ id: currentBlogPost.id, data: postData });
  };
  
  const confirmDelete = () => {
    if (currentBlogPost) {
      deleteBlogPostMutation.mutate(currentBlogPost.id);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Table columns
  const columns: ColumnDef<BlogPost>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="h-10 w-14 mr-3 rounded-md border overflow-hidden">
            <img 
              src={row.original.imageUrl} 
              alt={row.original.title} 
              className="h-full w-full object-cover" 
            />
          </div>
          <div>
            <p className="font-medium line-clamp-1">{row.original.title}</p>
            <p className="text-sm text-neutral-500">{formatDate(row.original.createdAt)}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'content',
      header: 'Content',
      cell: ({ row }) => (
        <p className="line-clamp-2 text-sm text-neutral-600">
          {row.original.content}
        </p>
      ),
    },
    {
      accessorKey: 'authorId',
      header: 'Author',
      cell: ({ row }) => <span className="text-sm">Admin #{row.original.authorId}</span>,
    },
    {
      accessorKey: 'isApproved',
      header: 'Status',
      cell: ({ row }) => (
        <Badge 
          className={row.original.isApproved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}
        >
          {row.original.isApproved ? (
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span>Published</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>Pending</span>
            </div>
          )}
        </Badge>
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
            onClick={() => handleEditBlogPost(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          {user?.role === 'super_admin' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-600 hover:text-red-900 hover:bg-red-100"
              onClick={() => handleDeleteBlogPost(row.original)}
            >
              <Trash2 className="h-4 w-4" />
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
        <title>Manage Blog Posts - Limpias Technologies</title>
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
          <Header toggleMobileSidebar={toggleMobileSidebar} pageTitle="Blog Posts" />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="flex flex-col space-y-6">
              {/* Page Header & Actions */}
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-neutral-800">Blog Posts</h2>
                  <p className="text-neutral-500">Manage blog content and publications</p>
                </div>
                
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)} 
                  className="mt-4 md:mt-0"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Blog Post
                </Button>
              </div>
              
              {/* Blog Posts Table */}
              <DataTable 
                columns={columns} 
                data={blogPosts || []} 
                searchKey="title"
                isLoading={blogPostsLoading}
              />
            </div>
          </main>
        </div>
      </div>
      
      {/* Create Blog Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Blog Post</DialogTitle>
            <DialogDescription>
              Create a new blog post for the Limpias Technologies website.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  value={formData.content} 
                  onChange={handleInputChange} 
                  rows={10} 
                  required 
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Cover Image URL</Label>
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
              
              {user?.role === 'super_admin' && (
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="approval"
                    checked={formData.isApproved}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isApproved: checked }))}
                  />
                  <Label htmlFor="approval" className="cursor-pointer">Publish immediately</Label>
                </div>
              )}
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
                disabled={createBlogPostMutation.isPending}
              >
                {createBlogPostMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {user?.role === 'super_admin' && formData.isApproved ? 'Create & Publish' : 'Create Post'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Blog Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update the blog post details below.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input 
                  id="edit-title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea 
                  id="edit-content" 
                  name="content" 
                  value={formData.content} 
                  onChange={handleInputChange} 
                  rows={10} 
                  required 
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-imageUrl">Cover Image URL</Label>
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
              
              {user?.role === 'super_admin' && (
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="edit-approval"
                    checked={formData.isApproved}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isApproved: checked }))}
                  />
                  <Label htmlFor="edit-approval" className="cursor-pointer">
                    {formData.isApproved ? 'Published' : 'Publish post'}
                  </Label>
                </div>
              )}
              
              {user?.role !== 'super_admin' && !formData.isApproved && (
                <div className="rounded-md bg-amber-50 p-3 text-amber-800 text-sm">
                  <p className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    This post is pending approval from an administrator.
                  </p>
                </div>
              )}
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
                disabled={updateBlogPostMutation.isPending}
              >
                {updateBlogPostMutation.isPending && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Update Post
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
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {currentBlogPost && (
              <div className="flex items-center">
                <div className="h-12 w-16 mr-3 rounded-md border overflow-hidden">
                  <img 
                    src={currentBlogPost.imageUrl} 
                    alt={currentBlogPost.title} 
                    className="h-full w-full object-cover" 
                  />
                </div>
                <div>
                  <p className="font-bold line-clamp-1">{currentBlogPost.title}</p>
                  <p className="text-sm text-neutral-500">{formatDate(currentBlogPost.createdAt)}</p>
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
              disabled={deleteBlogPostMutation.isPending}
            >
              {deleteBlogPostMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}