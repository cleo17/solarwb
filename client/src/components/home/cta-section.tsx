import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">Ready to Switch to Solar Energy?</h2>
          <p className="text-neutral-100 mb-8 text-lg">
            Contact us today for a free consultation and discover how much you can save with our solar solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button variant="outline" className="px-6 py-3 bg-white text-primary hover:bg-neutral-100 font-heading font-semibold rounded-md transition duration-300">
                Get a Free Quote
              </Button>
            </Link>
            <Link href="/products">
              <Button className="px-6 py-3 bg-secondary hover:bg-secondary-dark text-white font-heading font-semibold rounded-md transition duration-300 inline-flex items-center">
                <span>Shop Products</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
