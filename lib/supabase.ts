import { createClient } from '@supabase/supabase-js';
import { ParkData } from '@/app/types/parks';

// Check if required environment variables are defined
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Initialize the Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const signInWithGoogle = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!session) return null;

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export async function getAllParks(): Promise<ParkData[]> {
  try {
    const { data, error } = await supabase
      .from('parks')
      .select('*')
      .order('name')
    
    if (error) {
      throw error
    }

    if (!data) {
      return []
    }

    return data.map((park) => ({
      id: park.id,
      name: park.name,
      description: park.description,
      location: {
        lat: park.latitude,
        lng: park.longitude
      },
      established: park.established,
      area: park.area,
      annualVisitors: park.annual_visitors,
      allTrailsUrl: park.alltrails_url,
      mapUrls: park.map_urls ? park.map_urls.split(' | ').filter(Boolean) : [],
      mapType: park.map_type,
      bestTimeToVisit: park.best_time_to_visit,
      activities: park.activities,
      imageUrl: park.image_url
    }))
  } catch (error) {
    console.error('Failed to fetch parks:', error)
    throw new Error('Failed to fetch parks data')
  }
}
