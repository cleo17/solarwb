import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CartItem from './cart-item';
import { ShoppingCart, AlertCircle } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadCartItems();
    }
  }, [open]);

  const loadCartItems = () => {
    setIsLoading(true);
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    } else {
      setCartItems([]);
    }
    setIsLoading(false);
  };

  const updateCartItem = (id: number, quantity: number) => {
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeCartItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Your Shopping Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2 h-[calc(100vh-180px)]">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-neutral-100 p-4 rounded-full mb-4">
                <ShoppingCart className="h-10 w-10 text-neutral-400" />
              </div>
              <h3 className="font-heading font-medium text-lg text-neutral-800 mb-2">Your cart is empty</h3>
              <p className="text-neutral-500 text-center mb-4">Looks like you haven't added any products to your cart yet.</p>
              <Button onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4">
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
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <SheetFooter className="border-t p-4">
            <div className="w-full">
              <div className="flex justify-between mb-2">
                <span className="text-neutral-600">Subtotal:</span>
                <span className="font-bold">${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-neutral-600">Estimated Shipping:</span>
                <span className="font-bold">Calculated at checkout</span>
              </div>
              <Separator className="mb-4" />
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold text-primary">${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/cart" onClick={onClose}>
                  <Button className="w-full" variant="outline">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" onClick={onClose}>
                  <Button className="w-full bg-primary hover:bg-primary-dark">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-neutral-500 mt-4 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Shipping and taxes calculated at checkout
              </p>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
