# Supabase Migration - Issue Fix

## Issue: "window is not defined" Error

### Problem

When running `npx expo start`, the app crashed with:

```
ReferenceError: window is not defined
    at getValue (/node_modules/@react-native-async-storage/async-storage/...)
```

### Root Cause

AsyncStorage doesn't work on web platforms during server-side rendering. Supabase was trying to use AsyncStorage for session persistence on web, but the `window` object wasn't available.

### Solution

Updated `lib/supabase.ts` to use platform-specific storage:

- **Web**: Uses default localStorage (undefined in config, Supabase uses localStorage automatically)
- **Native (iOS/Android)**: Uses AsyncStorage

### Code Change

```typescript
import { Platform } from "react-native";

const supabaseStorage =
  Platform.OS === "web"
    ? undefined // Use default web storage (localStorage)
    : AsyncStorage; // Use AsyncStorage for native platforms

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseStorage as any,
    // ... other config
  },
});
```

### Result ✅

- App now runs successfully on all platforms (web, iOS, Android)
- No more "window is not defined" errors
- Session persistence works correctly on each platform
