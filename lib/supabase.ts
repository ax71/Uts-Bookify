import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import "react-native-url-polyfill/auto";

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL! ||
  "https://fyoaqepsjqqidepwcery.supabase.co";
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY! ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5b2FxZXBzanFxaWRlcHdjZXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5Mjc4NjEsImV4cCI6MjA3ODUwMzg2MX0.EOF0_cDkTjbKettr0SxrbZRv28KcM39MRK_naFJBl78";

const supabaseStorage = Platform.OS === "web" ? undefined : AsyncStorage;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
