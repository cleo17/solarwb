import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { SunMedium, Loader2, User, Lock, Mail, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Registration form schema
const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(2, 'Full name is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('login');
  
  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Get tab from URL if provided
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const tab = params.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    }
  }, [location]);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      phone: '',
      agreeTerms: false,
    },
  });
  
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };
  
  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { agreeTerms, ...registrationData } = data;
    registerMutation.mutate(registrationData);
  };
  
  return (
    <>
      <Helmet>
        <title>Sign In / Register - Limpias Technologies</title>
        <meta name="description" content="Sign in to your account or register to shop solar panels, water heaters, and more from Limpias Technologies." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-12 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Hero Section */}
              <div className="hidden lg:block rounded-lg overflow-hidden relative h-auto">
                <div className="absolute inset-0 bg-primary/90 z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
                  alt="Solar panels" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-center p-12 text-white">
                  <div className="flex items-center mb-6">
                    <SunMedium className="h-12 w-12 text-white mr-4" />
                    <h2 className="font-heading font-bold text-3xl">
                      Limpias<span className="text-secondary">Tech</span>
                    </h2>
                  </div>
                  <h1 className="font-heading font-bold text-3xl mb-4">Welcome to Limpias Technologies</h1>
                  <p className="text-lg mb-6">
                    Join us in our mission to provide sustainable solar energy solutions for homes and businesses across East Africa.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-white/20 rounded-full p-1 mr-3">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p>Access to exclusive deals and promotions</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-white/20 rounded-full p-1 mr-3">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p>Easy order tracking and management</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-white/20 rounded-full p-1 mr-3">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p>Personalized solar energy solutions</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Auth Forms */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login" className="text-base">Sign In</TabsTrigger>
                    <TabsTrigger value="register" className="text-base">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <div className="text-center mb-6">
                      <h1 className="font-heading font-bold text-2xl text-neutral-800">Sign In to Your Account</h1>
                      <p className="text-neutral-600 mt-2">
                        Welcome back! Enter your credentials to access your account.
                      </p>
                    </div>
                    
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username or Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                                    <User className="h-5 w-5" />
                                  </span>
                                  <Input
                                    placeholder="Enter your username or email"
                                    className="pl-10"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex justify-between items-center">
                                <FormLabel>Password</FormLabel>
                                <a href="#" className="text-sm font-medium text-primary hover:underline">
                                  Forgot password?
                                </a>
                              </div>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                                    <Lock className="h-5 w-5" />
                                  </span>
                                  <Input
                                    type="password"
                                    placeholder="••••••••••"
                                    className="pl-10"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex items-center">
                          <Checkbox id="remember-me" />
                          <label htmlFor="remember-me" className="ml-2 text-sm text-neutral-600">
                            Remember me for 30 days
                          </label>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary-dark"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing In...
                            </>
                          ) : (
                            'Sign In'
                          )}
                        </Button>
                      </form>
                    </Form>
                    
                    <div className="mt-6 text-center">
                      <p className="text-neutral-600">
                        Don't have an account?{' '}
                        <button
                          onClick={() => setActiveTab('register')}
                          className="text-primary font-medium hover:underline"
                        >
                          Register now
                        </button>
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <div className="text-center mb-6">
                      <h1 className="font-heading font-bold text-2xl text-neutral-800">Create Your Account</h1>
                      <p className="text-neutral-600 mt-2">
                        Join Limpias Technologies and start your solar energy journey.
                      </p>
                    </div>
                    
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                        <FormField
                          control={registerForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                                    <User className="h-5 w-5" />
                                  </span>
                                  <Input
                                    placeholder="Enter your full name"
                                    className="pl-10"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                                      <UserPlus className="h-5 w-5" />
                                    </span>
                                    <Input
                                      placeholder="Choose a username"
                                      className="pl-10"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                                      <Mail className="h-5 w-5" />
                                    </span>
                                    <Input
                                      placeholder="Enter your email"
                                      type="email"
                                      className="pl-10"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={registerForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your phone number"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                                      <Lock className="h-5 w-5" />
                                    </span>
                                    <Input
                                      type="password"
                                      placeholder="••••••••••"
                                      className="pl-10"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                                      <Lock className="h-5 w-5" />
                                    </span>
                                    <Input
                                      type="password"
                                      placeholder="••••••••••"
                                      className="pl-10"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={registerForm.control}
                          name="agreeTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                                </FormLabel>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary-dark"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            'Create Account'
                          )}
                        </Button>
                      </form>
                    </Form>
                    
                    <div className="mt-6 text-center">
                      <p className="text-neutral-600">
                        Already have an account?{' '}
                        <button
                          onClick={() => setActiveTab('login')}
                          className="text-primary font-medium hover:underline"
                        >
                          Sign in
                        </button>
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
