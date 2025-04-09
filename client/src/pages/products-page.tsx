import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ProductCard from '@/components/ui/product-card';
import { Product } from '@shared/schema';
import { Loader2, Search, Filter, X } from 'lucide-react';

export default function ProductsPage() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Get category from URL query params if present
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location]);

  // Fetch all products
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Filter and sort products based on search, category, and sort option
  useEffect(() => {
    if (!products) return;

    let result = [...products];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Sort by selected option
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'featured':
      default:
        // Sort by featured
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, sortOption]);

  // Extract unique categories from products
  const categories = products
    ? Array.from(new Set(products.map(product => product.category)))
    : [];

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortOption('featured');
  };

  return (
    <>
      <Helmet>
        <title>Solar Products - Limpias Technologies</title>
        <meta
          name="description"
          content="Shop solar panels, inverters, water heaters, water pumps, and more. High-quality solar products for homes and businesses."
        />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-primary text-white py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-4">
                  Solar Products
                </h1>
                <p className="text-lg mb-0 text-neutral-100">
                  Explore our range of high-quality solar energy products for homes and businesses.
                </p>
              </div>
            </div>
          </section>

          {/* Products Section */}
          <section className="py-12 bg-neutral-50">
            <div className="container mx-auto px-4">
              {/* Search and Filter */}
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                    <Input
                      placeholder="Search products..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="name-asc">Name: A to Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Active filters */}
                {(searchTerm || selectedCategory || sortOption) && (
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-neutral-200">
                    <Filter className="text-neutral-500 mr-1" size={16} />
                    <span className="text-sm text-neutral-500">Active filters:</span>
                    
                    {searchTerm && (
                      <div className="bg-neutral-100 text-neutral-800 text-sm py-1 px-3 rounded-full flex items-center">
                        Search: {searchTerm}
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="ml-2 text-neutral-500 hover:text-neutral-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    
                    {selectedCategory && (
                      <div className="bg-neutral-100 text-neutral-800 text-sm py-1 px-3 rounded-full flex items-center">
                        Category: {selectedCategory}
                        <button 
                          onClick={() => setSelectedCategory('all')}
                          className="ml-2 text-neutral-500 hover:text-neutral-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    
                    {sortOption && (
                      <div className="bg-neutral-100 text-neutral-800 text-sm py-1 px-3 rounded-full flex items-center">
                        Sort: {sortOption.replace('-', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())}
                        <button 
                          onClick={() => setSortOption('featured')}
                          className="ml-2 text-neutral-500 hover:text-neutral-700"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleClearFilters}
                      className="ml-auto text-primary"
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </div>

              {/* Products Grid */}
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <span className="ml-2 text-lg">Loading products...</span>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <h3 className="text-lg font-medium text-red-600 mb-2">Error loading products</h3>
                  <p className="text-neutral-600">Please try again later or contact support if the problem persists.</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-md">
                  <h3 className="text-xl font-medium text-neutral-800 mb-2">No products found</h3>
                  <p className="text-neutral-600 mb-6">Try adjusting your search criteria or browse all products.</p>
                  <Button onClick={handleClearFilters}>Clear Filters</Button>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex justify-between items-center">
                    <p className="text-neutral-600">{filteredProducts.length} products found</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
