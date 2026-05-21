import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://fchmdpamnqdqpwrnanjz.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'sb_publishable_EpvbaTONSjS-Rr5Qtokn_A_hDK9qJc-';

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase configuration error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be provided in environment variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
