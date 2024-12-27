'use server';

import { ParkData } from '../types/parks';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { parse } from 'csv-parse/sync';

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
  const filePath = path.join(process.cwd(), 'public', 'data', 'national_parks.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

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