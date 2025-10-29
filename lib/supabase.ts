import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://scoifapqetbgfwzfupnr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjb2lmYXBxZXRiZ2Z3emZ1cG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTI1MDUsImV4cCI6MjA3NzMyODUwNX0.YjoyhxY50AQkIs4XQSmLdWFFZxHFnN-h3OeQO0pgVXY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
