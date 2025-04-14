import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showTagline = false, className = '' }: LogoProps) {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-8 w-auto';
      case 'lg':
        return 'h-16 w-auto';
      case 'md':
      default:
        return 'h-12 w-auto';
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center">
        {/* Stylized W logo */}
        <div className="relative mr-2">
          <svg width="40" height="30" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg" className={getSizeClass()}>
            {/* W shape */}
            <path d="M30 20 L50 70 L75 40 L100 70 L120 20" stroke="currentColor" className="text-primary" strokeWidth="12" fill="none" strokeLinejoin="round" strokeLinecap="round" />
            {/* Green accent line */}
            <path d="M20 80 L130 80" stroke="currentColor" className="accent-text" strokeWidth="6" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl md:text-2xl text-primary">
            Limpias <span className="accent-text">Technologies</span>
          </span>
          {showTagline && (
            <span className="text-sm italic text-gray-600">Expert in solar Energy</span>
          )}
        </div>
      </div>
    </div>
  );
}