import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uitseyvusbbutkcejoye.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpdHNleXZ1c2JidXRrY2Vqb3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MzQ2MjUsImV4cCI6MjA3NjUxMDYyNX0.oPTBz6r78V-Ac11mRtSE2skG4Ej4rdwlv0Mq2bRJQ3U";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
