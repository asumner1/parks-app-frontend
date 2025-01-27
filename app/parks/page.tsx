'use client';

import { useParks } from '@/contexts/ParkContext';
import Link from 'next/link';
import VisitedButton from '@/components/VisitedButton';

export default function ParksPage() {
  const { sortedParks, loading } = useParks();

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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedParks.map((park) => (
                  <tr key={park.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span>{park.name}</span>
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
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/park/${park.id}`}
                          className="text-forest-600 hover:text-forest-900"
                        >
                          View Details
                        </Link>
                        <div className="h-4 w-px bg-gray-300" aria-hidden="true" />
                        <VisitedButton parkId={park.id} variant="compact" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {sortedParks.map((park) => (
              <div key={park.id} className="border-b border-gray-200">
                <button
                  onClick={() => {
                    const details = document.getElementById(`details-${park.id}`);
                    const icon = document.getElementById(`icon-${park.id}`);
                    const button = document.getElementById(`button-${park.id}`);
                    if (details && icon && button) {
                      const isExpanded = !details.classList.contains('hidden');
                      details.classList.toggle('hidden');
                      icon.classList.toggle('rotate-180');
                      button.classList.toggle('bg-gray-50', !isExpanded);
                    }
                  }}
                  id={`button-${park.id}`}
                  className="w-full p-4 flex justify-between items-center transition-colors"
                >
                  <h3 className="text-lg font-medium text-gray-900">{park.name}</h3>
                  <svg
                    id={`icon-${park.id}`}
                    className="h-5 w-5 text-gray-500 transform transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                
                <div id={`details-${park.id}`} className="hidden p-4 bg-gray-50">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <VisitedButton parkId={park.id} variant="compact" />
                    </div>
                    <p>
                      <span className="font-medium text-gray-900">Location:</span>{' '}
                      {park.location.lat.toFixed(2)}°, {park.location.lng.toFixed(2)}°
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">Established:</span>{' '}
                      {park.established}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">Annual Visitors:</span>{' '}
                      {park.annualVisitors.toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">Area:</span>{' '}
                      {park.area}
                    </p>
                    <Link
                      href={`/park/${park.id}`}
                      className="mt-4 inline-block px-4 py-2 bg-forest-600 text-white rounded-md hover:bg-forest-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 