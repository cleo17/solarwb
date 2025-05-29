import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/hooks/use-auth';
import { useLocation, useRoute } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, User, Mail, Phone, Lock } from 'lucide-react';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

export default function ProfilePage() {
  const [match, params] = useRoute('/profile');
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Profile state
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      // Initialize profile with user data
      setProfile(prev => ({
        ...prev,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || '',
      }));
    }
  }, [user, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { fullName: string; phone: string }) => {
      const res = await apiRequest('PUT', '/api/profile', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });
  
  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const res = await apiRequest('PUT', '/api/users/password', data);
      return await res.json();
    },
    onSuccess: () => {
      // Clear password fields
      setProfile(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update password',
        variant: 'destructive',
      });
    },
  });
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      fullName: profile.fullName,
      phone: profile.phone,
    });
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profile.newPassword !== profile.confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'The new passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    
    changePasswordMutation.mutate({
      currentPassword: profile.currentPassword,
      newPassword: profile.newPassword,
    });
  };
  
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
        <title>My Profile - Limpias Technologies</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-heading font-bold text-neutral-800 mb-8">My Profile</h1>
          
          <div className="grid gap-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                        <Input
                          id="username"
                          name="username"
                          value={profile.username}
                          disabled
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profile.email}
                          disabled
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                        <Input
                          id="phone"
                          name="phone"
                          value={profile.phone}
                          onChange={handleInputChange}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={profile.currentPassword}
                        onChange={handleInputChange}
                        required
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={profile.newPassword}
                          onChange={handleInputChange}
                          required
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={profile.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {changePasswordMutation.isPending ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
} 