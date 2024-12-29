'use client';

import { useEffect, useState } from 'react';
import { getParkData } from '@/app/actions/getParkData';
import { ParkData } from '@/app/types/parks';
import Link from 'next/link';

export default function ParksPage() {
  const [parks, setParks] = useState<ParkData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getParkData().then(data => {
      setParks(data.sort((a, b) => a.name.localeCompare(b.name)));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl text-black font-bold mb-6">All National Parks</h1>
          <div className="animate-pulse">Loading parks data...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl text-black font-bold mb-6">All National Parks</h1>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Established
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Annual Visitors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Area
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parks.map((park) => (
                  <tr key={park.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {park.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {park.location.lat.toFixed(2)}°, {park.location.lng.toFixed(2)}°
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {park.established}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {park.annualVisitors.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {park.area}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/park/${park.id}`}
                        className="text-forest-600 hover:text-forest-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {parks.map((park) => (
              <div key={park.id} className="border-b border-gray-200 p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{park.name}</h3>
                  <Link
                    href={`/park/${park.id}`}
                    className="text-forest-600 hover:text-forest-900 text-sm"
                  >
                    View Details
                  </Link>
                </div>
                <div className="space-y-1 text-sm text-gray-500">
                  <p>
                    <span className="font-medium">Location:</span> {park.location.lat.toFixed(2)}°, {park.location.lng.toFixed(2)}°
                  </p>
                  <p>
                    <span className="font-medium">Established:</span> {park.established}
                  </p>
                  <p>
                    <span className="font-medium">Annual Visitors:</span> {park.annualVisitors.toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Area:</span> {park.area}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 