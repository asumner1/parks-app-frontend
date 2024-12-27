'use server';

import { ParkData } from '../types/parks';
import parkJson from '../../public/national_parks.json';

export async function getParkData(): Promise<ParkData[]> {
  try {
    return parkJson.map((park: any) => ({
      id: park.Name.toLowerCase().replace(/\s+/g, '-'),
      name: park.Name,
      description: park.Description,
      location: {
        lat: park.Latitude,
        lng: park.Longitude
      },
      established: park.Established,
      area: park.Area,
      annualVisitors: park.Annual_Visitors,
      allTrailsUrl: park['AllTrails URL'] || undefined,
      mapUrls: park['Map Link'] ? park['Map Link'].split(' | ').filter(Boolean) : [],
      mapType: park['Map Type']
    }));
  } catch (error) {
    console.error('Failed to process park data:', error);
    throw new Error('Could not process national parks data');
  }
} 