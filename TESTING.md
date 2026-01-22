# Testing the Multiplayer Game - Quick Guide

After setting up Supabase, follow these steps to test the multiplayer functionality.

## Step 1: Start the Development Server

```bash
cd Brain-Play
npm install
npm run dev
```

The app should open at `http://localhost:5173`

## Step 2: Create a Game (Host)

1. Click **"Host Quiz"**
2. Upload the `sample-questions.csv` file (included in the project)
3. You'll see a **6-digit Game PIN** (e.g., `123456`)
4. **Leave this window open** - this is the host view
5. You should see "Players Joined: 0"

## Step 3: Join as a Player

Open a **second browser window** or use your phone:

### Option A: Same Computer (Easy Testing)
1. Open a new browser tab/window
2. Go to `http://localhost:5173`
3. Click **"Join Game"**
4. Enter the 6-digit PIN from the host screen
5. Enter your nickname (e.g., "Alice")
6. Choose an avatar
7. Click **"Join Game"**

### Option B: Different Device (Real Scenario)
1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4 Address like `192.168.1.5`)
   - Mac/Linux: `ifconfig` or `ip addr`
2. On your phone/tablet, open browser
3. Go to `http://YOUR-IP:5173` (e.g., `http://192.168.1.5:5173`)
4. Click "Join Game" and enter the PIN

## Step 4: Verify Real-Time Sync

After a player joins:

✅ **Host window should show**: "Players Joined: 1" (updates automatically)
✅ **Player window should show**: Waiting in lobby
✅ **No page refresh needed** - it's real-time!

Try joining with multiple players to see the count increase.

## Step 5: Start the Quiz

1. On the **host window**, click **"Start Quiz Now!"**
2. **All player windows** should automatically show the first question
3. **Everyone sees the same question** at the same time

## Step 6: Answer Questions

1. Players select their answers (A, B, C, or D)
2. Each player sees immediate feedback (correct/wrong)
3. Scores update in real-time
4. **Host controls** when to move to the next question
5. Players see "Waiting for host to continue..." after answering

## Step 7: Check Leaderboard

1. After all questions, everyone sees the **Final Leaderboard**
2. Rankings are based on score (correct answers + speed bonus)
3. Host and players see the same results

## Common Issues & Solutions

### ❌ "Invalid API key" error
- Make sure you created `.env.local` file (not `.env.example`)
- Double-check your Supabase URL and key
- Restart the dev server: `Ctrl+C` then `npm run dev`

### ❌ Players can't join (Game not found)
- Make sure the host created the game first
- Verify the 6-digit PIN is correct
- Check that Supabase SQL schema was run successfully

### ❌ "Nickname already taken" error
- Each player needs a unique nickname per game
- Try a different nickname

### ❌ Real-time updates not working
- Check browser console for errors (F12)
- Verify Supabase realtime is enabled (it should be by default)
- Make sure you ran the SQL schema completely

### ❌ Can't access from phone
- Ensure phone and computer are on the same WiFi network
- Check firewall isn't blocking port 5173
- Try `http://YOUR-IP:5173` not `localhost`

## Advanced Testing

### Test with Multiple Players
1. Open 3-4 browser tabs
2. Join with different nicknames
3. Answer questions at different speeds
4. Verify scores and rankings are correct

### Test Late Join
1. Start a quiz with 1 player
2. Have another player join mid-game
3. They should see the current question

### Test Host Controls
- Only the host should see "Next Question" button
- Players should wait for host to progress
- Quiz ends when host finishes last question

## What Should Happen?

✅ **Real-Time Player List**: Host sees new players join instantly
✅ **Synchronized Questions**: All players see the same question
✅ **Individual Scoring**: Each player has their own score
✅ **Live Leaderboard**: Rankings update as answers come in
✅ **Host Control**: Only host advances questions
✅ **Speed Bonus**: Faster correct answers get more points

## Production Testing

After deploying to Vercel/Netlify:

1. Update `.env` variables in the deployment platform
2. Test with actual phones/tablets on different networks
3. Verify it works without being on the same WiFi

---

## Need Help?

Check the browser console (F12) for error messages. Common fixes:
- Restart dev server
- Clear browser cache
- Re-run SQL schema in Supabase
- Verify `.env.local` has correct credentials
