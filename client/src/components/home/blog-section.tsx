import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@shared/schema';
import BlogCard from '@/components/ui/blog-card';
import { ArrowRight } from 'lucide-react';

export default function BlogSection() {
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });
  
  // Get the latest 3 posts
  const latestPosts = posts?.slice(0, 3);
  
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <span className="text-primary font-medium uppercase tracking-wide">Our Blog</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 text-neutral-800">Latest Solar Insights</h2>
          </div>
          <Link href="/blog">
            <Button variant="link" className="mt-4 md:mt-0 text-primary hover:text-primary-dark">
              <span>View All Posts</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading placeholders
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden h-[400px] animate-pulse">
                <div className="bg-neutral-200 h-48"></div>
                <div className="p-6">
                  <div className="bg-neutral-200 h-4 w-1/2 rounded mb-3"></div>
                  <div className="bg-neutral-200 h-6 w-3/4 rounded mb-3"></div>
                  <div className="bg-neutral-200 h-4 w-full rounded mb-1"></div>
                  <div className="bg-neutral-200 h-4 w-full rounded mb-1"></div>
                  <div className="bg-neutral-200 h-4 w-2/3 rounded mb-4"></div>
                  <div className="bg-neutral-200 h-4 w-1/4 rounded"></div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-3 text-center p-8">
              <p className="text-red-500">Error loading blog posts. Please try again later.</p>
            </div>
          ) : latestPosts?.length === 0 ? (
            <div className="col-span-3 text-center p-8">
              <p>No blog posts available yet.</p>
            </div>
          ) : (
            latestPosts?.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
