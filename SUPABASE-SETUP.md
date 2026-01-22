# Supabase Setup Guide - 5 Minutes

Follow these steps to enable real-time multiplayer for Brain Play.

## Step 1: Create Supabase Account (1 min)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (easiest) or email

## Step 2: Create New Project (1 min)

1. Click "New Project"
2. Fill in:
   - **Name**: `brain-play` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
3. Click "Create new project"
4. Wait 2 minutes for setup to complete ☕

## Step 3: Run Database Schema (1 min)

1. In your Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New query"
3. Open the file `supabase-schema.sql` in your project
4. **Copy ALL the SQL code** from that file
5. **Paste** it into the Supabase SQL Editor
6. Click "Run" button (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

This creates the tables: `quizzes`, `players`, and `player_answers`

## Step 4: Get Your Credentials (1 min)

1. Click "Settings" (gear icon) in the left sidebar
2. Click "API" under Project Settings
3. You'll see two important values:

   **Copy these:**
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 5: Update Your .env File (1 min)

1. In your project folder, find `.env.example`
2. Copy it and rename to `.env.local`
3. Open `.env.local` and update:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-actual-key-here...
```

4. Save the file

## Step 6: Verify Setup

Run in terminal:
```bash
npm install
npm run dev
```

If you see the app load without errors, you're good! 🎉

## Troubleshooting

**Error: "Invalid API key"**
- Check you copied the ANON key (not service_role key)
- Make sure .env.local has no extra spaces

**Error: "relation does not exist"**
- Re-run the SQL schema (Step 3)
- Make sure you clicked "Run"

**Can't find .env.local**
- It should be in the root folder (same level as package.json)
- If missing, create it manually

## Test Multiplayer

1. Start the app: `npm run dev`
2. Click "Host Quiz"
3. Upload CSV, get a game PIN
4. Open the app in a new browser tab (or on your phone)
5. Click "Join Game" and enter the PIN
6. You should see the player appear in real-time! 🚀

---

**Need Help?** Check the console for errors or open an issue on GitHub.
