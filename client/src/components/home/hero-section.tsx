import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-neutral-900 text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
          alt="Solar panels" 
          className="object-cover w-full h-full opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-neutral-900/70"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-2xl">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl mb-6 leading-tight">
            Harness the Power of the Sun with Limpias Technologies
          </h1>
          <p className="text-lg mb-8 text-neutral-100">
            Complete solar solutions for homes and businesses. Save money and reduce your carbon footprint with our sustainable energy systems.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products">
              <Button className="px-6 py-6 bg-secondary hover:bg-secondary-dark text-white font-heading font-semibold rounded-md flex items-center">
                <span>Shop Products</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" className="px-6 py-6 bg-white hover:bg-neutral-100 text-primary font-heading font-semibold rounded-md">
                Our Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 0L60 10C120 20 240 40 360 50C480 60 600 60 720 50C840 40 960 20 1080 15C1200 10 1320 20 1380 25L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="#F5F7F9"
          />
        </svg>
      </div>
    </section>
  );
}
