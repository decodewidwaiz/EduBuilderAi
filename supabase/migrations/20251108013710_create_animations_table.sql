/*
  # Create animations table for storing user-created animations

  1. New Tables
    - `animations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `description` (text)
      - `topic` (text)
      - `data` (jsonb, stores the AnimationSequence)
      - `difficulty` (text)
      - `tags` (text array)
      - `is_public` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `animations` table
    - Add policies for authenticated users to manage their own animations
    - Add policy to view public animations
*/

CREATE TABLE IF NOT EXISTS animations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  topic text,
  data jsonb NOT NULL,
  difficulty text DEFAULT 'beginner',
  tags text[] DEFAULT '{}',
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE animations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own animations"
  ON animations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public animations"
  ON animations FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can create animations"
  ON animations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own animations"
  ON animations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own animations"
  ON animations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_animations_user_id ON animations(user_id);
CREATE INDEX idx_animations_is_public ON animations(is_public);
CREATE INDEX idx_animations_topic ON animations(topic);
