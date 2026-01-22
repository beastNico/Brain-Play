-- Clean up any existing tables first
-- Run this BEFORE running supabase-schema.sql
-- CASCADE will automatically drop policies and constraints

DROP TABLE IF EXISTS public.player_answers CASCADE;
DROP TABLE IF EXISTS public.players CASCADE;
DROP TABLE IF EXISTS public.quizzes CASCADE;
DROP TABLE IF EXISTS public.game_sessions CASCADE;
