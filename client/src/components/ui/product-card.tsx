import { useState } from 'react';
import { Link } from 'wouter';
import { Heart, ShoppingCart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItem = existingCart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      // Update quantity
      existingItem.quantity += 1;
    } else {
      // Add new item
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  return (
    <div 
      className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden h-56">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : ''}`}
          />
          <div className="absolute top-4 right-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="w-8 h-8 rounded-full bg-white shadow"
            >
              <Heart className="h-4 w-4 text-neutral-500" />
            </Button>
          </div>
          <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex justify-between">
              <Button 
                size="sm" 
                onClick={handleAddToCart}
                className="bg-primary text-white hover:bg-primary-dark"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white text-neutral-800"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Details
              </Button>
            </div>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <Badge variant="outline" className="text-xs text-primary font-medium uppercase">
            {product.category}
          </Badge>
          <div className="flex items-center text-amber-400">
            {Array(5).fill(0).map((_, i) => (
              <svg 
                key={i} 
                className={`h-4 w-4 fill-current ${i < 4 ? 'text-amber-400' : 'text-neutral-300'}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-heading font-semibold text-lg mb-1 text-neutral-800 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="font-heading font-bold text-lg text-neutral-800">
            ${product.price.toFixed(2)}
          </span>
          <Badge className={`${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {product.stock > 10 ? 'In Stock' : 'Low Stock'}
          </Badge>
        </div>
      </div>
    </div>
  );
}
