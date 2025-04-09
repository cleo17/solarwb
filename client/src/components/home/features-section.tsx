import { 
  SunMedium, 
  Droplets, 
  Zap
} from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center transition-transform hover:-translate-y-2 duration-300">
      <div className="bg-primary-light/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="font-heading font-bold text-xl mb-3 text-neutral-800">{title}</h3>
      <p className="text-neutral-600">
        {description}
      </p>
    </div>
  );
}

export default function FeaturesSection() {
  const features = [
    {
      icon: <SunMedium className="text-primary text-3xl" />,
      title: "Solar Panels",
      description: "High-efficiency solar panels designed to maximize energy production even in low-light conditions."
    },
    {
      icon: <Droplets className="text-primary text-3xl" />,
      title: "Solar Water Heaters",
      description: "Energy-efficient water heating solutions that significantly reduce your electricity costs."
    },
    {
      icon: <Zap className="text-primary text-3xl" />,
      title: "Inverters & Batteries",
      description: "Reliable power storage and conversion systems for uninterrupted energy supply."
    }
  ];
  
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-medium uppercase tracking-wide">Why Choose Us</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-3 text-neutral-800">Complete Solar Solutions</h2>
          <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
            Limpias Technologies provides comprehensive solar energy solutions tailored to your specific needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
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
