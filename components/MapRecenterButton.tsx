'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-easybutton';
import 'leaflet-easybutton/src/easy-button.css';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import { renderToString } from 'react-dom/server';
import { useScreenSize } from '@/hooks/useScreenSize';

export default function MapRecenterButton() {
  const map = useMap();
  const isDesktop = useScreenSize();

  useEffect(() => {
    const btn = L.easyButton({
      position: 'topleft',
      states: [{
        stateName: 'recenter',
        icon: renderToString(
          <FaLocationCrosshairs className="text-forest-700 easy-button-icon" />
        ),
        title: 'Recenter map',
        onClick: () => {
          map.closePopup();
          map.setView(
            isDesktop 
              ? [35.6751, -113.5547]
              : [20.7972, -118.8281],
            isDesktop ? 3.0 : 2.0,
            {
              animate: true
            }
          );
        }
      }]
    }).addTo(map);

    return () => {
      btn.remove();
    };
  }, [map, isDesktop]);

  return null;
} 