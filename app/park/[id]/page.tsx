import { getParkData } from '@/app/actions/getParkData';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ParkPage({ params }: Props) {
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
          className="px-6 py-3 rounded-full bg-forest-500 text-white hover:bg-forest-600 transition-colors inline-flex items-center gap-1 no-underline !text-white mb-6"
        >
          ← Back to Map
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {park.imageUrl && (
            <div 
              className="h-96 bg-cover bg-center"
              style={{ backgroundImage: `url(${park.imageUrl})` }}
            />
          )}
          
          <div className="p-6">
            <h1 className="text-3xl font-bold text-forest-800">{park.name}</h1>
            <p className="mt-4 text-gray-600">{park.description}</p>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-forest-800">Best Time to Visit</h2>
              {park.bestTimeToVisit ? (
                <div className="mt-4 bg-forest-50 p-4 rounded-lg">
                  {park.bestTimeToVisit.season && (
                    <p className="text-forest-700"><strong>Season:</strong> {park.bestTimeToVisit.season}</p>
                  )}
                  {park.bestTimeToVisit.months && (
                    <p className="text-forest-700 mt-2"><strong>Months:</strong> {park.bestTimeToVisit.months.join(", ")}</p>
                  )}
                  {park.bestTimeToVisit.weather && (
                    <p className="text-forest-700 mt-2"><strong>Weather:</strong> {park.bestTimeToVisit.weather}</p>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-gray-600">Information not available</p>
              )}
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-forest-800">Activities</h2>
              {park.activities && park.activities.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {park.activities.map((activity) => (
                    <span 
                      key={activity}
                      className="px-3 py-1 bg-forest-100 text-forest-700 rounded-full text-sm"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-gray-600">No activities listed</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 