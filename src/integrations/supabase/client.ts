
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dqktwoadrzdmveqbjosf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxa3R3b2FkcnpkbXZlcWJqb3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NDI5NDIsImV4cCI6MjA1OTMxODk0Mn0._Utw4NI3hxlr8JV6YYKwTyULInhbOdW9hgGHJeQlaFQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
