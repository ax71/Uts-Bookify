-- Bookify Database Setup and Seed Data
-- Run this in your Supabase SQL Editor

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price NUMERIC NOT NULL,
  cover_url TEXT NOT NULL,
  description TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  items JSONB NOT NULL,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to books table
DROP TRIGGER IF EXISTS update_books_updated_at ON books;
CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (since we're using anonymous auth)
-- Books policies
CREATE POLICY "Allow anonymous read access to books"
ON books FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anonymous insert access to books"
ON books FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to books"
ON books FOR UPDATE
TO anon
USING (true);

CREATE POLICY "Allow anonymous delete access to books"
ON books FOR DELETE
TO anon
USING (true);

-- Transactions policies
CREATE POLICY "Allow anonymous read access to transactions"
ON transactions FOR SELECT
TO anon
USING (true);

CREATE POLICY "Allow anonymous insert access to transactions"
ON transactions FOR INSERT
TO anon
WITH CHECK (true);

-- Insert seed data
INSERT INTO books (title, author, price, cover_url, description, category, stock)
VALUES 