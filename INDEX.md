# Brain Play - Complete Documentation Index

Welcome to Brain Play! Here's everything you need to know.

## 📚 Documentation Files

### Getting Started
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
  - Start the dev server
  - Create your first quiz
  - Play a test game
  - Customize colors & timing

### Features & How-to
- **[README.md](README.md)** - Complete feature documentation
  - Host features (CSV upload, PIN generation, admin dashboard)
  - Player features (join, avatar selection, scoring)
  - Scoring system explanation
  - Troubleshooting

### Deployment
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to production
  - Vercel (recommended, easiest)
  - Netlify
  - GitHub Pages
  - Traditional hosting
  - Domain setup
  - Cost estimates

### This File
- **[INDEX.md](INDEX.md)** - You are here!
  - Documentation roadmap
  - File structure
  - Quick reference

---

## 🗂️ Project Structure

```
Brain Play/
│
├── 📄 Documentation (Start Here!)
│   ├── README.md              # Main documentation
│   ├── QUICKSTART.md          # 5-minute setup
│   ├── DEPLOYMENT.md          # Deploy to production
│   └── INDEX.md               # This file
│
├── 📁 Source Code (src/)
│   ├── components/            # React UI components
│   │   ├── CSVUpload.tsx      # Upload & validate CSV
│   │   ├── QuestionPreview.tsx # Preview questions modal
│   │   ├── QuizPlay.tsx        # Main gameplay screen
│   │   └── Leaderboard.tsx     # Live rankings
│   │
│   ├── pages/                 # Full page components
│   │   ├── LandingPage.tsx    # Home / role selection
│   │   ├── HostPage.tsx       # Admin quiz setup
│   │   └── JoinPage.tsx       # Player join interface
│   │
│   ├── context/               # Global app state
│   │   └── GameContext.tsx    # All game state (players, scores, etc.)
│   │
│   ├── services/              # Business logic
│   │   ├── gameSession.ts     # Quiz game logic
│   │   └── supabase.ts        # Database connection (optional)
│   │
│   ├── types/                 # TypeScript definitions
│   │   └── index.ts           # All type definitions
│   │
│   ├── utils/                 # Helper functions
│   │   └── helpers.ts         # CSV parsing, scoring, formatting
│   │
│   ├── App.tsx                # Main app routing
│   ├── main.tsx               # App entry point
│   └── index.css              # Global styles + Tailwind
│
├── 📁 Configuration
│   ├── package.json           # Dependencies & scripts
│   ├── tsconfig.json          # TypeScript config
│   ├── tailwind.config.js     # Tailwind CSS theme
│   ├── postcss.config.js      # PostCSS (CSS processing)
│   ├── vite.config.ts         # Build tool config
│   ├── eslint.config.js       # Code quality rules
│   ├── .env.example           # Example environment variables
│   └── .env.local             # Local environment variables
│
├── 📄 Sample Data
│   └── sample-questions.csv   # Example quiz questions (20 questions)
│
├── 📁 Output
│   └── dist/                  # Built production files (after npm run build)
│
└── 📁 Dependencies
    └── node_modules/          # Installed packages (created by npm install)
```

---

## ⚡ Quick Reference

### Commands

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
# → Open http://localhost:5173

# Check for code errors
npm run lint

# Build for production
npm run build
# → Creates dist/ folder

# Preview production build
npm run preview
```

### Key Files to Customize

| What | Where | How |
|------|-------|-----|
| **Colors** | `tailwind.config.js` | Edit color values |
| **Timer duration** | `src/components/QuizPlay.tsx` line 5 | Change `QUESTION_TIME` |
| **Scoring rules** | `src/services/gameSession.ts` line 38 | Edit `submitAnswer()` |
| **UI text** | `src/pages/LandingPage.tsx` | Edit component text |
| **Speed bonus** | `src/services/gameSession.ts` line 45 | Modify calculation |

---

## 🎯 Common Tasks

### 1. Create a Quiz
1. Save your questions as CSV (use `sample-questions.csv` as template)
2. Open app → Click "Host Game"
3. Upload CSV file
4. Preview & verify questions
5. Click "Start Quiz"
6. Share the Game PIN

### 2. Join a Quiz
1. Open app → Click "Join Game"
2. Enter 6-digit Game PIN
3. Enter your nickname
4. Choose avatar
5. Click "Join Game"
6. Wait for host to start

### 3. Customize Colors
1. Open `tailwind.config.js`
2. Find the `colors:` section
3. Change hex codes (e.g., `'#6366f1'` to `'#3B82F6'`)
4. Run `npm run build` to see changes

### 4. Deploy to Vercel
1. Push code to GitHub
2. Go to vercel.com
3. Connect your repo
4. Click "Deploy"
5. Get your live URL

### 5. Add Custom Domain
1. Buy domain (namecheap.com, ~$10/year)
2. In Vercel: Project Settings → Domains
3. Add your domain
4. Update DNS records (follow Vercel's steps)
5. Done!

---

## 🎮 Game Flow Diagram

```
┌─────────────────┐
│  Landing Page   │
│ Host or Join?   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│ Host   │ │  Player  │
│ Page   │ │   Join   │
└────┬───┘ └────┬─────┘
     │          │
     ▼          ▼
┌─────────────────────┐
│   Quiz Lobby        │
│ Players Joining     │
│ Admin Waits/Starts  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   Quiz Gameplay     │
│  Question Display   │
│  Countdown Timer    │
│  Player Answers     │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   Final Results     │
│   Leaderboard       │
│   Winner Announced  │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│   Return to Home    │
│   New Game?         │
└─────────────────────┘
```

---

## 📊 State Management

The app uses React Context for global state:

```
GameContext
├── Quiz Data
│   ├── Current question
│   ├── Questions list
│   └── Quiz status
├── Players
│   ├── All players list
│   ├── Current player
│   └── Scores
├── Game State
│   ├── Game PIN
│   ├── Leaderboard
│   └── Timer
└── Actions
    ├── Update scores
    ├── Add answers
    └── Calculate rankings
```

All components can access this via `useGame()` hook.

---

## 🔧 Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| CSV won't upload | See [README.md - CSV Format](README.md#csv-format-for-questions) |
| App won't start | See [QUICKSTART.md - Troubleshooting](QUICKSTART.md#troubleshooting) |
| Build fails | See [QUICKSTART.md - Troubleshooting](QUICKSTART.md#troubleshooting) |
| Deploy issues | See [DEPLOYMENT.md - Troubleshooting](DEPLOYMENT.md#troubleshooting-deployments) |
| Styling broken | Clear cache (Ctrl+Shift+Delete) and rebuild |
| Players not syncing | Client-side only by default; optional Supabase setup |

---

## 📱 Browser & Device Support

✅ **Fully Supported:**
- Chrome/Chromium (v90+)
- Firefox (v88+)
- Safari (v14+)
- Edge (v90+)

✅ **Mobile:**
- iOS Safari (13+)
- Android Chrome

**Test on:**
- Desktop browsers
- Tablets (iPad, Android)
- Phones (iPhone, Android)

---

## 🚀 Performance Tips

1. **Keep CSV files < 100 questions**
2. **Use 1-2 word answers** (shorter is faster)
3. **Test on slow 4G** (DevTools → Throttle)
4. **Clear browser cache** regularly
5. **Use Vercel/Netlify** (faster than self-hosted)

---

## 💡 Feature Ideas for Future

After you've mastered the basics:

- [ ] Leaderboard persistence (Supabase)
- [ ] User accounts (Firebase Auth)
- [ ] Question categories/difficulty levels
- [ ] Multiplayer real-time sync
- [ ] Replay/saved games
- [ ] Analytics dashboard
- [ ] Multiple choice timer animations
- [ ] Sound effects
- [ ] Customizable avatars
- [ ] Team mode (players vs. team)

---

## 🎓 Learning Resources

### React
- [React Docs](https://react.dev)
- [React Hooks Guide](https://react.dev/reference/react)
- [React Context Tutorial](https://react.dev/learn/passing-data-deeply-with-context)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [TypeScript for React](https://www.typescriptlang.org/docs/handbook/react.html)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind Components](https://tailwindui.com)

### Vite
- [Vite Guide](https://vitejs.dev/guide)
- [Why Vite?](https://vitejs.dev/guide/why.html)

---

## 📞 Support & Questions

1. **Check documentation files** (README.md, QUICKSTART.md)
2. **Review code comments** (we added lots!)
3. **Google the error message** (usually helps)
4. **Check browser console** (F12 → Console tab)
5. **Try on different browser** (to isolate issues)

---

## 📄 File Legend

- **`.tsx` files** = React components (UI)
- **`.ts` files** = TypeScript logic (no UI)
- **`.css` files** = Styling
- **`.json` files** = Configuration
- **`.md` files** = Documentation (you're reading it!)

---

## ✨ You're All Set!

- ✅ Code is production-ready
- ✅ Well documented
- ✅ Easy to customize
- ✅ Ready to deploy
- ✅ Fully functional

**Next Steps:**
1. Run `npm run dev`
2. Create a test CSV
3. Try the app
4. Customize as needed
5. Deploy!

---

**Questions?** Start with [QUICKSTART.md](QUICKSTART.md) or [README.md](README.md).

**Ready to deploy?** Check [DEPLOYMENT.md](DEPLOYMENT.md).

**Have fun building!** 🎉
