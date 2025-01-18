'use client';

import { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useAccountPitch } from '@/contexts/AccountPitchContext';
import { useUser } from '@/hooks/useUser';
import { useUserContext } from '@/contexts/UserContext';

interface VisitedButtonProps {
  parkId: string;
  variant?: 'default' | 'compact';
  className?: string;
}

export default function VisitedButton({ 
  parkId, 
  variant = 'default',
  className = ''
}: VisitedButtonProps) {
  const { showAccountPitch } = useAccountPitch();
  const { user } = useUser();
  const { isVisited, toggleVisitedPark, loading } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleVisited = async () => {
    if (!user) {
      showAccountPitch();
      return;
    }
    
    setIsLoading(true);
    await toggleVisitedPark(parkId);
    setIsLoading(false);
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id={`visited-${parkId}`}
            checked={isVisited(parkId)}
            onChange={handleToggleVisited}
            disabled={isLoading}
            className="sr-only peer"
          />
          <div className="w-5 h-5 border-2 rounded-md peer-focus:ring-2 peer-focus:ring-forest-500/20 
            peer-checked:bg-forest-600 peer-checked:border-forest-600 border-forest-300 
            transition-all duration-200 ease-in-out flex items-center justify-center 
            hover:border-forest-400">
            <FaCheck 
              size={12} 
              className={`text-white transform transition-transform duration-200 
                ${isVisited(parkId) ? 'scale-100' : 'scale-0'}`}
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
      disabled={isLoading}
      className={`group relative flex items-center gap-2 px-4 py-2 rounded-md
        border-2 transition-all duration-200 ease-in-out shadow-sm 
        ${isVisited(parkId)
          ? 'bg-forest-600 text-white border-forest-600 hover:bg-forest-700 hover:border-forest-700' 
          : 'bg-white text-forest-600 border-forest-300 hover:border-forest-400'
        } ${className}`}
    >
      <span className={`flex items-center gap-2 transition-all duration-200`}>
        <FaCheck 
          size={12} 
          className={`transform transition-all duration-200 
            ${isVisited(parkId) ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
        />
        <span className="text-sm font-medium">
          {isVisited(parkId) ? 'Visited' : 'Mark as Visited'}
        </span>
      </span>
    </button>
  );
} 