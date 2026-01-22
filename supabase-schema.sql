-- Brain Play - Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id TEXT PRIMARY KEY,
  game_pin TEXT UNIQUE NOT NULL,
  admin_id TEXT NOT NULL,
  questions JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('lobby', 'in_progress', 'finished')),
  current_question_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  allow_late_join BOOLEAN NOT NULL DEFAULT true,
  penalize_wrong_answers BOOLEAN NOT NULL DEFAULT true,
  question_start_time TIMESTAMPTZ,
  is_showing_results BOOLEAN NOT NULL DEFAULT false
);

-- Create players table
CREATE TABLE IF NOT EXISTS public.players (
  id TEXT PRIMARY KEY,
  game_pin TEXT NOT NULL REFERENCES public.quizzes(game_pin) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  team TEXT,
  school TEXT,
  avatar TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(game_pin, nickname)
);

-- Create player_answers table
CREATE TABLE IF NOT EXISTS public.player_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id TEXT NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  answer TEXT CHECK (answer IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN NOT NULL,
  time_taken_ms INTEGER NOT NULL,
  points_earned INTEGER NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(player_id, question_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_game_pin ON public.players(game_pin);
CREATE INDEX IF NOT EXISTS idx_player_answers_player_id ON public.player_answers(player_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_game_pin ON public.quizzes(game_pin);
CREATE INDEX IF NOT EXISTS idx_quizzes_status ON public.quizzes(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_answers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Allow public insert access to quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Allow public update access to quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Allow public read access to players" ON public.players;
DROP POLICY IF EXISTS "Allow public insert access to players" ON public.players;
DROP POLICY IF EXISTS "Allow public update access to players" ON public.players;
DROP POLICY IF EXISTS "Allow public read access to player_answers" ON public.player_answers;
DROP POLICY IF EXISTS "Allow public insert access to player_answers" ON public.player_answers;

-- Create policies for public access (since this is a simple game with no user auth)
-- Anyone can read all data
CREATE POLICY "Allow public read access to quizzes" ON public.quizzes
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to quizzes" ON public.quizzes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to quizzes" ON public.quizzes
  FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to players" ON public.players
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to players" ON public.players
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to players" ON public.players
  FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to player_answers" ON public.player_answers
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to player_answers" ON public.player_answers
  FOR INSERT WITH CHECK (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.quizzes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.player_answers;

-- Function to cleanup old quizzes (optional, run periodically)
CREATE OR REPLACE FUNCTION cleanup_old_quizzes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.quizzes
  WHERE created_at < NOW() - INTERVAL '24 hours'
    AND status = 'finished';
END;
$$ LANGUAGE plpgsql;
