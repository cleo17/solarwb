import { useState } from 'react';
import { Link } from 'wouter';
import { User, ShoppingCart, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { path: string; label: string }[];
  currentPath: string;
  cartItemCount: number;
  onOpenCart: () => void;
}

export default function MobileMenu({ 
  isOpen, 
  onClose, 
  navLinks, 
  currentPath,
  cartItemCount,
  onOpenCart
}: MobileMenuProps) {
  const { user, logoutMutation } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  if (!isOpen) return null;
  
  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };
  
  return (
    <div className="md:hidden bg-white border-t">
      <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
        {navLinks.map((link) => (
          <Link 
            key={link.path} 
            href={link.path}
            onClick={onClose}
            className={`font-heading font-medium py-2 border-b border-neutral-100 ${
              currentPath === link.path ? 'text-primary' : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
        
        <div className="flex justify-between py-2 border-t border-neutral-100 mt-2">
          <button className="flex items-center text-neutral-700">
            <Search className="mr-1 h-5 w-5" />
            <span>Search</span>
          </button>
          
          <button 
            className="flex items-center text-neutral-700 relative"
            onClick={onOpenCart}
          >
            <ShoppingCart className="mr-1 h-5 w-5" />
            <span>Cart</span>
            {cartItemCount > 0 && (
              <Badge 
                className="ml-1 bg-secondary hover:bg-secondary text-white h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
              >
                {cartItemCount}
              </Badge>
            )}
          </button>
          
          <div className="relative">
            <button 
              className="flex items-center text-neutral-700"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <User className="mr-1 h-5 w-5" />
              <span>Account</span>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-neutral-700 border-b border-neutral-100">
                      Signed in as <span className="font-medium">{user.username}</span>
                    </div>
                    
                    {['super_admin', 'blog_editor', 'sales_manager', 'accountant'].includes(user.role) && (
                      <Link 
                        href="/admin" 
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={onClose}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <Link 
                      href="/orders" 
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      onClick={onClose}
                    >
                      My Orders
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link 
                    href="/auth" 
                    className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    onClick={onClose}
                  >
                    Sign in / Register
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
