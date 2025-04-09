import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Share2, ArrowLeft, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@shared/schema';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch product details
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });

  // If the ID is invalid (not a number), redirect to products page
  useEffect(() => {
    if (isNaN(Number(id))) {
      navigate('/products');
    }
  }, [id, navigate]);

  // Handle quantity changes
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Add to cart function
  const handleAddToCart = () => {
    if (!product) return;

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };

  // If loading, show loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mr-2" />
          <span className="text-lg">Loading product details...</span>
        </div>
        <Footer />
      </>
    );
  }

  // If error, show error state
  if (error || !product) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-700 mb-2">Product Not Found</h2>
            <p className="text-red-600 mb-6">The product you are looking for is not available or may have been removed.</p>
            <Button onClick={() => navigate('/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Products
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Set multiple images (using product image plus 2 additional ones for the gallery)
  const productImages = [
    product.imageUrl,
    // Additional dummy images for the gallery, in a real app you'd have multiple images per product
    'https://images.unsplash.com/photo-1502628467446-d0f5d0e83f3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <>
      <Helmet>
        <title>{product.name} - Limpias Technologies</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow bg-neutral-50 py-12">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-neutral-600 mb-6">
              <Button variant="link" className="p-0 mr-2" onClick={() => navigate('/products')}>
                Products
              </Button>
              <span className="mx-2">/</span>
              <Button variant="link" className="p-0 mr-2" onClick={() => navigate(`/products?category=${encodeURIComponent(product.category)}`)}>
                {product.category}
              </Button>
              <span className="mx-2">/</span>
              <span className="text-neutral-500 truncate">{product.name}</span>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="h-80 md:h-96 overflow-hidden rounded-lg bg-neutral-100">
                    <img
                      src={productImages[activeImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex space-x-2">
                    {productImages.map((img, idx) => (
                      <button
                        key={idx}
                        className={`h-20 w-20 rounded-md overflow-hidden ${
                          activeImageIndex === idx ? 'ring-2 ring-primary' : 'ring-1 ring-neutral-200'
                        }`}
                        onClick={() => setActiveImageIndex(idx)}
                      >
                        <img
                          src={img}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div>
                  <div className="mb-2">
                    <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded">
                      {product.category}
                    </span>
                    {product.featured && (
                      <span className="bg-secondary/10 text-secondary text-xs font-medium px-2.5 py-0.5 rounded ml-2">
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="font-heading font-bold text-2xl md:text-3xl text-neutral-800 mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center text-amber-400 mr-2">
                      {Array(5).fill(0).map((_, i) => (
                        <svg 
                          key={i} 
                          className={`h-5 w-5 fill-current ${i < 4 ? 'text-amber-400' : 'text-neutral-300'}`} 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-neutral-500 text-sm">(16 reviews)</span>
                  </div>
                  <p className="text-neutral-600 mb-6">
                    {product.description}
                  </p>
                  <div className="text-3xl font-bold text-primary mb-6">
                    ${product.price.toFixed(2)}
                  </div>

                  <Separator className="my-6" />

                  {/* Availability */}
                  <div className="flex items-center mb-6">
                    <span className="text-neutral-700 font-medium mr-2">Availability:</span>
                    {product.stock > 0 ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        {product.stock > 10 ? 'In Stock' : 'Low Stock'}
                      </span>
                    ) : (
                      <span className="text-red-500">Out of Stock</span>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center mb-6">
                    <span className="text-neutral-700 font-medium mr-4">Quantity:</span>
                    <div className="flex items-center border border-neutral-300 rounded-md">
                      <button
                        className="px-3 py-1 border-r border-neutral-300 text-neutral-600 hover:bg-neutral-100"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-1">{quantity}</span>
                      <button
                        className="px-3 py-1 border-l border-neutral-300 text-neutral-600 hover:bg-neutral-100"
                        onClick={increaseQuantity}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary-dark"
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" className="px-4">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" className="px-4">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Tabs */}
              <div className="mt-12">
                <Tabs defaultValue="details">
                  <TabsList className="w-full justify-start border-b rounded-none">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="pt-6">
                    <h3 className="font-heading font-bold text-xl mb-4 text-neutral-800">Product Details</h3>
                    <p className="text-neutral-600 mb-4">
                      {product.description}
                    </p>
                    <p className="text-neutral-600 mb-4">
                      This high-quality solar product is designed to maximize efficiency and durability in various 
                      weather conditions. Manufactured with premium materials and backed by our comprehensive 
                      warranty, it provides reliable performance year after year.
                    </p>
                    <p className="text-neutral-600">
                      Our products are tested to meet and exceed industry standards, ensuring you get the 
                      best value for your investment in renewable energy.
                    </p>
                  </TabsContent>
                  <TabsContent value="specifications" className="pt-6">
                    <h3 className="font-heading font-bold text-xl mb-4 text-neutral-800">Technical Specifications</h3>
                    <div className="overflow-hidden border border-neutral-200 rounded-lg">
                      <table className="min-w-full divide-y divide-neutral-200">
                        <tbody className="divide-y divide-neutral-200">
                          {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                            <tr key={key}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-800 bg-neutral-50 w-1/3">
                                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                {value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  <TabsContent value="reviews" className="pt-6">
                    <h3 className="font-heading font-bold text-xl mb-4 text-neutral-800">Customer Reviews</h3>
                    
                    {/* Sample Review */}
                    <div className="border-b border-neutral-200 pb-6 mb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center text-amber-400 mr-2">
                          {Array(5).fill(0).map((_, i) => (
                            <svg 
                              key={i} 
                              className={`h-4 w-4 fill-current ${i < 5 ? 'text-amber-400' : 'text-neutral-300'}`} 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                        <h4 className="font-heading font-semibold text-neutral-800">Excellent product</h4>
                      </div>
                      <p className="text-neutral-500 text-sm mb-2">
                        By John D. on June 15, 2023
                      </p>
                      <p className="text-neutral-600">
                        This solar panel has exceeded my expectations. The installation was straightforward, and it's been performing exceptionally well even during cloudy days. Highly recommended for anyone looking to switch to solar energy.
                      </p>
                    </div>
                    
                    <div className="border-b border-neutral-200 pb-6 mb-6">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center text-amber-400 mr-2">
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
                        <h4 className="font-heading font-semibold text-neutral-800">Great value for money</h4>
                      </div>
                      <p className="text-neutral-500 text-sm mb-2">
                        By Sarah M. on May 22, 2023
                      </p>
                      <p className="text-neutral-600">
                        I've been using this product for about a month now and I'm very satisfied with the performance. The energy output is consistent and it has already made a noticeable difference in my electricity bill.
                      </p>
                    </div>
                    
                    <Button variant="outline">Load More Reviews</Button>
                  </TabsContent>
                </Tabs>
              </div>

              {/* FAQs */}
              <div className="mt-12">
                <h3 className="font-heading font-bold text-xl mb-4 text-neutral-800">Frequently Asked Questions</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is the warranty period for this product?</AccordionTrigger>
                    <AccordionContent>
                      This product comes with a 25-year performance warranty and a 10-year product warranty, ensuring long-term reliability and peace of mind for your investment.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Is installation included with the purchase?</AccordionTrigger>
                    <AccordionContent>
                      Installation is not included in the base price. However, we offer professional installation services that can be added to your order during checkout. Our certified technicians ensure proper setup for optimal performance.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>What maintenance is required?</AccordionTrigger>
                    <AccordionContent>
                      Minimal maintenance is required. We recommend occasional cleaning to remove dust and debris to maintain optimal performance. For detailed maintenance guidelines, please refer to the product manual.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Can I return the product if I'm not satisfied?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we offer a 30-day return policy for unopened products in their original packaging. For opened products, please contact our customer service team to discuss your specific situation.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
