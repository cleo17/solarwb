import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
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
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { insertOrderSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { Home, CreditCard, Smartphone, Loader2, ShoppingBag, Check } from 'lucide-react';

interface CartItemType {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

// Extend the order schema for the form
const checkoutFormSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  paymentMethod: z.enum(['card', 'paypal', 'mpesa']),
  saveInfo: z.boolean().default(false),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      toast({
        title: "Authentication required",
        description: "Please sign in to proceed with checkout",
        variant: "destructive",
      });
      navigate('/auth');
    }
  }, [user, isLoading, navigate, toast]);
  
  // Load cart items from localStorage
  useEffect(() => {
    setIsLoading(true);
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      if (parsedCart.length === 0) {
        navigate('/cart');
        toast({
          title: "Empty cart",
          description: "Your cart is empty. Add some products before checking out.",
        });
      } else {
        setCartItems(parsedCart);
      }
    } else {
      navigate('/cart');
    }
    setIsLoading(false);
  }, [navigate, toast]);
  
  // Initialize form with default values
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'Kenya',
      paymentMethod: 'card',
      saveInfo: false,
      notes: '',
    },
  });
  
  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Calculate shipping (example flat rate)
  const calculateShipping = () => {
    return 15.00;
  };
  
  // Calculate tax (example rate)
  const calculateTax = () => {
    return calculateSubtotal() * 0.16; // 16% VAT
  };
  
  // Calculate total
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };
  
  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your order",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare order data
      const orderData = {
        userId: user.id,
        status: 'pending',
        total: calculateTotal(),
        shippingAddress: {
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        },
        paymentMethod: data.paymentMethod,
        paymentStatus: 'pending',
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      // Submit order to API
      await apiRequest('POST', '/api/orders', orderData);
      
      // Clear cart after successful order
      localStorage.setItem('cart', JSON.stringify([]));
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Show success message
      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
      });
      
      // Set order complete to show success page
      setOrderComplete(true);
    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: "Order failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mr-2" />
          <span className="text-lg">Loading checkout...</span>
        </div>
        <Footer />
      </>
    );
  }
  
  // If order is complete, show success page
  if (orderComplete) {
    return (
      <>
        <Helmet>
          <title>Order Confirmation - Limpias Technologies</title>
          <meta name="description" content="Thank you for your order with Limpias Technologies. Your solar energy solution is on its way!" />
        </Helmet>
        
        <div className="flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-grow py-12 bg-neutral-50">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="font-heading font-bold text-3xl mb-4 text-neutral-800">Order Confirmed!</h1>
                <p className="text-neutral-600 mb-6">
                  Thank you for your purchase. We've received your order and will begin processing it right away.
                </p>
                <p className="text-neutral-600 mb-8">
                  A confirmation email has been sent to your email address with the order details.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-primary hover:bg-primary-dark" onClick={() => navigate('/')}>
                    Return to Home
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/products')}>
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Checkout - Limpias Technologies</title>
        <meta name="description" content="Complete your purchase of solar products from Limpias Technologies. Secure checkout process with multiple payment options." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-12 bg-neutral-50">
          <div className="container mx-auto px-4">
            <h1 className="font-heading font-bold text-3xl mb-8 text-neutral-800">Checkout</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Contact Information */}
                      <div>
                        <h2 className="font-heading font-bold text-xl mb-4 text-neutral-800 flex items-center">
                          <Home className="mr-2 h-5 w-5 text-primary" />
                          Contact Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your first name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your last name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email*</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter your email" 
                                    type="email" 
                                    {...field} 
                                    disabled={!!user?.email}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Shipping Address */}
                      <div>
                        <h2 className="font-heading font-bold text-xl mb-4 text-neutral-800 flex items-center">
                          <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
                          Shipping Address
                        </h2>
                        
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="mb-6">
                              <FormLabel>Street Address*</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your street address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your city" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postal Code*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your postal code" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your country" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Kenya">Kenya</SelectItem>
                                    <SelectItem value="Tanzania">Tanzania</SelectItem>
                                    <SelectItem value="Uganda">Uganda</SelectItem>
                                    <SelectItem value="Rwanda">Rwanda</SelectItem>
                                    <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Payment Method */}
                      <div>
                        <h2 className="font-heading font-bold text-xl mb-4 text-neutral-800 flex items-center">
                          <CreditCard className="mr-2 h-5 w-5 text-primary" />
                          Payment Method
                        </h2>
                        
                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="space-y-4"
                                >
                                  <div className="flex items-center space-x-2 border border-neutral-200 p-4 rounded-md hover:bg-neutral-50">
                                    <RadioGroupItem value="card" id="card" />
                                    <label htmlFor="card" className="flex items-center space-x-2 cursor-pointer flex-1">
                                      <CreditCard className="h-5 w-5 text-neutral-600" />
                                      <div>
                                        <span className="font-medium text-neutral-800">Credit/Debit Card</span>
                                        <p className="text-sm text-neutral-500">Pay securely using your card</p>
                                      </div>
                                    </label>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2 border border-neutral-200 p-4 rounded-md hover:bg-neutral-50">
                                    <RadioGroupItem value="paypal" id="paypal" />
                                    <label htmlFor="paypal" className="flex items-center space-x-2 cursor-pointer flex-1">
                                      <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9.351 5.008c-1.262.129-2.294 1.53-2.294 3.148 0 1.94 1.377 3.096 3.214 3.096.192 0 .381-.022.583-.055-.256.501-.28 1.07-.016 1.75.357.94 1.366 1.563 2.439 1.563h.96v-.003h.414l.1-.406c.351-1.426-.189-2.15-1.364-2.15h-.716c-.306 0-.367-.245-.229-.81l.059-.231.027-.107.359-1.451c.062-.246.275-.594.491-.594h.234l.262-1.061c.22-.874.041-1.47-.515-1.82-.366-.233-.943-.293-1.425-.293-.908.001-1.742.22-2.583.424zM5.36 3.97L3.11 13.693c-.094.418.115.76.537.76h1.688l.288-1.162c.114-.99.686-1.793 1.598-1.793h.701L9.088 5.93c-1.027.222-2.444.36-3.23.36-.208 0-.399-.005-.498-.014V3.971zm6.902 0v2.306c-.09.01-.19.014-.297.014-.353 0-.86-.03-1.354-.086l-1.13 4.656 1.744-.024c.266-.926.793-1.367 1.554-1.367h.673L14.55 3.97h-2.288zM18 9.33c-.8 0-1.313.594-1.556 1.381h-.649c-.24 0-.413.253-.31.521l1.099 2.849c.12.348.446.348.516-.21.24-1.231.887-3.241 2.316-3.241.441 0 .8.259.8.751 0 .261-.1.511-.174.751h.649c.24 0 .385-.222.362-.453C21.022 10.541 19.813 9.33 18 9.33z"/>
                                      </svg>
                                      <div>
                                        <span className="font-medium text-neutral-800">PayPal</span>
                                        <p className="text-sm text-neutral-500">Pay using your PayPal account</p>
                                      </div>
                                    </label>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2 border border-neutral-200 p-4 rounded-md hover:bg-neutral-50">
                                    <RadioGroupItem value="mpesa" id="mpesa" />
                                    <label htmlFor="mpesa" className="flex items-center space-x-2 cursor-pointer flex-1">
                                      <Smartphone className="h-5 w-5 text-green-600" />
                                      <div>
                                        <span className="font-medium text-neutral-800">M-Pesa</span>
                                        <p className="text-sm text-neutral-500">Pay using M-Pesa mobile money</p>
                                      </div>
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Additional Information */}
                      <div>
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Order Notes (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Special instructions for delivery or installation" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="saveInfo"
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
                                Save my information for future orders
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary-dark"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Complete Order
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                  <h2 className="font-heading font-bold text-xl mb-6 text-neutral-800">Order Summary</h2>
                  
                  <div className="max-h-80 overflow-y-auto mb-6">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex py-3 border-b border-neutral-100 last:border-0">
                        <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                          <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-3 flex-grow">
                          <h4 className="font-medium text-neutral-800 line-clamp-1">{item.name}</h4>
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Qty: {item.quantity}</span>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Subtotal:</span>
                      <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Shipping:</span>
                      <span className="font-medium">${calculateShipping().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Tax (16%):</span>
                      <span className="font-medium">${calculateTax().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-heading font-bold text-xl text-neutral-800">Total:</span>
                    <span className="font-heading font-bold text-xl text-primary">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-neutral-500">
                    <p>* Shipping and taxes are calculated based on your location.</p>
                    <p>* Payment will be processed securely.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
