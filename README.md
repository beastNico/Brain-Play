# Brain Play - Real-Time Multiplayer Quiz Game

A fast, engaging real-time multiplayer quiz game. Host uploads questions, players join with a PIN and answer in real-time with live scoring and leaderboard.

## Quick Start

```bash
npm install
npm run dev          # Development server on http://localhost:5173
npm run build        # Production build
npm test             # Run tests (57 tests)
```

## Setup

Create `.env.local`:
```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your_key_here
```

## CSV Format

Upload a CSV with columns: `Question`, `Option A`, `Option B`, `Option C`, `Option D`, `Correct Answer`

```csv
Question,Option A,Option B,Option C,Option D,Correct Answer
What is 2+2?,3,4,5,6,B
What is the capital of France?,London,Paris,Berlin,Madrid,B
```

## File Structure

```
src/
├── components/
│   ├── CSVUpload.tsx       # CSV file upload
│   ├── QuizPlay.tsx        # Main quiz gameplay with timer and leaderboard
│   ├── Leaderboard.tsx     # Final results leaderboard
│   └── QuestionPreview.tsx # Question preview modal
├── pages/
│   ├── LandingPage.tsx     # Home: Host or Join
│   ├── HostPage.tsx        # Host: Upload CSV, manage quiz
│   └── JoinPage.tsx        # Player: Enter PIN, select avatar
├── context/
│   └── GameContext.tsx     # Global game state
├── services/
│   ├── supabase.ts         # Supabase client
│   └── gameSession.ts      # Game logic (scoring, pin generation)
├── types/index.ts          # TypeScript types
├── utils/helpers.ts        # CSV parsing, utilities
└── App.tsx                 # App router and layout
```

## Workflow

### Host Flow
1. Click **"HOST"** → Upload CSV with questions → Preview → **Start Quiz**
2. Get 6-digit Game PIN
3. Share PIN with players
4. Monitor **live leaderboard** during quiz (top 5 players)
5. Each question auto-advances after 10 seconds
6. See **final leaderboard** when quiz ends

### Player Flow
1. Click **"JOIN"** → Enter **6-digit PIN** → Enter **nickname**
2. Select **avatar** → Optionally add team name
3. See 4 answer options (A/B/C/D) with **countdown timer**
4. Answer is locked when selected
5. See **immediate feedback** (correct/incorrect highlight)
6. Track **score** in live leaderboard (top 5 visible during quiz)
7. View **final leaderboard** with accuracy % when quiz ends

## Features

- **Speed Bonus**: Up to 50 bonus points for fast answers (less than 5 seconds)
- **Scoring**: +100 for correct, -20 for wrong (configurable)
- **Live Leaderboard**: Top 5 players visible during quiz
- **Auto-Advance**: Questions auto-proceed every 10 seconds
- **Retro Design**: 80s/90s aesthetic with cyan and yellow colors
- **Mobile-Ready**: Fully responsive (phones, tablets, desktops)
- **No Login**: PIN-based sessions, expires when quiz ends

## Scoring Calculation

```
Correct answer: 100 points
Speed bonus: 0-50 points (based on answer time)
Wrong answer: -20 points
Total: Base + Speed Bonus
```

## Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Supabase (optional - for multiplayer sync)
- Vitest (testing - 57 tests)

## Deployment

### Vercel (Recommended)
```bash
npm run build
# Push to GitHub → Connect to Vercel → Auto-deploy
```

### Netlify
```bash
npm run build
# Push to GitHub → Connect to Netlify → Auto-deploy
```

### Environment Variables
Set in your hosting provider:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`