# Quick Setup Guide

## 1. Run SQL in Supabase

If you haven't already run the SQL setup script:

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase-setup.sql`
5. Paste into the query editor
6. Click **Run** or press `Cmd/Ctrl + Enter`

This will create:

- ✅ `books` table with proper schema
- ✅ `transactions` table
- ✅ Row Level Security (RLS) policies
- ✅ Seed data (3 initial books)

## 2. Verify Tables Created

1. Click **Table Editor** in Supabase sidebar
2. You should see:
   - `books` table with 3 rows
   - `transactions` table (empty initially)

## 3. Test the App

1. The dev server should already be running
2. Open the app on your device/emulator
3. You should see the books from Supabase
4. Try adding/editing/deleting books
5. Try completing a checkout transaction

## 4. Common Issues

**Books not showing:**

- Check that `.env.local` has correct Supabase URL and key
- Verify SQL script ran successfully without errors
- Check browser console/Metro logs for errors

**"Row Level Security" errors:**

- Ensure you ran the RLS policy creation in the SQL script
- Verify policies are enabled in Supabase dashboard

**Environment variable errors:**

- Variables must start with `EXPO_PUBLIC_`
- Restart dev server after changing env file
- File must be named `.env.local` exactly
