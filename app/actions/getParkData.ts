'use server';

import { ParkData } from '../types/parks';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

interface CSVRecord {
  Name: string;
  Description: string;
  Latitude: string;
  Longitude: string;
  Established: string;
  Area: string;
  Annual_Visitors: string;
  'AllTrails URL': string;
  'Map Link': string;
  'Map Type': string;
}

export async function getParkData(): Promise<ParkData[]> {
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'national_parks.csv'),
    './public/national_parks.csv',
    path.join(process.cwd(), 'national_parks.csv'),
    './national_parks.csv'
  ];

  let fileContent: string | null = null;
  let successPath: string | null = null;

  for (const filePath of possiblePaths) {
    try {
      fileContent = fs.readFileSync(filePath, 'utf-8');
      successPath = filePath;
      console.log('Successfully read CSV from:', filePath);
      break;
    } catch (error) {
      console.log('Failed to read from:', filePath);
    }
  }

  if (!fileContent) {
    console.error('Could not read CSV from any of these locations:', possiblePaths);
    throw new Error('CSV file not found in any of the expected locations');
  }

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  }) as CSVRecord[];

  return records.map((record) => ({
    id: record.Name.toLowerCase().replace(/\s+/g, '-'),
    name: record.Name,
    description: record.Description,
    location: {
      lat: parseFloat(record.Latitude),
      lng: parseFloat(record.Longitude)
    },
    established: record.Established,
    area: record.Area,
    annualVisitors: parseInt(record.Annual_Visitors.replace(/,/g, '')),
    allTrailsUrl: record['AllTrails URL'] || undefined,
    mapUrls: record['Map Link'] ? record['Map Link'].split(' | ').filter(Boolean) : [],
    mapType: record['Map Type']
  }));
} 