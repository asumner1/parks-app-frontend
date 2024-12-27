export interface ParkData {
  id: string;
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  established: string;
  area: string;
  annualVisitors: number;
  allTrailsUrl?: string;
  mapUrls: string[];
  mapType: string;
  bestTimeToVisit?: {
    months?: string[];
    season?: string;
    weather?: string;
  };
  activities?: string[];
  imageUrl?: string;
} 