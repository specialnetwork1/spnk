import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vtdbflycbzbkjeeuebmi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0ZGJmbHljYnpia2plZXVlYm1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NTAxNTYsImV4cCI6MjA4NTEyNjE1Nn0.EHoFE8eRmxVoygPH9mMM-_0hc9j9H5K54QjLOFfnL3A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
