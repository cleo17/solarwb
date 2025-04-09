import { Star, StarHalf } from 'lucide-react';

interface TestimonialCardProps {
  text: string;
  name: string;
  role: string;
  avatarUrl: string;
  rating: number;
}

export default function TestimonialCard({ text, name, role, avatarUrl, rating }: TestimonialCardProps) {
  // Create array of full and half stars
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-current" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-current" />);
    }
    
    return stars;
  };
  
  return (
    <div className="bg-neutral-50 rounded-lg p-6 shadow-sm">
      <div className="flex items-center text-amber-400 mb-4">
        {renderStars()}
      </div>
      <p className="text-neutral-700 mb-6 italic">
        "{text}"
      </p>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
          <img src={avatarUrl} alt={`${name}'s portrait`} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-heading font-semibold text-neutral-800">{name}</h4>
          <p className="text-neutral-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
}
