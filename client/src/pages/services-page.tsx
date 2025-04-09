import { Helmet } from 'react-helmet';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { CheckCircle, Settings, Drill, Lightbulb, HelpCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import ServiceCard from '@/components/ui/service-card';

export default function ServicesPage() {
  const services = [
    {
      title: "Solar System Design & Installation",
      description: "Professional design and installation of customized solar systems for homes and businesses.",
      imageUrl: "https://images.unsplash.com/photo-1521783593447-5702b9bfd267?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      benefits: [
        "Customized system design based on energy needs",
        "Professional installation by certified technicians",
        "Quality components with extended warranties",
        "Compliance with local regulations and safety standards"
      ]
    },
    {
      title: "Maintenance & Repair Services",
      description: "Regular maintenance and prompt repair services to ensure optimal performance of your solar system.",
      imageUrl: "https://images.unsplash.com/photo-1581092921461-7d25c8e710ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      benefits: [
        "Scheduled maintenance to prevent issues",
        "System performance monitoring and optimization",
        "Prompt repair services with minimal downtime",
        "Professional cleaning to maintain efficiency"
      ]
    },
    {
      title: "Energy Audit & Consultation",
      description: "Comprehensive energy assessment and consultation to optimize your energy usage and savings.",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      benefits: [
        "Detailed analysis of current energy consumption",
        "Identification of energy-saving opportunities",
        "Customized recommendations for efficiency improvements",
        "ROI calculation for proposed solar solutions"
      ]
    },
    {
      title: "Financing & Incentive Assistance",
      description: "Guidance on financing options and assistance with incentives to make solar energy more affordable.",
      imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      benefits: [
        "Information on available tax credits and rebates",
        "Assistance with financing application process",
        "Flexible payment options to suit your budget",
        "Guidance on maximizing return on investment"
      ]
    }
  ];

  const additionalServices = [
    {
      icon: <Settings className="text-primary text-3xl h-8 w-8" />,
      title: "System Upgrades",
      description: "Upgrade your existing solar system with newer, more efficient components to improve performance."
    },
    {
      icon: <Drill className="text-primary text-3xl h-8 w-8" />,
      title: "Emergency Repairs",
      description: "24/7 emergency repair services to address urgent issues with your solar energy system."
    },
    {
      icon: <Lightbulb className="text-primary text-3xl h-8 w-8" />,
      title: "Energy Efficiency Consulting",
      description: "Expert advice on improving overall energy efficiency in your home or business."
    },
    {
      icon: <HelpCircle className="text-primary text-3xl h-8 w-8" />,
      title: "Technical Support",
      description: "Ongoing technical support and troubleshooting for all your solar system questions and concerns."
    },
    {
      icon: <FileText className="text-primary text-3xl h-8 w-8" />,
      title: "Solar Permitting",
      description: "Assistance with obtaining necessary permits and approvals for your solar installation."
    },
    {
      icon: <CheckCircle className="text-primary text-3xl h-8 w-8" />,
      title: "System Inspection",
      description: "Professional inspection services to ensure your solar system is operating at peak efficiency."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Solar Services - Limpias Technologies</title>
        <meta name="description" content="Comprehensive solar services including installation, maintenance, repair, energy audit, consultation, and financing assistance for homes and businesses." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative bg-neutral-900 text-white py-16 md:py-24">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1477862096227-3a1bb3b08330?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
                alt="Solar technician working on solar panels" 
                className="object-cover w-full h-full opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-neutral-900/70"></div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl">
                <span className="text-primary-light font-medium uppercase tracking-wide">Our Services</span>
                <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl mt-3 mb-6">Comprehensive Solar Solutions</h1>
                <p className="text-lg text-neutral-100 mb-8">
                  From consultation and design to installation and maintenance, we provide end-to-end services for all your solar energy needs.
                </p>
                <Link href="/contact">
                  <Button className="bg-secondary hover:bg-secondary-dark text-white font-heading font-semibold rounded-md px-6 py-3">
                    Get a Free Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </section>
          
          {/* Main Services */}
          <section className="py-16 bg-neutral-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <span className="text-primary font-medium uppercase tracking-wide">What We Offer</span>
                <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 text-neutral-800">Our Core Services</h2>
                <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
                  We provide a complete range of solar services to meet your residential and commercial needs.
                </p>
              </div>
              
              <div className="space-y-8">
                {services.map((service, index) => (
                  <ServiceCard
                    key={index}
                    title={service.title}
                    description={service.description}
                    imageUrl={service.imageUrl}
                    benefits={service.benefits}
                  />
                ))}
              </div>
            </div>
          </section>
          
          {/* Service Process */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <span className="text-primary font-medium uppercase tracking-wide">How We Work</span>
                <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 text-neutral-800">Our Service Process</h2>
                <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
                  We follow a structured approach to ensure the successful implementation of your solar energy solution.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="relative">
                    <div className="bg-primary-light/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary text-2xl font-bold">1</span>
                    </div>
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary/20 -z-10"></div>
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 text-neutral-800">Consultation</h3>
                  <p className="text-neutral-600">
                    We assess your energy needs, site conditions, and budget to understand your requirements.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="relative">
                    <div className="bg-primary-light/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary text-2xl font-bold">2</span>
                    </div>
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary/20 -z-10"></div>
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 text-neutral-800">Design & Proposal</h3>
                  <p className="text-neutral-600">
                    Our engineers create a customized system design and detailed proposal for your approval.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="relative">
                    <div className="bg-primary-light/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary text-2xl font-bold">3</span>
                    </div>
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary/20 -z-10"></div>
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 text-neutral-800">Installation</h3>
                  <p className="text-neutral-600">
                    Our certified technicians professionally install your solar system according to specifications.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="relative">
                    <div className="bg-primary-light/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary text-2xl font-bold">4</span>
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 text-neutral-800">Support & Maintenance</h3>
                  <p className="text-neutral-600">
                    We provide ongoing support and maintenance services to ensure optimal system performance.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Additional Services */}
          <section className="py-16 bg-neutral-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <span className="text-primary font-medium uppercase tracking-wide">More Ways We Help</span>
                <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 text-neutral-800">Additional Services</h2>
                <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
                  We offer a range of specialized services to complement our core offerings.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {additionalServices.map((service, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary">
                    <div className="mb-4">
                      {service.icon}
                    </div>
                    <h3 className="font-heading font-bold text-xl mb-2 text-neutral-800">{service.title}</h3>
                    <p className="text-neutral-600">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Testimonials */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <span className="text-primary font-medium uppercase tracking-wide">Client Experiences</span>
                <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 text-neutral-800">What Our Clients Say</h2>
                <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
                  Hear from our satisfied customers about their experience with our services.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-neutral-50 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center text-amber-400 mb-4">
                    {Array(5).fill(0).map((_, i) => (
                      <svg 
                        key={i} 
                        className="h-5 w-5 fill-current text-amber-400" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-neutral-700 mb-6 italic">
                    "The installation team was highly professional and completed the job ahead of schedule. The system has been performing excellently, and their after-sales support has been outstanding."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Customer portrait" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-neutral-800">Robert Johnson</h4>
                      <p className="text-neutral-500 text-sm">Home Installation</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-neutral-50 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center text-amber-400 mb-4">
                    {Array(5).fill(0).map((_, i) => (
                      <svg 
                        key={i} 
                        className="h-5 w-5 fill-current text-amber-400" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-neutral-700 mb-6 italic">
                    "Limpias Technologies conducted a thorough energy audit for our business and recommended the perfect solar solution. The ROI has been better than expected, and their maintenance service keeps everything running smoothly."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                      <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Customer portrait" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-neutral-800">Lisa Martinez</h4>
                      <p className="text-neutral-500 text-sm">Commercial Installation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* CTA */}
          <section className="py-16 bg-primary text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">Ready to Get Started?</h2>
                <p className="text-neutral-100 mb-8 text-lg">
                  Contact us today for a free consultation and discover how our solar services can benefit you.
                </p>
                <Link href="/contact">
                  <Button className="px-6 py-3 bg-white text-primary hover:bg-neutral-100 font-heading font-semibold rounded-md transition duration-300">
                    Schedule a Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
