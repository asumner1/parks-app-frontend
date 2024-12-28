'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-20 bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-xl font-bold text-gray-800">
              parktools.io
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
            <Link 
              href="/"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Map
            </Link>
            <Link 
              href="/parks"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              All Parks
            </Link>
            <Link 
              href="/about"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              About
            </Link>
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
        </div>
      </div>
    </nav>
  );
} 