'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { ParkData } from '@/app/types/parks';
import { getParkData } from '@/app/actions/getParkData';
import { FaTree, FaMap } from 'react-icons/fa';
import { renderToString } from 'react-dom/server';
import MapRecenterButton from './MapRecenterButton';
import MapInfo from './MapInfo';
import { useScreenSize } from '@/hooks/useScreenSize';
import AttributionInfo from './AttributionInfo';
import { FaExternalLinkAlt } from 'react-icons/fa';
const treeIcon = L.divIcon({
  html: renderToString(
    <FaTree className="text-forest-600" size={24} />
  ),
  className: 'custom-div-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24]
});

const buttonStyle = "px-6 py-3 rounded-full bg-forest-500 text-white hover:bg-forest-600 transition-colors inline-flex items-center gap-1 no-underline !text-white";

export default function Map() {
  const [parks, setParks] = useState<ParkData[]>([]);
  const [loading, setLoading] = useState(true);
  const isDesktop = useScreenSize();
  const showDebugInfo = process.env.NEXT_PUBLIC_SHOW_DEBUG_INFO === 'true';

  const defaultCenter = isDesktop 
    ? [35.6751, -113.5547]
    : [20.7972, -118.8281];
  
  const defaultZoom = isDesktop ? 3.0 : 2.0;

  useEffect(() => {
    getParkData().then(data => {
      setParks(data);
      setLoading(false);
    });
  }, []);

  // const handleMarkerClick = useCallback((e: L.LeafletMouseEvent) => {
  //   if (!isDesktop) {
  //     const map = e.target._map;
  //     //const bounds = map.getBounds();
  //     //const center = bounds.getCenter();
  //     const bottomMiddle = map.containerPointToLatLng([
  //       map.getSize().x / 2,
  //       map.getSize().y * 0.85 // Position slightly above the bottom edge
  //     ]);
      
  //     map.panTo(e.latlng, { animate: true }).then(() => {
  //       setTimeout(() => {
  //         map.panTo(bottomMiddle, { animate: true });
  //       }, 300);
  //     });
  //   }
  // }, [isDesktop]);

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
              <h3 className="font-bold text-lg text-forest-800">{park.name}</h3>
              <p className="text-sm mt-1 text-gray-600">{park.description.substring(0, 150)}...</p>
              <div className="mt-2 text-sm text-forest-600">
                <p>Established: {park.established}</p>
                <p>Annual Visitors: {park.annualVisitors.toLocaleString()}</p>
                <p>Area: {park.area}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <a 
                  href={`/park/${park.id}`}
                  className={buttonStyle}
                >
                  View Details
                </a>
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
                        Map {park.mapUrls.length > 1 ? index + 1 : ''}  <FaExternalLinkAlt size={12} />
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