import React from 'react';
import { renderToString } from 'react-dom/server';
import { FaTree, FaCheckCircle } from 'react-icons/fa';
import L from 'leaflet';

export const createParkIcon = (isVisited: boolean) => {
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