'use client';

import { useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAccountPitch } from '@/contexts/AccountPitchContext';

export default function AccountPitch() {
  const router = useRouter();
  const { isVisible, hideAccountPitch } = useAccountPitch();

  const handleSignIn = () => {
    hideAccountPitch();
    router.push('/auth');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm z-40" />
      
      {/* Centered content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="relative max-w-sm w-full bg-white rounded-xl shadow-xl p-6 animate-slide-up">
          <button 
            onClick={hideAccountPitch}
            className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h3 className="text-xl font-bold text-forest-800 mb-4">
            Sign In to Access More Features!
          </h3>

          <ul className="space-y-3 mb-6">
            {[
              'Track visited parks and visualize your adventures',
              'More coming soon!',
            ].map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <FaCheck className="mt-1 text-forest-600 flex-shrink-0" size={14} />
                <span className="text-sm text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 
              bg-forest-600 text-white rounded-lg hover:bg-forest-700 
              transition-colors duration-200"
          >
            <span>Sign in or Create Account</span>
          </button>

          <p className="mt-4 text-xs text-center text-gray-500">
            Free account. No credit card required.
          </p>
        </div>
      </div>
    </>
  );
} 