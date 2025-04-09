import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Product } from '@shared/schema';
import ProductCard from '@/components/ui/product-card';
import { ArrowRight, Filter, SortAsc } from 'lucide-react';

export default function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products', { featured: true }],
  });
  
  const categories = [
    'All Categories',
    'Solar Panels',
    'Water Heaters',
    'Water Pumps',
    'Inverters',
    'Batteries'
  ];
  
  const filteredProducts = products?.filter(product => 
    activeCategory === 'All Categories' || product.category === activeCategory
  );
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <span className="text-primary font-medium uppercase tracking-wide">Our Products</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 text-neutral-800">Featured Solar Solutions</h2>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-2">
              <Link href="/products">
                <Button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition duration-300">
                  All Products
                </Button>
              </Link>
              <div className="flex border border-neutral-200 rounded-md overflow-hidden">
                <Button variant="ghost" className="px-3 py-2 hover:bg-neutral-100">
                  <Filter className="h-5 w-5 text-neutral-600" />
                </Button>
                <Button variant="ghost" className="px-3 py-2 hover:bg-neutral-100 border-l border-neutral-200">
                  <SortAsc className="h-5 w-5 text-neutral-600" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Filter Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full ${
                activeCategory === category 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {isLoading ? (
            // Loading placeholders
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm h-[400px] animate-pulse">
                <div className="bg-neutral-200 h-56"></div>
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <div className="bg-neutral-200 h-5 w-20 rounded"></div>
                    <div className="bg-neutral-200 h-5 w-24 rounded"></div>
                  </div>
                  <div className="bg-neutral-200 h-6 w-3/4 rounded mb-2"></div>
                  <div className="bg-neutral-200 h-4 w-full rounded mb-1"></div>
                  <div className="bg-neutral-200 h-4 w-2/3 rounded mb-3"></div>
                  <div className="flex justify-between items-center">
                    <div className="bg-neutral-200 h-6 w-16 rounded"></div>
                    <div className="bg-neutral-200 h-6 w-20 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-4 text-center p-8">
              <p className="text-red-500">Error loading products. Please try again later.</p>
            </div>
          ) : filteredProducts?.length === 0 ? (
            <div className="col-span-4 text-center p-8">
              <p>No products found in this category.</p>
            </div>
          ) : (
            filteredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
        
        <div className="text-center">
          <Link href="/products">
            <Button variant="outline" className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white font-heading font-semibold rounded-md transition duration-300 inline-flex items-center">
              <span>View All Products</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
