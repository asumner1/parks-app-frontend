'use client';

import { useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { FaCopy } from 'react-icons/fa';

export default function MapInfo() {
  const map = useMap();
  const [center, setCenter] = useState(map.getCenter());
  const [zoom, setZoom] = useState(map.getZoom());
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const updateMapInfo = () => {
      setCenter(map.getCenter());
      setZoom(map.getZoom());
    };

    map.on('move', updateMapInfo);
    map.on('zoom', updateMapInfo);

    return () => {
      map.off('move', updateMapInfo);
      map.off('zoom', updateMapInfo);
    };
  }, [map]);

  const copyToClipboard = async () => {
    const mapInfo = `Center: ${center.lat.toFixed(4)}°, ${center.lng.toFixed(4)}°\nZoom: ${zoom.toFixed(1)}`;
    try {
      await navigator.clipboard.writeText(mapInfo);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (error: unknown) {
      console.error('Failed to copy:', error);
      setCopySuccess('Failed to copy');
    }
  };

  const coordinatesText = `${center.lat.toFixed(4)}°, ${center.lng.toFixed(4)}°`;
  const zoomText = zoom.toFixed(1);

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control bg-white px-4 py-2 rounded-lg shadow-md m-2 text-sm select-text relative">
        <div className="mb-1">
          <p className="text-forest-700">
            <span className="font-semibold">Center:</span>{' '}
            <span className="select-all">{coordinatesText}</span>
          </p>
        </div>
        <div>
          <p className="text-forest-700">
            <span className="font-semibold">Zoom:</span>{' '}
            <span className="select-all">{zoomText}</span>
          </p>
        </div>
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 p-1.5 hover:bg-forest-100 rounded transition-colors"
          title="Copy map position"
        >
          <FaCopy className="text-forest-600 w-3.5 h-3.5" />
        </button>
        {copySuccess && (
          <div className="absolute top-0 right-0 transform -translate-y-full bg-forest-600 text-white px-2 py-1 rounded text-xs mt-1">
            {copySuccess}
          </div>
        )}
      </div>
    </div>
  );
} 