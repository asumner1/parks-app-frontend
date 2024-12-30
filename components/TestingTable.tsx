'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

interface TestItem {
  id: number;
  created_at: string;
  content: string;
  test_value: string;
}

interface TestingTableProps {
  className?: string;
}

export default function TestingTable({ className = '' }: TestingTableProps) {
  const [testItems, setTestItems] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTestItems() {
      try {
        const { data, error } = await supabase
          .from('testing')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setTestItems(data || []);
      } catch (err) {
        console.error('Error fetching test items:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    }

    fetchTestItems();
  }, []);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (testItems.length === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
        <p className="text-gray-600">No test items found.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {testItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.content}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.test_value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 