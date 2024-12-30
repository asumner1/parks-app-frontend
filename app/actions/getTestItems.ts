'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getTestItems() {
  try {
    const { data, error } = await supabase
      .from('testing')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data };
  } catch (err) {
    console.error('Error fetching test items:', err);
    throw new Error('Failed to fetch test items');
  }
} 