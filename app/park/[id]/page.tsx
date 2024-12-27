import { getParkData } from '@/app/actions/getParkData';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ParkPage({ params }: { params: { id: string } }) {
  const parks = await getParkData();
  const park = parks.find(p => p.id === params.id);
  
  if (!park) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link 
          href="/"
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Back to Map
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div 
            className="h-96 bg-cover bg-center"
            style={{ backgroundImage: `url(${park.imageUrl})` }}
          />
          
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">{park.name}</h1>
            <p className="mt-4 text-gray-600">{park.description}</p>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900">Best Time to Visit</h2>
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Season:</strong> {park.bestTimeToVisit?.season}</p>
                <p className="text-gray-700 mt-2"><strong>Months:</strong> {park.bestTimeToVisit?.months?.join(", ")}</p>
                <p className="text-gray-700 mt-2"><strong>Weather:</strong> {park.bestTimeToVisit?.weather}</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900">Activities</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {park.activities?.map((activity) => (
                  <span 
                    key={activity}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 