# Brain Play - Quick Start Guide

## 🎮 What is Brain Play?

A real-time multiplayer quiz game for kids and classrooms. No login required - just upload questions, share a PIN, and play!

**Perfect for:**
- 📚 Teachers hosting classroom quizzes
- 🎉 Interactive learning events
- 🏫 Team competitions
- 👨‍👩‍👧‍👦 Family game nights

## ⚡ 60-Second Setup

### 1. Start the Development Server
```bash
npm install    # First time only
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 2. Test the App
- Click **"Host Game"** → Upload a CSV file with questions
- Click **"Join Game"** → Enter Game PIN and play!

## 📋 CSV File Format

Create a `.csv` file with these **exact** column names:

```csv
Question,Option A,Option B,Option C,Option D,Correct Answer
What is 2+2?,3,4,5,6,B
What is H2O?,Oxygen,Water,Hydrogen,Salt,B
```

**Key Rules:**
- ✅ First row = headers (copy exactly as shown)
- ✅ `Correct Answer` = A, B, C, or D only
- ✅ Save as UTF-8 CSV

## 🎯 How It Works

### Host View
1. Upload CSV with questions
2. Preview to check questions
3. Copy the 6-digit Game PIN
4. Share PIN with players
5. Watch players join
6. Start the quiz
7. Advance questions manually
8. View leaderboard at the end

### Player View
1. Enter 6-digit Game PIN
2. Pick nickname and avatar
3. Answer each question quickly (30-second timer)
4. See immediate feedback (correct/wrong)
5. Watch your score update
6. Check the leaderboard
7. Get ranked at the end

## 📊 Scoring

| Action | Points |
|--------|--------|
| Correct answer | +100 |
| Speed bonus (< 5 sec) | +50 (varies by speed) |
| Wrong answer | -20 |

**Example:** Answer correctly in 2 seconds = 100 + 50 = **150 points**

## 🎨 Customization

### Change Timer (seconds)
Edit `src/components/QuizPlay.tsx` line 5:
```ts
const QUESTION_TIME = 30; // Change to desired seconds
```

### Change Colors
Edit `tailwind.config.js` in the `colors` section:
```js
colors: {
  primary: '#6366f1',    // Indigo
  secondary: '#ec4899',  // Pink
}
```

### Change Scoring
Edit `src/services/gameSession.ts` in `submitAnswer()` function

## 🚀 Deploy to Production

### Vercel (Recommended - Easiest)
1. Push code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repo
5. Click "Deploy" ✓

### Netlify
1. Push code to GitHub
2. Go to [Netlify.com](https://www.netlify.com)
3. Click "New site from Git"
4. Select your repo
5. Deploy ✓

### Manual Hosting
```bash
npm run build
# Upload the 'dist' folder to your host
```

## 🐛 Troubleshooting

### "CSV upload fails"
- Check column names match **exactly** (including spaces)
- Ensure first row has headers
- Correct Answer must be: `A`, `B`, `C`, or `D`
- Save file as CSV (not Excel)

### "Connection between host and players not syncing"
- This is client-side by default (works on same screen)
- For real multiplayer, configure Supabase in `.env.local` (advanced)

### "Game PIN doesn't work"
- Make sure it's exactly 6 digits
- Check quiz hasn't ended
- Try refreshing and rejoining

## 📱 Browser Support

✅ Chrome/Edge (best)  
✅ Firefox  
✅ Safari (iOS 13+)  
✅ Any modern browser with ES2020+ support

## 📚 Project Structure

```
src/
├── components/       # UI components (QuizPlay, Leaderboard, etc.)
├── pages/           # Full pages (LandingPage, HostPage, JoinPage)
├── context/         # Global state (GameContext)
├── services/        # Business logic (gameSession, supabase)
├── types/           # TypeScript definitions
├── utils/           # Helper functions (scoring, CSV parsing)
├── App.tsx          # Main app routing
└── index.css        # Tailwind CSS
```

## 🎓 Learning Outcomes

This project demonstrates:
- ✅ React Hooks (useState, useContext, useCallback)
- ✅ TypeScript for type safety
- ✅ Component composition
- ✅ Tailwind CSS for styling
- ✅ Real-time state management
- ✅ CSV parsing
- ✅ Responsive design (mobile-first)

## 🚢 Ready to Go Live?

1. ✅ Test with friends/family
2. ✅ Get feedback on difficulty
3. ✅ Adjust scoring if needed
4. ✅ Deploy to Vercel or Netlify
5. ✅ Share the link with your teacher/class

## 📞 Need Help?

- Check the **README.md** for detailed docs
- Review the code comments in `src/`
- All TypeScript types are documented
- CSV format examples in this guide

---

**Now you're ready!** 🎉

1. Create a CSV file with 5-10 test questions
2. Run `npm run dev`
3. Upload the CSV
4. Invite a friend and test it out
5. Deploy when you're happy!

Happy Quizzing! 🚀
