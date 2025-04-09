import { Link } from 'wouter';
import { CheckCircle } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  benefits: string[];
}

export default function ServiceCard({ title, description, imageUrl, benefits }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
      <div className="md:w-1/3 h-64 md:h-auto relative">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="md:w-2/3 p-6">
        <h3 className="font-heading font-bold text-xl mb-3 text-neutral-800">{title}</h3>
        <p className="text-neutral-600 mb-4">
          {description}
        </p>
        <ul className="space-y-2 mb-4">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="text-primary mr-2 h-5 w-5 mt-0.5" />
              <span className="text-neutral-700">{benefit}</span>
            </li>
          ))}
        </ul>
        <Link href="/contact" className="text-primary font-medium hover:underline flex items-center">
          <span>Learn More</span>
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
