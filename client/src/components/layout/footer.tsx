import { Link } from "wouter";
import { SunMedium, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Clock } from "lucide-react";
import NewsletterForm from "@/components/ui/newsletter-form";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-6">
              <Link href="/" className="flex items-center">
                <div className="flex items-center">
                  <SunMedium className="text-primary mr-2" />
                  <span className="font-heading font-bold text-xl text-white">
                    Limpias<span className="text-primary">Tech</span>
                  </span>
                </div>
              </Link>
              <p className="mt-4 text-neutral-400">
                Providing sustainable solar solutions for homes and businesses. Harness the power of the sun with our innovative products and services.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                <Facebook className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                <Twitter className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                <Linkedin className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-neutral-400 hover:text-primary transition-colors duration-300">Home</Link></li>
              <li><Link href="/about" className="text-neutral-400 hover:text-primary transition-colors duration-300">About Us</Link></li>
              <li><Link href="/products" className="text-neutral-400 hover:text-primary transition-colors duration-300">Products</Link></li>
              <li><Link href="/services" className="text-neutral-400 hover:text-primary transition-colors duration-300">Services</Link></li>
              <li><Link href="/blog" className="text-neutral-400 hover:text-primary transition-colors duration-300">Blog</Link></li>
              <li><Link href="/contact" className="text-neutral-400 hover:text-primary transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-4 text-white">Products</h3>
            <ul className="space-y-3">
              <li><Link href="/products?category=Solar Panels" className="text-neutral-400 hover:text-primary transition-colors duration-300">Solar Panels</Link></li>
              <li><Link href="/products?category=Water Heaters" className="text-neutral-400 hover:text-primary transition-colors duration-300">Solar Water Heaters</Link></li>
              <li><Link href="/products?category=Water Pumps" className="text-neutral-400 hover:text-primary transition-colors duration-300">Solar Water Pumps</Link></li>
              <li><Link href="/products?category=Inverters" className="text-neutral-400 hover:text-primary transition-colors duration-300">Inverters</Link></li>
              <li><Link href="/products?category=Batteries" className="text-neutral-400 hover:text-primary transition-colors duration-300">Batteries</Link></li>
              <li><Link href="/products" className="text-neutral-400 hover:text-primary transition-colors duration-300">Accessories</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-bold text-lg mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="text-primary mr-3 h-5 w-5 mt-0.5" />
                <span className="text-neutral-400">123 Solar Avenue, Energy District, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-primary mr-3 h-5 w-5" />
                <span className="text-neutral-400">+254 700 123 456</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-primary mr-3 h-5 w-5" />
                <span className="text-neutral-400">info@limpiastech.com</span>
              </li>
              <li className="flex items-center">
                <Clock className="text-primary mr-3 h-5 w-5" />
                <span className="text-neutral-400">Mon-Fri: 8am - 6pm</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="py-8">
          <NewsletterForm />
        </div>
        
        <div className="border-t border-neutral-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Limpias Technologies. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-neutral-400 hover:text-primary text-sm transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-neutral-400 hover:text-primary text-sm transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-neutral-400 hover:text-primary text-sm transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
