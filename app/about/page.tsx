'use client';

import React, { useState } from 'react';

export default function AboutPage(): React.ReactElement {
  const [showFullContent, setShowFullContent] = useState(false);
  const showDebugInfo = process.env.NEXT_PUBLIC_SHOW_DEBUG_INFO === 'true';

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* About ParkScout.io Section */}
        <h1 className="text-4xl font-bold text-forest-800 mb-8">About ParkScout.io</h1>
        
        {/* Coming Soon Section - Only show when content is not expanded */}
        {!showFullContent && (
          <section className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-forest-700 mb-4">Coming Soon</h2>
            <p className="text-gray-600">
              ParkScout.io is currently in beta. We're working hard to bring you the best possible experience for exploring the U.S. national parks. Check back soon for a more detailed description of the site!
            </p>
          </section>
        )}

        {/* Hidden sections */}
        <div className={showFullContent ? 'block' : 'hidden'}>
          {/* Welcome Section */}
          <section className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-forest-700 mb-4">Welcome to ParkScout.io</h2>
            <p className="text-gray-600 mb-6">
              ParkScout.io is your trusted guide for exploring the breathtaking U.S. national parks. Born from a passion for the outdoors and a desire to make trip planning effortless, this platform equips adventurers with everything they need to create memorable journeys into nature.
            </p>
            <p className="text-gray-600">
              As the solo founder, I started ParkScout.io to bridge the gap between scattered park information and the dream of seamless exploration. Inspired by my own love of hiking, photography, and the tranquility of the wild, I built this site to empower fellow nature lovers to navigate, plan, and explore with ease.
            </p>
          </section>

          {/* Features Section */}
          <section className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-forest-700 mb-4">Discover What ParkScout.io Offers</h2>
            <p className="text-gray-600 mb-6">
              ParkScout.io is more than just a mapping tool—it's your all-in-one trip planning assistant for national parks. Here's how it can enhance your adventures:
            </p>
            <ul className="list-none space-y-4 mb-6">
              <li className="flex items-start">
                <span className="text-forest-600 mr-2">•</span>
                <span className="text-gray-600">
                  <strong className="text-gray-800">Interactive Mapping:</strong> Find trails, points of interest, and hidden gems with our intuitive, user-friendly maps.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-forest-600 mr-2">•</span>
                <span className="text-gray-600">
                  <strong className="text-gray-800">Trip Insights:</strong> Access details on the best times to visit, top photography spots, and real-time trail and weather updates.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-forest-600 mr-2">•</span>
                <span className="text-gray-600">
                  <strong className="text-gray-800">Camping Options:</strong> Learn about free camping on nearby national forests or BLM lands.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-forest-600 mr-2">•</span>
                <span className="text-gray-600">
                  <strong className="text-gray-800">Unique Features:</strong> Enjoy curated content and updates that help you explore parks responsibly and sustainably.
                </span>
              </li>
            </ul>
            <p className="text-gray-600">
              What sets ParkScout.io apart? It's crafted by someone who shares your love for the parks, with a focus on usability, authenticity, and the needs of today's travelers.
            </p>
          </section>

          {/* Vision Section */}
          <section className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-forest-700 mb-4">Our Vision</h2>
            <p className="text-gray-600 mb-4">
              At ParkScout.io, we believe in the power of nature to inspire, rejuvenate, and connect us with the world around us. My goal is to make national park adventures accessible to everyone, fostering a deeper appreciation for these natural treasures while promoting responsible exploration.
            </p>
            <p className="text-gray-600">
              I'm constantly working to expand the platform with new features, trails, and insights to help you get the most out of every trip.
            </p>
          </section>

          {/* Community Section */}
          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-forest-700 mb-4">Join the ParkScout.io Community</h2>
            <p className="text-gray-600 mb-6">
              Be part of our growing community of park enthusiasts!
            </p>
            <ul className="list-none space-y-4 mb-6">
              <li className="flex items-start">
                <span className="text-forest-600 mr-2">•</span>
                <span className="text-gray-600">
                  <strong className="text-gray-800">Stay Updated:</strong> Sign up for our newsletter for the latest features and updates.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-forest-600 mr-2">•</span>
                <span className="text-gray-600">
                  <strong className="text-gray-800">Share Your Tips:</strong> Contribute trail reviews or photos to help others on their journeys.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-forest-600 mr-2">•</span>
                <span className="text-gray-600">
                  <strong className="text-gray-800">Connect With Us:</strong> Follow ParkScout.io on social media and join the conversation.
                </span>
              </li>
            </ul>
            <p className="text-gray-600">
              Together, we can create a vibrant network of explorers who cherish and protect our national parks for generations to come.
            </p>
          </section>
        </div>

        {/* Toggle button - Only show when debug is enabled */}
        {showDebugInfo && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="mt-4 px-4 py-2 bg-forest-600 text-white rounded-md hover:bg-forest-700 transition-colors"
          >
            {showFullContent ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    </main>
  );
} 