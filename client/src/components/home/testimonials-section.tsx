import TestimonialCard from '@/components/ui/testimonial-card';

export default function TestimonialsSection() {
  const testimonials = [
    {
      text: "The solar panels installed by Limpias Technologies have reduced our electricity bill by 70%. The team was professional and the installation was completed ahead of schedule.",
      name: "Michael Johnson",
      role: "Residential Customer",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5
    },
    {
      text: "Our factory now runs on clean energy thanks to Limpias Technologies. The ROI was achieved in just 3 years, and their maintenance service is outstanding.",
      name: "Sarah Martinez",
      role: "Business Owner",
      avatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 5
    },
    {
      text: "I installed their solar water heating system last year and couldn't be happier. Customer service is responsive and the system works perfectly even during cloudy days.",
      name: "David Williams",
      role: "Homeowner",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      rating: 4.5
    }
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-medium uppercase tracking-wide">Testimonials</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 text-neutral-800">What Our Customers Say</h2>
          <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
            Discover why our customers choose Limpias Technologies for their solar energy needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              text={testimonial.text}
              name={testimonial.name}
              role={testimonial.role}
              avatarUrl={testimonial.avatarUrl}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
