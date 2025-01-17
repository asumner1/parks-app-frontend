'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaTree, FaMap, FaExternalLinkAlt } from 'react-icons/fa';
import { renderToString } from 'react-dom/server';
import MapRecenterButton from './MapRecenterButton';
import MapInfo from './MapInfo';
import { useScreenSize } from '@/hooks/useScreenSize';
import AttributionInfo from './AttributionInfo';
import { useParks } from '@/lib/context/ParkContext';
import Link from 'next/link';
import VisitedButton from '@/components/VisitedButton';

const treeIcon = L.divIcon({
  html: renderToString(
    <FaTree className="text-forest-600" size={24} />
  ),
  className: 'custom-div-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24]
});

const buttonStyle = "px-3 py-2 text-sm rounded-full bg-forest-500 text-white hover:bg-forest-600 transition-colors inline-flex items-center gap-1 no-underline !text-white";

export default function Map() {
  const { parks, loading } = useParks();
  const isDesktop = useScreenSize();
  const showDebugInfo = process.env.NEXT_PUBLIC_SHOW_DEBUG_INFO === 'true';

  const defaultCenter = isDesktop 
    ? [35.6751, -113.5547]
    : [20.7972, -118.8281];
  
  const defaultZoom = isDesktop ? 3.0 : 2.0;

  if (loading) {
    return <div>Loading parks data...</div>;
  }

  return (
    <MapContainer
      center={defaultCenter as [number, number]}
      zoom={defaultZoom}
      className="h-[calc(100dvh-64px)] w-full"
      scrollWheelZoom={true}
      style={{ zIndex: 1 }}
      attributionControl={false}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
      />
      <AttributionInfo />
      <MapRecenterButton />
      {showDebugInfo && <MapInfo />}
      {parks.map((park) => (
        <Marker
          key={park.id}
          position={[park.location.lat, park.location.lng]}
          icon={treeIcon}
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
    </MapContainer>
  );
} 