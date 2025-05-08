
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://guoqzicdumkitkfocyiq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1b3F6aWNkdW1raXRrZm9jeWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNzg1OTMsImV4cCI6MjA2MTk1NDU5M30.gAYv3LabWa7r6nm3C_fZQ0XU8EYSssgX0OdUHqV4-SI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
