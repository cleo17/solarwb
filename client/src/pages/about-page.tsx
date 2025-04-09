import { Helmet } from 'react-helmet';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Leaf, BarChart3, Users, Trophy, CheckCircle, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us - Limpias Technologies</title>
        <meta name="description" content="Learn about Limpias Technologies, our mission, vision, team, certifications, and values. We are dedicated to providing sustainable solar energy solutions." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative bg-neutral-900 text-white py-16 md:py-24">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
                alt="Solar technicians installing solar panels" 
                className="object-cover w-full h-full opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-neutral-900/80"></div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl">
                <span className="text-primary-light font-medium uppercase tracking-wide">About Us</span>
                <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl mt-3 mb-6">Powering a Sustainable Future with Solar Energy</h1>
                <p className="text-lg text-neutral-100 mb-8">
                  At Limpias Technologies, we're committed to transforming how homes and businesses use energy. 
                  Our mission is to make solar power accessible, affordable, and reliable for everyone.
                </p>
              </div>
            </div>
          </section>
          
          {/* Company Story */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="text-primary font-medium uppercase tracking-wide">Our Story</span>
                  <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 mb-6 text-neutral-800">From Small Beginnings to Solar Excellence</h2>
                  <p className="text-neutral-600 mb-4">
                    Founded in 2010 with a vision to bring clean energy solutions to East Africa, Limpias Technologies 
                    started as a small team of engineers with a passion for sustainable energy. 
                  </p>
                  <p className="text-neutral-600 mb-4">
                    Over the years, we've grown into a leading provider of solar solutions, serving thousands of 
                    homes and businesses across the region. Our commitment to quality, innovation, and customer 
                    satisfaction has positioned us as the go-to solar company in the market.
                  </p>
                  <p className="text-neutral-600">
                    Today, with over 500 installations and a team of certified professionals, we continue to expand 
                    our offerings while maintaining the personalized service that sets us apart.
                  </p>
                </div>
                <div className="relative">
                  <div className="rounded-lg overflow-hidden shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                      alt="Solar panels installation" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -left-6 bg-primary text-white p-4 rounded-lg shadow-lg md:w-40">
                    <div className="text-3xl font-bold">10+</div>
                    <div className="text-sm">Years of Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Mission & Vision */}
          <section className="py-16 bg-neutral-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <span className="text-primary font-medium uppercase tracking-wide">Our Purpose</span>
                <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 text-neutral-800">Mission & Vision</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-primary">
                  <div className="bg-primary-light/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                    <Leaf className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl mb-4 text-neutral-800">Our Mission</h3>
                  <p className="text-neutral-600 mb-4">
                    To accelerate the transition to sustainable energy by providing high-quality solar solutions that are 
                    affordable, reliable, and tailored to our customers' needs.
                  </p>
                  <p className="text-neutral-600">
                    We are committed to reducing carbon footprints while helping our customers save on energy costs, 
                    creating a win-win for people and the planet.
                  </p>
                </div>
                
                <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-primary">
                  <div className="bg-primary-light/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                    <BarChart3 className="text-primary h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl mb-4 text-neutral-800">Our Vision</h3>
                  <p className="text-neutral-600 mb-4">
                    To be the leading solar energy provider in East Africa, recognized for excellence, innovation, 
                    and positive environmental impact.
                  </p>
                  <p className="text-neutral-600">
                    We envision a future where solar energy is the primary power source for homes and businesses, 
                    and Limpias Technologies is at the forefront of this energy revolution.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Team Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <span className="text-primary font-medium uppercase tracking-wide">Meet Our Team</span>
                <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 text-neutral-800">The People Behind Limpias Technologies</h2>
                <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
                  Our team of experienced professionals is dedicated to delivering the highest quality solar solutions and service.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white rounded-lg overflow-hidden shadow-md group">
                  <div className="h-56 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="CEO portrait" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-xl mb-1 text-neutral-800">David Mwangi</h3>
                    <p className="text-primary font-medium mb-3">Chief Executive Officer</p>
                    <p className="text-neutral-600 text-sm mb-4">
                      With over 15 years of experience in renewable energy, David leads our vision for sustainable solar solutions.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg overflow-hidden shadow-md group">
                  <div className="h-56 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="CTO portrait" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-xl mb-1 text-neutral-800">Sarah Kimani</h3>
                    <p className="text-primary font-medium mb-3">Chief Technical Officer</p>
                    <p className="text-neutral-600 text-sm mb-4">
                      Sarah ensures our solar systems meet the highest standards of efficiency and reliability.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg overflow-hidden shadow-md group">
                  <div className="h-56 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="Operations Director portrait" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-xl mb-1 text-neutral-800">James Ochieng</h3>
                    <p className="text-primary font-medium mb-3">Operations Director</p>
                    <p className="text-neutral-600 text-sm mb-4">
                      James oversees our installation teams and ensures every project is completed to perfection.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg overflow-hidden shadow-md group">
                  <div className="h-56 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="Customer Relations Manager portrait" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-xl mb-1 text-neutral-800">Grace Wanjiku</h3>
                    <p className="text-primary font-medium mb-3">Customer Relations</p>
                    <p className="text-neutral-600 text-sm mb-4">
                      Grace leads our customer service team, ensuring clients receive outstanding support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Certifications */}
          <section className="py-16 bg-neutral-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <span className="text-primary font-medium uppercase tracking-wide">Our Credentials</span>
                <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 text-neutral-800">Certifications & Partnerships</h2>
                <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
                  We maintain the highest standards through industry certifications and strategic partnerships.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
                  <div className="bg-primary-light/10 rounded-full p-3 mr-4">
                    <Award className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-2 text-neutral-800">ISO 9001:2015</h3>
                    <p className="text-neutral-600 text-sm">
                      Certified for our quality management systems, ensuring consistent delivery of high-quality services.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
                  <div className="bg-primary-light/10 rounded-full p-3 mr-4">
                    <Award className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-2 text-neutral-800">NABCEP Certified</h3>
                    <p className="text-neutral-600 text-sm">
                      Our technicians hold North American Board of Certified Energy Practitioners certifications.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md flex items-start">
                  <div className="bg-primary-light/10 rounded-full p-3 mr-4">
                    <Award className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-2 text-neutral-800">Energy Regulatory Commission</h3>
                    <p className="text-neutral-600 text-sm">
                      Licensed by the ERC for installation and maintenance of solar energy systems.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 bg-white p-8 rounded-lg shadow-md">
                <h3 className="font-heading font-bold text-xl mb-6 text-neutral-800 text-center">Our Technology Partners</h3>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/SolarEdge_Technologies_logo.svg/1280px-SolarEdge_Technologies_logo.svg.png" alt="SolarEdge logo" className="h-8 md:h-10 opacity-70 hover:opacity-100 transition-opacity" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/LG_logo_2015.svg/2560px-LG_logo_2015.svg.png" alt="LG logo" className="h-5 md:h-7 opacity-70 hover:opacity-100 transition-opacity" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Panasonic_logo_%282022%29.svg/2560px-Panasonic_logo_%282022%29.svg.png" alt="Panasonic logo" className="h-6 md:h-8 opacity-70 hover:opacity-100 transition-opacity" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Tesla_Motors_Logo.svg/2560px-Tesla_Motors_Logo.svg.png" alt="Tesla logo" className="h-6 md:h-8 opacity-70 hover:opacity-100 transition-opacity" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Victron_Energy_logo.svg/2560px-Victron_Energy_logo.svg.png" alt="Victron Energy logo" className="h-5 md:h-7 opacity-70 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </section>
          
          {/* Values */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <span className="text-primary font-medium uppercase tracking-wide">What Drives Us</span>
                <h2 className="font-heading font-bold text-3xl md:text-4xl mt-2 text-neutral-800">Our Core Values</h2>
                <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
                  These principles guide everything we do, from product selection to customer service.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="p-6 rounded-lg border border-neutral-200 hover:border-primary hover:shadow-md transition-all duration-300">
                  <div className="bg-primary-light/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 text-neutral-800">Quality Excellence</h3>
                  <p className="text-neutral-600">
                    We never compromise on quality. From the products we select to the services we provide, 
                    excellence is our standard.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg border border-neutral-200 hover:border-primary hover:shadow-md transition-all duration-300">
                  <div className="bg-primary-light/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Users className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 text-neutral-800">Customer-Centric</h3>
                  <p className="text-neutral-600">
                    Our customers are at the heart of everything we do. We listen, understand, and deliver solutions 
                    that meet their unique needs.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg border border-neutral-200 hover:border-primary hover:shadow-md transition-all duration-300">
                  <div className="bg-primary-light/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Leaf className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 text-neutral-800">Environmental Stewardship</h3>
                  <p className="text-neutral-600">
                    We're committed to protecting our planet by promoting renewable energy solutions that reduce carbon footprints.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg border border-neutral-200 hover:border-primary hover:shadow-md transition-all duration-300">
                  <div className="bg-primary-light/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Trophy className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 text-neutral-800">Innovation</h3>
                  <p className="text-neutral-600">
                    We continually seek new technologies and approaches to improve efficiency, reduce costs, and enhance user experience.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg border border-neutral-200 hover:border-primary hover:shadow-md transition-all duration-300">
                  <div className="bg-primary-light/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 text-neutral-800">Integrity</h3>
                  <p className="text-neutral-600">
                    We operate with transparency and honesty in all our dealings, building trust with our customers, partners, and community.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg border border-neutral-200 hover:border-primary hover:shadow-md transition-all duration-300">
                  <div className="bg-primary-light/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Users className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-3 text-neutral-800">Community Impact</h3>
                  <p className="text-neutral-600">
                    We're committed to creating positive impact in the communities we serve through job creation and education.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
