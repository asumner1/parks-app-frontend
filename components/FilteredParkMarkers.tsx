import { Marker, Popup, LayerGroup } from 'react-leaflet';
import { ParkData } from '@/app/types/parks';
import Link from 'next/link';
import { FaMap, FaExternalLinkAlt } from 'react-icons/fa';
import VisitedButton from '@/components/VisitedButton';
import { createParkIcon } from '@/lib/mapUtils';

interface FilteredParkMarkersProps {
  parks: ParkData[];
  condition: (park: ParkData) => boolean;
  showCheckmark?: boolean;
}

const buttonStyle = "px-3 py-2 text-sm rounded-full bg-forest-500 text-white hover:bg-forest-600 transition-colors inline-flex items-center gap-1 no-underline !text-white";

export default function FilteredParkMarkers({ parks, condition, showCheckmark = true }: FilteredParkMarkersProps) {
  return (
    <LayerGroup>
      {parks
        .filter(condition)
        .map((park) => (
          <Marker
            key={park.id}
            position={[park.location.lat, park.location.lng]}
            icon={createParkIcon(showCheckmark)}
          >
            <Popup>
              <div className="max-w-xs">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h3 className="font-bold text-lg text-forest-800">{park.name}</h3>
                  <VisitedButton parkId={park.id} variant="compact" />
                </div>
                <p className="text-sm mt-1 text-gray-600">{park.description.substring(0, 150)}...</p>
                <div className="mt-2 text-sm text-forest-600">
                  <p>
                    Established: {park.established}
                    <br />
                    Annual Visitors: {park.annualVisitors.toLocaleString()}
                    <br />
                    Area: {park.area}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link 
                    href={`/park/${park.id}`}
                    className={buttonStyle}
                  >
                    View Details
                  </Link>
                  {park.allTrailsUrl && (
                    <a 
                      href={park.allTrailsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonStyle}
                    >
                      AllTrails <FaExternalLinkAlt size={12} />
                    </a>
                  )}
                </div>
                {park.mapUrls?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-semibold text-forest-700 mb-1">Park Maps:</p>
                    <div className="flex flex-wrap gap-2">
                      {park.mapUrls.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={buttonStyle}
                        >
                          <FaMap className="text-white" size={12} />
                          Map {park.mapUrls.length > 1 ? index + 1 : ''} <FaExternalLinkAlt size={12} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
    </LayerGroup>
  );
} 