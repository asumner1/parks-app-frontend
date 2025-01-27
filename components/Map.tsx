'use client';

import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
//import { MdOutlinePark, MdPark } from 'react-icons/md';

import MapRecenterButton from './MapRecenterButton';
import MapInfo from './MapInfo';
import { useScreenSize } from '@/hooks/useScreenSize';
import AttributionInfo from './AttributionInfo';
import { useParks } from '@/contexts/ParkContext';
import { useUserContext } from '@/contexts/UserContext';
import FilteredParkMarkers from './FilteredParkMarkers';

export default function Map() {
  const { parks, loading } = useParks();
  const { isVisited } = useUserContext();
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
      {/* Base layer outside of LayersControl */}
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
      />

      <LayersControl position="topright">
        {/* Only Overlays in the control */}
        <LayersControl.Overlay checked name="Visited Parks">
          <FilteredParkMarkers 
            parks={parks}
            condition={(park) => isVisited(park.id)}
            showCheckmark={true}
          />
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Unvisited Parks">
          <FilteredParkMarkers 
            parks={parks}
            condition={(park) => !isVisited(park.id)}
            showCheckmark={false}
          />
        </LayersControl.Overlay>
      </LayersControl>

      {/* Components outside LayersControl will always be visible */}
      <AttributionInfo />
      <MapRecenterButton />
      {showDebugInfo && <MapInfo />}
    </MapContainer>
  );
} 