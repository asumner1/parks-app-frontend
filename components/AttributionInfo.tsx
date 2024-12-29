import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const attributionText = 'Powered by Esri | Sources: Esri, HERE, Garmin, Intermap, INCREMENT P, GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), © OpenStreetMap contributors, GIS User Community';

export default function AttributionInfo() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={() => setShowPopup(!showPopup)}
          className="w-8 h-8 bg-white relative"
          title="Map Attribution"
        >
          <FaInfoCircle className="text-black easy-button-icon" size={16} />
        </button>
        {showPopup && (
          <div className="absolute bottom-full mb-2 right-0 bg-white p-4 rounded-lg shadow-lg max-w-xs text-sm">
            <p>{attributionText}</p>
          </div>
        )}
      </div>
    </div>
  );
} 