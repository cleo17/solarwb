import { Helmet } from 'react-helmet';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/home/hero-section';
import FeaturesSection from '@/components/home/features-section';
import ProductsSection from '@/components/home/products-section';
import ServicesSection from '@/components/home/services-section';
import TestimonialsSection from '@/components/home/testimonials-section';
import CTASection from '@/components/home/cta-section';
import BlogSection from '@/components/home/blog-section';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Limpias Technologies - Solar Systems for Homes & Businesses</title>
        <meta name="description" content="Limpias Technologies provides sustainable solar solutions including solar panels, water heaters, water pumps, and inverters for homes and businesses." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <HeroSection />
          <FeaturesSection />
          <ProductsSection />
          <ServicesSection />
          <TestimonialsSection />
          <CTASection />
          <BlogSection />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
