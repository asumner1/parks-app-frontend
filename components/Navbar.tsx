'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getUser, signOut } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
      }
    };

    checkUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setShowDropdown(false);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get display name from user metadata, fallback to email if not available
  const displayName = user?.user_metadata?.name || user?.email;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown');
      const button = document.getElementById('user-button');
      if (
        dropdown &&
        button &&
        !dropdown.contains(event.target as Node) &&
        !button.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed w-full z-20 bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-xl font-bold text-gray-800">
              parkscout.io
              <span className="ml-1.5 text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                beta
              </span>
            </span>
            <span className="hidden md:block text-xl font-bold text-gray-800">
              | 
            </span>
            <span className="hidden md:block text-xl text-gray-800">
              tools for national park trips
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-800 transition-colors">
              Map
            </Link>
            <Link href="/parks" className="text-gray-600 hover:text-gray-800 transition-colors">
              All Parks
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-800 transition-colors">
              About
            </Link>
            {user ? (
              <div className="relative">
                <button
                  id="user-button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                >
                  <FaUser className="w-4 h-4" />
                  <span>{displayName}</span>
                </button>
                <div
                  id="user-dropdown"
                  className={`absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl ${
                    showDropdown ? 'block' : 'hidden'
                  }`}
                >
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-2 text-sm font-medium text-white bg-forest-600 rounded-md hover:bg-forest-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="outline-none mobile-menu-button"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link
            href="/"
            className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Map
          </Link>
          <Link
            href="/parks"
            className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            All Parks
          </Link>
          <Link
            href="/about"
            className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          {user ? (
            <>
              <div className="px-3 py-2 text-gray-600">
                <FaUser className="inline-block w-4 h-4 mr-2" />
                {displayName}
              </div>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="block px-3 py-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 