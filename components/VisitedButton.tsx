'use client';

import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useAccountPitch } from '@/contexts/AccountPitchContext';
import { useUser } from '@/hooks/useUser';

interface VisitedButtonProps {
  parkId: string;
  initialVisited?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

export default function VisitedButton({ 
  parkId, 
  initialVisited = false,
  variant = 'default',
  className = ''
}: VisitedButtonProps) {
  const [isVisited, setIsVisited] = useState(initialVisited);
  const { showAccountPitch } = useAccountPitch();
  const { user } = useUser();

  const handleToggleVisited = () => {
    if (!user) {
      showAccountPitch();
      return;
    }
    setIsVisited(!isVisited);
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id={`visited-${parkId}`}
            checked={isVisited}
            onChange={handleToggleVisited}
            className="sr-only peer"
          />
          <div className="w-5 h-5 border-2 rounded-md peer-focus:ring-2 peer-focus:ring-forest-500/20 
            peer-checked:bg-forest-600 peer-checked:border-forest-600 border-forest-300 
            transition-all duration-200 ease-in-out flex items-center justify-center 
            hover:border-forest-400">
            <FaCheck 
              size={12} 
              className={`text-white transform transition-transform duration-200 
                ${isVisited ? 'scale-100' : 'scale-0'}`}
            />
          </div>
          <span className="ml-2 text-sm text-gray-600 select-none">
            Visited
          </span>
        </label>
      </div>
    );
  }

  return (
    <button
      onClick={handleToggleVisited}
      className={`group relative flex items-center gap-2 px-4 py-2 rounded-md
        border-2 transition-all duration-200 ease-in-out shadow-sm 
        ${isVisited 
          ? 'bg-forest-600 text-white border-forest-600 hover:bg-forest-700 hover:border-forest-700' 
          : 'bg-white text-forest-600 border-forest-300 hover:border-forest-400'
        } ${className}`}
    >
      <span className={`flex items-center gap-2 transition-all duration-200`}>
        <FaCheck 
          size={12} 
          className={`transform transition-all duration-200 
            ${isVisited ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
        />
        <span className="text-sm font-medium">
          {isVisited ? 'Visited' : 'Mark as Visited'}
        </span>
      </span>
    </button>
  );
} 