import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/hooks/use-auth';
import { useLocation, useRoute } from 'wouter';
import { useIsMobile } from '@/hooks/use-mobile';
import { useQuery, useMutation } from '@tanstack/react-query';
import Sidebar from '@/components/admin/sidebar';
import Header from '@/components/admin/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Loader2, Save } from 'lucide-react';

export default function AdminSettings() {
  const [match, params] = useRoute('/admin/settings');
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    siteName: 'Limpias Technologies',
    siteDescription: 'Your trusted partner in solar technology solutions',
    contactEmail: 'contact@limpiastech.com',
    contactPhone: '+1234567890',
    maintenanceMode: false,
    enableBlog: true,
    enableShop: true,
  });

  // Fetch settings
  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ['/api/settings'],
    enabled: !!user && user.role === 'super_admin',
    onSuccess: (data) => {
      if (data) {
        setSettings(data);
      }
    },
  });
  
  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: typeof settings) => {
      const res = await apiRequest('PUT', '/api/settings', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: 'Settings saved',
        description: 'Your changes have been saved successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save settings',
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string) => (checked: boolean) => {
    setSettings(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settings);
  };
  
  if (!user || user.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Settings - Limpias Technologies</title>
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
          <Header toggleMobileSidebar={toggleMobileSidebar} pageTitle="Settings" />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <h2 className="text-2xl font-heading font-bold text-neutral-800">Settings</h2>
                  <p className="text-neutral-500">Manage your website settings and preferences</p>
                </div>
                
                <Button 
                  onClick={handleSaveSettings}
                  className="mt-4 md:mt-0"
                  disabled={updateSettingsMutation.isPending}
                >
                  {updateSettingsMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
              
              {/* Settings Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* General Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Basic website information and configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        name="siteName"
                        value={settings.siteName}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="siteDescription">Site Description</Label>
                      <Input
                        id="siteDescription"
                        name="siteDescription"
                        value={settings.siteDescription}
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Primary contact details for your website</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={settings.contactEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        name="contactPhone"
                        value={settings.contactPhone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Features */}
                <Card>
                  <CardHeader>
                    <CardTitle>Features</CardTitle>
                    <CardDescription>Enable or disable website features</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Maintenance Mode</Label>
                        <p className="text-sm text-neutral-500">
                          Enable maintenance mode to temporarily disable the website
                        </p>
                      </div>
                      <Switch
                        checked={settings.maintenanceMode}
                        onCheckedChange={handleSwitchChange('maintenanceMode')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Blog</Label>
                        <p className="text-sm text-neutral-500">
                          Enable the blog section
                        </p>
                      </div>
                      <Switch
                        checked={settings.enableBlog}
                        onCheckedChange={handleSwitchChange('enableBlog')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Shop</Label>
                        <p className="text-sm text-neutral-500">
                          Enable the online shop
                        </p>
                      </div>
                      <Switch
                        checked={settings.enableShop}
                        onCheckedChange={handleSwitchChange('enableShop')}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
} 