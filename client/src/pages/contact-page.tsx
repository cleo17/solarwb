import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { insertContactSubmissionSchema, InsertContactSubmission } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { CheckCircle, MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<InsertContactSubmission>({
    resolver: zodResolver(insertContactSubmissionSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });
  
  const onSubmit = async (data: InsertContactSubmission) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest('POST', '/api/contact', data);
      
      toast({
        title: 'Message sent successfully',
        description: 'We will get back to you as soon as possible.',
      });
      
      form.reset();
      setIsSuccess(true);
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast({
        title: 'Message could not be sent',
        description: 'There was an error submitting your message. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Contact Us - Limpias Technologies</title>
        <meta name="description" content="Get in touch with Limpias Technologies for solar energy solutions. Contact our team for inquiries, quotes, or support." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-primary text-white py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl">
                <h1 className="font-heading font-bold text-3xl sm:text-4xl mb-4">
                  Contact Us
                </h1>
                <p className="text-lg mb-0 text-neutral-100">
                  We're here to answer your questions about solar energy solutions.
                </p>
              </div>
            </div>
          </section>
          
          {/* Contact Content */}
          <section className="py-12 bg-neutral-50">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Information */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-md p-6 h-full">
                    <h2 className="font-heading font-bold text-2xl text-neutral-800 mb-6">Get In Touch</h2>
                    
                    <div className="space-y-6">
                      <div className="flex">
                        <div className="bg-primary-light/10 rounded-full p-3 mr-4">
                          <MapPin className="text-primary h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-lg text-neutral-800 mb-1">Our Location</h3>
                          <p className="text-neutral-600">
                            123 Solar Avenue, Energy District<br />
                            Nairobi, Kenya
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="bg-primary-light/10 rounded-full p-3 mr-4">
                          <Phone className="text-primary h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-lg text-neutral-800 mb-1">Phone Number</h3>
                          <p className="text-neutral-600">
                            +254 700 123 456<br />
                            +254 720 789 012
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="bg-primary-light/10 rounded-full p-3 mr-4">
                          <Mail className="text-primary h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-lg text-neutral-800 mb-1">Email Address</h3>
                          <p className="text-neutral-600">
                            info@limpiastech.com<br />
                            support@limpiastech.com
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex">
                        <div className="bg-primary-light/10 rounded-full p-3 mr-4">
                          <Clock className="text-primary h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-lg text-neutral-800 mb-1">Working Hours</h3>
                          <p className="text-neutral-600">
                            Monday - Friday: 8am - 6pm<br />
                            Saturday: 9am - 1pm
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="font-heading font-bold text-lg text-neutral-800 mb-4">Follow Us</h3>
                      <div className="flex space-x-4">
                        <Button variant="outline" size="icon" className="rounded-full">
                          <Facebook className="h-5 w-5 text-neutral-600" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full">
                          <Twitter className="h-5 w-5 text-neutral-600" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full">
                          <Instagram className="h-5 w-5 text-neutral-600" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full">
                          <Linkedin className="h-5 w-5 text-neutral-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="font-heading font-bold text-2xl text-neutral-800 mb-6">Send Us a Message</h2>
                    
                    {isSuccess ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-green-700 mb-2">Message Sent Successfully!</h3>
                        <p className="text-green-600 mb-4">Thank you for reaching out. We will get back to you as soon as possible.</p>
                        <Button variant="outline" onClick={() => setIsSuccess(false)}>Send Another Message</Button>
                      </div>
                    ) : (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name*</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your full name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email*</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your email address" type="email" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subject*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Message subject" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Message*</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Your message" 
                                    rows={5} 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="bg-primary hover:bg-primary-dark w-full md:w-auto"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                          </Button>
                        </form>
                      </Form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Map Section */}
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="font-heading font-bold text-2xl text-neutral-800 mb-6 text-center">Our Location</h2>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7731578582505!2d36.7608636!3d-1.2997994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTgnMDAuMyJTIDM2wrA0NSc0MC4zIkU!5e0!3m2!1sen!2sus!4v1651221215693!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Limpias Technologies location"
                ></iframe>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
