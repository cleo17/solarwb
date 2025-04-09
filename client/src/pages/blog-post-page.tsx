import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BlogPost } from '@shared/schema';
import { Loader2, Calendar, User, ArrowLeft, Facebook, Twitter, Linkedin, Mail, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPostPage() {
  const { id } = useParams();
  const [location, navigate] = useLocation();
  
  // Fetch blog post details
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: [`/api/blog-posts/${id}`],
  });
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mr-2" />
          <span className="text-lg">Loading article...</span>
        </div>
        <Footer />
      </>
    );
  }
  
  // If error or no post, show error state
  if (error || !post) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-bold text-red-700 mb-2">Article Not Found</h2>
            <p className="text-red-600 mb-6">The article you are looking for is not available or may have been removed.</p>
            <Button onClick={() => navigate('/blog')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Blog
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  // Format date for display
  const formattedDate = format(new Date(post.createdAt), 'MMMM dd, yyyy');
  
  return (
    <>
      <Helmet>
        <title>{post.title} - Limpias Technologies Blog</title>
        <meta name="description" content={post.content.substring(0, 160)} />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          {/* Featured Image */}
          <div className="w-full h-64 sm:h-80 md:h-96 bg-neutral-200 relative">
            <img
              src={post.imageUrl || 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
          </div>
          
          {/* Article Content */}
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
              {/* Breadcrumb */}
              <div className="flex items-center text-sm text-neutral-600 mb-6">
                <Button variant="link" className="p-0 mr-2" onClick={() => navigate('/blog')}>
                  Blog
                </Button>
                <span className="mx-2">/</span>
                <span className="text-neutral-500 truncate">{post.title}</span>
              </div>
              
              {/* Title & Meta */}
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-neutral-800 mb-4">
                {post.title}
              </h1>
              
              <div className="flex items-center text-neutral-500 text-sm mb-6">
                <div className="flex items-center mr-4">
                  <Calendar className="mr-1 h-4 w-4 text-primary" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4 text-primary" />
                  <span>Admin</span>
                </div>
              </div>
              
              <Separator className="mb-8" />
              
              {/* Article Body */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="lead text-lg text-neutral-700 font-medium mb-6">
                  {post.content.split('.')[0]}.
                </p>
                
                {post.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-6 text-neutral-600">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <span className="text-neutral-700 font-medium">Tags:</span>
                <Button variant="outline" size="sm" className="rounded-full">Solar Energy</Button>
                <Button variant="outline" size="sm" className="rounded-full">Renewable</Button>
                <Button variant="outline" size="sm" className="rounded-full">Tips</Button>
              </div>
              
              {/* Social Share */}
              <div className="flex items-center mb-8">
                <span className="text-neutral-700 font-medium mr-4">Share:</span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Separator className="mb-8" />
              
              {/* Author Info */}
              <div className="bg-neutral-50 p-6 rounded-lg mb-12">
                <div className="flex items-center">
                  <Avatar className="h-14 w-14 mr-4">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Author" />
                    <AvatarFallback>AU</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-neutral-800 mb-1">About the Author</h3>
                    <p className="text-neutral-600 text-sm">
                      Our content team consists of solar energy experts and enthusiasts dedicated to sharing knowledge about renewable energy solutions.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Comments Section */}
              <div className="mb-12">
                <h2 className="font-heading font-bold text-2xl text-neutral-800 mb-6">Comments (2)</h2>
                
                {/* Sample Comments */}
                <div className="space-y-6">
                  <div className="border-b border-neutral-200 pb-6">
                    <div className="flex">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Comment author" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center mb-1">
                          <h4 className="font-heading font-semibold text-neutral-800 mr-2">Jane Doe</h4>
                          <span className="text-neutral-500 text-sm">2 days ago</span>
                        </div>
                        <p className="text-neutral-600 mb-2">
                          Great article! I've been considering solar panels for my home and this provided some really useful insights. Thank you!
                        </p>
                        <Button variant="ghost" size="sm" className="text-primary">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b border-neutral-200 pb-6">
                    <div className="flex">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Comment author" />
                        <AvatarFallback>MS</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center mb-1">
                          <h4 className="font-heading font-semibold text-neutral-800 mr-2">Michael Smith</h4>
                          <span className="text-neutral-500 text-sm">1 week ago</span>
                        </div>
                        <p className="text-neutral-600 mb-2">
                          I installed solar panels last year and have seen a significant reduction in my energy bills. The points you've made about maintenance are spot on!
                        </p>
                        <Button variant="ghost" size="sm" className="text-primary">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Comment Form */}
              <div>
                <h2 className="font-heading font-bold text-2xl text-neutral-800 mb-6">Leave a Comment</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-neutral-700">Name *</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-neutral-700">Email *</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="comment" className="block mb-2 text-sm font-medium text-neutral-700">Comment *</label>
                    <textarea 
                      id="comment" 
                      rows={5} 
                      className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    ></textarea>
                  </div>
                  <Button className="bg-primary hover:bg-primary-dark">
                    Post Comment
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
