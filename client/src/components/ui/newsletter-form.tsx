import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { insertNewsletterSubscriptionSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { Mail } from 'lucide-react';

const newsletterSchema = insertNewsletterSubscriptionSchema;
type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export default function NewsletterForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const onSubmit = async (data: NewsletterFormValues) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest('POST', '/api/newsletter', data);
      
      toast({
        title: 'Subscription successful',
        description: 'Thank you for subscribing to our newsletter!',
      });
      
      form.reset();
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: 'Subscription failed',
        description: 'There was an error subscribing to the newsletter. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto bg-neutral-700 rounded-lg p-8 md:p-10">
      <div className="text-center mb-6">
        <Mail className="h-10 w-10 text-primary mx-auto mb-3" />
        <h2 className="font-heading font-bold text-2xl md:text-3xl mb-2 text-white">Subscribe to Our Newsletter</h2>
        <p className="text-neutral-300">
          Stay updated with the latest solar technology, product launches, and exclusive offers.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input 
                    placeholder="Your email address" 
                    {...field} 
                    className="bg-neutral-600 border-neutral-500 text-white placeholder:text-neutral-400 focus:ring-primary focus:border-primary"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary-dark text-white font-heading font-semibold whitespace-nowrap"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
          </Button>
        </form>
      </Form>
      
      <p className="text-neutral-400 text-sm text-center mt-4">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
}
