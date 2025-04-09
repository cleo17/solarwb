import { useState } from 'react';
import { Link } from 'wouter';
import { User, ShoppingCart, Search, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  
  if (!isOpen) return null;
  
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-neutral-700">
                  <User className="mr-1 h-5 w-5" />
                  <span>Account</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-normal">
                  Signed in as <span className="font-medium">{user.username}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {['super_admin', 'blog_editor', 'sales_manager', 'accountant'].includes(user.role) && (
                  <DropdownMenuItem onSelect={onClose} asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem onSelect={onClose} asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link 
              href="/auth" 
              onClick={onClose}
              className="flex items-center text-neutral-700"
            >
              <User className="mr-1 h-5 w-5" />
              <span>Sign in</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
