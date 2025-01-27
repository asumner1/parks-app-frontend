import { Marker, Popup, LayerGroup} from 'react-leaflet';
import { ParkData } from '@/app/types/parks';
import Link from 'next/link';
import { FaMap, FaExternalLinkAlt, FaTree, FaCheckCircle } from 'react-icons/fa';
import VisitedButton from '@/components/VisitedButton';
import { renderToString } from 'react-dom/server';
import L from 'leaflet';

interface FilteredParkMarkersProps {
  parks: ParkData[];
  condition: (park: ParkData) => boolean;
  showCheckmark?: boolean;
}

const buttonStyle = "px-3 py-2 text-sm rounded-full bg-forest-500 text-white hover:bg-forest-600 transition-colors inline-flex items-center gap-1 no-underline !text-white";

const createParkIcon = (isVisited: boolean) => {
  const iconHtml = renderToString(
    <div className="relative" style={{ width: 28, height: 28 }}>
      <FaTree className="text-forest-600" size={24} style={{ position: 'absolute', zIndex: 1 }} />
      
      {isVisited && (
        <FaCheckCircle
          className="text-forest-500"
          size={16}
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            zIndex: 2,
            backgroundColor: 'white',
            borderRadius: '50%',
            padding: 2,
          }}
        />
      )}
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-div-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

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