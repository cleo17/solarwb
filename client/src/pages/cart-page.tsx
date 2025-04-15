import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import CartItem from '@/components/cart/cart-item';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { ShoppingCart, Trash2, ArrowLeft, ArrowRight, RefreshCcw } from 'lucide-react';

interface CartItemType {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export default function CartPage() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Load cart items from localStorage
  useEffect(() => {
    setIsLoading(true);
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    setIsLoading(false);
  }, []);
  
  // Update cart item
  const updateCartItem = (id: number, quantity: number) => {
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };
  
  // Remove cart item
  const removeCartItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };
  
  // Apply coupon code
  const applyCoupon = () => {
    // In a real application, this would make an API call to validate the coupon
    if (couponCode.toLowerCase() === 'solar10') {
      toast({
        title: "Coupon applied",
        description: "You received a 10% discount on your order!",
      });
    } else {
      toast({
        title: "Invalid coupon",
        description: "The coupon code you entered is invalid or expired.",
        variant: "destructive",
      });
    }
  };
  
  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Calculate total
  // For this example, we'll just add a flat shipping fee
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal;
  };
  
  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to complete your purchase.",
        variant: "destructive",
      });
      navigate('/auth');
    } else {
      navigate('/checkout');
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Shopping Cart - Limpias Technologies</title>
        <meta name="description" content="Review your shopping cart and proceed to checkout to purchase solar products from Limpias Technologies." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-12 bg-neutral-50">
          <div className="container mx-auto px-4">
            <h1 className="font-heading font-bold text-3xl mb-8 text-neutral-800">Shopping Cart</h1>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading your cart...</span>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="bg-neutral-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="h-10 w-10 text-neutral-400" />
                </div>
                <h2 className="font-heading text-2xl font-bold mb-4 text-neutral-800">Your cart is empty</h2>
                <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                  Looks like you haven't added any products to your cart yet. Explore our products and find the perfect solar solution for your needs.
                </p>
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary-dark">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="overflow-x-auto">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="font-heading font-bold text-xl text-neutral-800">
                          Cart Items ({cartItems.length})
                        </h2>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={clearCart}
                          className="text-neutral-600 hover:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Clear Cart
                        </Button>
                      </div>
                      
                      <Separator className="mb-6" />
                      
                      {cartItems.map(item => (
                        <CartItem
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          price={item.price}
                          imageUrl={item.imageUrl}
                          quantity={item.quantity}
                          onUpdateQuantity={updateCartItem}
                          onRemove={removeCartItem}
                        />
                      ))}
                    </div>
                    
                    <div className="mt-8">
                      <Link href="/products">
                        <Button variant="outline" className="flex items-center">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="font-heading font-bold text-xl mb-6 text-neutral-800">Order Summary</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Subtotal:</span>
                        <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Shipping:</span>
                        <span className="font-medium">Calculated at checkout</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Tax:</span>
                        <span className="font-medium">Calculated at checkout</span>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-heading font-bold text-xl text-neutral-800">Total:</span>
                      <span className="font-heading font-bold text-xl text-primary">
                        KES {(calculateTotal() * 130).toFixed(2)}
                      </span>
                    </div>
                    
                    {/* Coupon Code */}
                    <div className="mb-6">
                      <h3 className="font-medium mb-2 text-neutral-800">Coupon Code</h3>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <Button variant="outline" onClick={applyCoupon}>
                          Apply
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-primary hover:bg-primary-dark mb-4"
                      onClick={handleProceedToCheckout}
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    
                    <div className="text-sm text-neutral-500 text-center">
                      By proceeding to checkout, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                    </div>
                  </div>
                  
                  {/* Payment Options */}
                  <div className="mt-4 bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-medium mb-4 text-neutral-800">We Accept</h3>
                    <div className="flex flex-wrap gap-2">
                      <div className="h-8 w-12 bg-neutral-100 rounded flex items-center justify-center">
                        <span className="text-xs font-medium">Visa</span>
                      </div>
                      <div className="h-8 w-12 bg-neutral-100 rounded flex items-center justify-center">
                        <span className="text-xs font-medium">MC</span>
                      </div>
                      <div className="h-8 w-12 bg-neutral-100 rounded flex items-center justify-center">
                        <span className="text-xs font-medium">PayPal</span>
                      </div>
                      <div className="h-8 w-12 bg-neutral-100 rounded flex items-center justify-center">
                        <span className="text-xs font-medium">MPesa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
