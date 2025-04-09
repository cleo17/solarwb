import { Link } from 'wouter';
import ServiceCard from '@/components/ui/service-card';
import { CheckCircle, CircleHelp, Drill, Clipboard } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-primary">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="font-heading font-bold text-xl mb-2 text-neutral-800">{title}</h3>
      <p className="text-neutral-600">{description}</p>
    </div>
  );
}

export default function ServicesSection() {
  const serviceCards = [
    {
      title: "Professional Installation",
      description: "Our certified technicians provide expert installation of all solar systems, ensuring optimal performance and longevity of your investment.",
      imageUrl: "https://images.unsplash.com/photo-1521783593447-5702b9bfd267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      benefits: [
        "Complete system design and engineering",
        "Proper mounting and electrical connections", 
        "Grid connection and system testing"
      ],
    },
    {
      title: "Regular Maintenance",
      description: "Keep your solar system operating at peak efficiency with our comprehensive maintenance services and preventive care.",
      imageUrl: "https://images.unsplash.com/photo-1581092921461-7d25c8e710ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      benefits: [
        "Panel cleaning and inspection",
        "System performance monitoring",
        "Component replacement and upgrades"
      ],
    }
  ];
  
  const featureCards = [
    {
      icon: <CircleHelp className="text-primary text-3xl h-8 w-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your queries and emergency situations."
    },
    {
      icon: <Drill className="text-primary text-3xl h-8 w-8" />,
      title: "Repair Services",
      description: "Quick and reliable repair services for all types of solar systems and components."
    },
    {
      icon: <Clipboard className="text-primary text-3xl h-8 w-8" />,
      title: "Consultation",
      description: "Expert advice on the best solar solutions for your specific requirements and budget."
    }
  ];
  
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-medium uppercase tracking-wide">Our Services</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 text-neutral-800">Comprehensive Solar Solutions</h2>
          <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
            From consultation to installation and maintenance, we offer end-to-end services for all your solar energy needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {serviceCards.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              imageUrl={service.imageUrl}
              benefits={service.benefits}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {featureCards.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
