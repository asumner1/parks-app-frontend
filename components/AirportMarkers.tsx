import { Marker, Popup, LayerGroup} from 'react-leaflet';
import { AirportData } from '@/app/types/airports';
import { FaPlane } from 'react-icons/fa';
import { renderToString } from 'react-dom/server';
import L from 'leaflet';

interface AirportMarkersProps {
  airports: AirportData[];
}

const createAirportIcon = () => {
  const iconHtml = renderToString(
    <div className="relative" style={{ width: 28, height: 28 }}>
      <FaPlane 
        className="text-sky-600" 
        size={24} 
        style={{ 
          position: 'absolute', 
          zIndex: 1,
          transform: 'rotate(-45deg)' 
        }} 
      />
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

export default function AirportMarkers({ airports }: AirportMarkersProps) {
  return (
    <LayerGroup>
      {airports.map((airport) => (
        <Marker
          key={airport.id}
          position={[airport.location.lat, airport.location.lng]}
          icon={createAirportIcon()}
        >
          <Popup>
            <div className="max-w-xs">
              <h3 className="font-bold text-lg text-sky-800">
                {airport.airport_name}
              </h3>
              <div className="mt-2 text-sm text-sky-600">
                <p>
                  <strong>IATA Identifier Code:</strong> {airport.iata}
                  <br />
                  <strong>City:</strong> {airport.city}
                  <br />
                  <strong>Region:</strong> {airport.region_name}
                  <br />
                  <strong>Annual Passengers (2019):</strong> {airport.enplanements.toLocaleString()}
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </LayerGroup>
  );
} 