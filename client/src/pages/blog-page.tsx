import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { BlogPost } from '@shared/schema';
import BlogCard from '@/components/ui/blog-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Tag } from 'lucide-react';

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [activeTag, setActiveTag] = useState<string>('all');

  // Fetch blog posts
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  // Generate tags based on post content
  // In a real app, you'd have proper tags in your schema
  const extractTags = (posts: BlogPost[] | undefined) => {
    if (!posts || posts.length === 0) return [];
    
    const sampleTags = ['Solar Panels', 'Renewable Energy', 'Water Heaters', 'Maintenance', 'Installation', 'Energy Efficiency'];
    return sampleTags;
  };

  const tags = extractTags(posts);

  // Filter posts based on search term and active tag
  useEffect(() => {
    if (!posts) return;

    let filtered = [...posts];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(term) ||
          post.content.toLowerCase().includes(term)
      );
    }

    // Filter by tag (in a real app, you'd check post.tags)
    if (activeTag !== 'all') {
      // This is a simplified example - in a real app, you'd have a tags field
      filtered = filtered.filter(post => 
        post.content.toLowerCase().includes(activeTag.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, activeTag]);

  return (
    <>
      <Helmet>
        <title>Blog - Limpias Technologies</title>
        <meta name="description" content="Latest insights on solar energy, renewable technology, installation tips, and energy efficiency from Limpias Technologies experts." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-primary text-white py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-4">
                  Solar Energy Insights
                </h1>
                <p className="text-lg mb-0 text-neutral-100">
                  Stay informed with the latest trends, tips, and technologies in the solar energy industry.
                </p>
              </div>
            </div>
          </section>
          
          {/* Blog Content */}
          <section className="py-12 bg-neutral-50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="font-heading font-bold text-xl mb-4 text-neutral-800">Search</h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                      <Input
                        placeholder="Search articles..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="font-heading font-bold text-xl mb-4 text-neutral-800">Categories</h2>
                    <div className="space-y-2">
                      <Button
                        variant={activeTag === 'all' ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTag('all')}
                      >
                        <Tag className="mr-2 h-4 w-4" /> All Topics
                      </Button>
                      
                      {tags.map((tag, index) => (
                        <Button
                          key={index}
                          variant={activeTag === tag ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => setActiveTag(tag)}
                        >
                          <Tag className="mr-2 h-4 w-4" /> {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="font-heading font-bold text-xl mb-4 text-neutral-800">Recent Posts</h2>
                    {posts?.slice(0, 3).map(post => (
                      <div key={post.id} className="mb-4 pb-4 border-b border-neutral-100 last:border-0 last:mb-0 last:pb-0">
                        <a href={`/blog/${post.id}`} className="font-medium hover:text-primary transition-colors">
                          {post.title}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Blog Posts */}
                <div className="lg:col-span-3">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />
                      <span className="ml-2 text-lg">Loading articles...</span>
                    </div>
                  ) : error ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow-md">
                      <h3 className="text-xl font-medium text-red-600 mb-2">Error loading blog posts</h3>
                      <p className="text-neutral-600 mb-6">Please try again later or contact support if the problem persists.</p>
                    </div>
                  ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-lg shadow-md">
                      <h3 className="text-xl font-medium text-neutral-800 mb-2">No posts found</h3>
                      <p className="text-neutral-600 mb-6">Try adjusting your search or browse all topics.</p>
                      <Button onClick={() => {setSearchTerm(''); setActiveTag('all');}}>Clear Filters</Button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <h2 className="font-heading font-bold text-2xl text-neutral-800">
                          {activeTag === 'all' ? 'All Articles' : activeTag}
                        </h2>
                        <p className="text-neutral-600">{filteredPosts.length} articles found</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map(post => (
                          <BlogCard key={post.id} post={post} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
