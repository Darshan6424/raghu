/*
  # Initial Schema Setup for Emergency Response Hub

  1. New Tables
    - profiles
      - id (uuid, primary key)
      - username (text)
      - avatar_url (text)
      - created_at (timestamptz)
    
    - missing_persons
      - id (uuid, primary key)
      - name (text)
      - age (integer)
      - gender (text)
      - last_seen_location (text)
      - identifying_features (text)
      - image_url (text)
      - reporter_contact (text)
      - reporter_id (uuid, references profiles)
      - latitude (float8)
      - longitude (float8)
      - status (text)
      - view_count (integer)
      - created_at (timestamptz)

    - missing_person_comments
      - id (uuid, primary key)
      - missing_person_id (uuid, references missing_persons)
      - content (text)
      - image_url (text)
      - latitude (float8)
      - longitude (float8)
      - location_name (text)
      - user_id (uuid, references profiles)
      - likes (integer)
      - user_likes (uuid[])
      - created_at (timestamptz)

    - damage_reports
      - id (uuid, primary key)
      - location (text)
      - description (text)
      - image_url (text)
      - reporter_id (uuid, references profiles)
      - latitude (float8)
      - longitude (float8)
      - has_casualties (boolean)
      - verified (boolean)
      - view_count (integer)
      - created_at (timestamptz)

    - damage_report_comments
      - id (uuid, primary key)
      - damage_report_id (uuid, references damage_reports)
      - content (text)
      - image_url (text)
      - user_id (uuid, references profiles)
      - likes (integer)
      - user_likes (uuid[])
      - created_at (timestamptz)

    - expert_videos
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - video_url (text)
      - expert_id (uuid, references profiles)
      - created_at (timestamptz)

    - expert_consultations
      - id (uuid, primary key)
      - question (text)
      - answer (text)
      - contact_info (text)
      - status (text)
      - created_at (timestamptz)

    - news_updates
      - id (uuid, primary key)
      - title (text)
      - content (text)
      - image_url (text)
      - category (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Set up appropriate access policies for each table
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create missing_persons table
CREATE TABLE IF NOT EXISTS missing_persons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age integer,
  gender text,
  last_seen_location text NOT NULL,
  identifying_features text,
  image_url text,
  reporter_contact text,
  reporter_id uuid REFERENCES profiles(id),
  latitude float8,
  longitude float8,
  status text DEFAULT 'missing',
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE missing_persons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Missing persons are viewable by everyone"
  ON missing_persons FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create missing person reports"
  ON missing_persons FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own reports"
  ON missing_persons FOR UPDATE
  USING (auth.uid() = reporter_id);

-- Create missing_person_comments table
CREATE TABLE IF NOT EXISTS missing_person_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  missing_person_id uuid REFERENCES missing_persons(id) ON DELETE CASCADE,
  content text NOT NULL,
  image_url text,
  latitude float8,
  longitude float8,
  location_name text,
  user_id uuid REFERENCES profiles(id),
  likes integer DEFAULT 0,
  user_likes uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE missing_person_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON missing_person_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON missing_person_comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create damage_reports table
CREATE TABLE IF NOT EXISTS damage_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location text NOT NULL,
  description text NOT NULL,
  image_url text,
  reporter_id uuid REFERENCES profiles(id),
  latitude float8,
  longitude float8,
  has_casualties boolean DEFAULT false,
  verified boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE damage_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Damage reports are viewable by everyone"
  ON damage_reports FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create damage reports"
  ON damage_reports FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create damage_report_comments table
CREATE TABLE IF NOT EXISTS damage_report_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  damage_report_id uuid REFERENCES damage_reports(id) ON DELETE CASCADE,
  content text NOT NULL,
  image_url text,
  user_id uuid REFERENCES profiles(id),
  likes integer DEFAULT 0,
  user_likes uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE damage_report_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Damage report comments are viewable by everyone"
  ON damage_report_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create damage report comments"
  ON damage_report_comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create expert_videos table
CREATE TABLE IF NOT EXISTS expert_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  expert_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expert_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Expert videos are viewable by everyone"
  ON expert_videos FOR SELECT
  USING (true);

CREATE POLICY "Only experts can create videos"
  ON expert_videos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create expert_consultations table
CREATE TABLE IF NOT EXISTS expert_consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text,
  contact_info text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expert_consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Consultations are viewable by everyone"
  ON expert_consultations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create consultation requests"
  ON expert_consultations FOR INSERT
  WITH CHECK (true);

-- Create news_updates table
CREATE TABLE IF NOT EXISTS news_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  image_url text,
  category text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE news_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "News updates are viewable by everyone"
  ON news_updates FOR SELECT
  USING (true);

-- Create trigger to handle user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();