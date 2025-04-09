import { Link } from 'wouter';
import { Calendar, User } from 'lucide-react';
import { BlogPost } from '@shared/schema';
import { format } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={post.imageUrl || 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center text-neutral-500 text-sm mb-3">
          <Calendar className="text-primary mr-1 h-4 w-4" />
          <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
          <span className="mx-2">•</span>
          <User className="text-primary mr-1 h-4 w-4" />
          <span>Admin</span>
        </div>
        <h3 className="font-heading font-bold text-xl mb-3 group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.id}`}>{post.title}</Link>
        </h3>
        <p className="text-neutral-600 mb-4 line-clamp-3">
          {post.content.substring(0, 150)}...
        </p>
        <Link 
          href={`/blog/${post.id}`} 
          className="text-primary font-medium hover:underline inline-flex items-center"
        >
          <span>Read More</span>
          <svg
            className="ml-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
