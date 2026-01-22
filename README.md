# Brain Play - Real-Time Multiplayer Quiz Web App

A fast, simple, and engaging real-time multiplayer quiz game designed for kids, teachers, and classrooms. No installation required—just join with a PIN!

## ✨ Features

### For Quiz Hosts (Teachers/Admins)
- 📤 Upload quiz questions via CSV file
- 👀 Preview questions before starting
- 🎮 Auto-generated 6-digit Game PIN
- 🎯 Start, pause, advance, and end quizzes
- 👥 View connected players in real-time
- 📊 Live leaderboard and answer distribution
- 📥 Download final results as CSV

### For Players (Students)
- 🚀 Join using Game PIN (no account needed)
- 😊 Choose nickname and avatar
- ⏱️ Countdown timer for each question
- ✅ Immediate feedback on answers
- 📈 Real-time score updates
- 🏆 Live mini-leaderboard
- 🎉 Celebration animations

### Game Features
- ⚡ **Speed Bonus**: Up to 50 bonus points for fast answers
- 🎯 **Score System**: 100 points for correct, -20 for wrong (toggleable)
- 📱 **Mobile-First**: Fully responsive on phones, tablets, and desktops
- 🌈 **Friendly UI**: Bright colors, rounded buttons, simple animations
- 🔒 **Secure**: PIN-based sessions, expires when quiz ends
- ⚙️ **Easy Setup**: One CSV file to host a complete quiz

## 🚀 Quick Start

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file (copy from `.env.example`):
   ```bash
   VITE_SUPABASE_URL=http://localhost:54321
   VITE_SUPABASE_ANON_KEY=your_key_here
   ```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📋 CSV Format for Questions

Create a CSV file with these columns (exactly):

```csv
Question,Option A,Option B,Option C,Option D,Correct Answer
What is 2+2?,3,4,5,6,B
What is the capital of France?,London,Paris,Berlin,Madrid,B
What color is the sky?,Red,Green,Blue,Yellow,C
```

**Requirements:**
- First row must be the header
- `Correct Answer` must be: `A`, `B`, `C`, or `D`
- Maximum 100 questions recommended
- All fields are required

## 🎮 How to Use

### For Hosts:
1. Click **"Host Game"** on the landing page
2. Upload your CSV file with questions
3. Preview questions if needed
4. Click **"Start Quiz Now!"**
5. Share the 6-digit Game PIN with players
6. Monitor the live leaderboard and answer distribution
7. Advance through questions manually
8. End the quiz to see final rankings

### For Players:
1. Click **"Join Game"** on the landing page
2. Enter the Game PIN (ask the host)
3. Enter your nickname (required)
4. Choose an avatar/emoji
5. Optionally enter your team or school name
6. Tap one of four options to answer
7. Watch the countdown timer
8. See immediate feedback and your updated score
9. View your position on the leaderboard after each question

## 🏆 Scoring System

- **Correct Answer**: +100 points
- **Speed Bonus**: Up to +50 points (based on answer time)
  - Answer in < 5 seconds: Full speed bonus
  - Slower answers: Reduced bonus
- **Wrong Answer**: -20 points (if enabled)
- **Streak Bonus**: Visual celebration for consecutive correct answers

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CSVUpload.tsx   # CSV file upload with validation
│   ├── QuestionPreview.tsx  # Question preview modal
│   ├── QuizPlay.tsx    # Main quiz gameplay
│   └── Leaderboard.tsx # Real-time leaderboard display
├── context/            # React Context for global state
│   └── GameContext.tsx # Game state management
├── pages/             # Full page components
│   ├── LandingPage.tsx # Home page with role selection
│   ├── HostPage.tsx   # Host/admin interface
│   └── JoinPage.tsx   # Player join interface
├── services/          # Business logic and API calls
│   ├── supabase.ts    # Supabase client setup
│   └── gameSession.ts # Game session management
├── types/             # TypeScript type definitions
│   └── index.ts       # All shared types
├── utils/             # Utility functions
│   └── helpers.ts     # CSV parsing, scoring, etc.
├── App.tsx           # Main app component with routing
├── main.tsx          # App entry point
└── index.css         # Global styles + Tailwind
```

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build**: Vite (blazing fast)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **CSV Parsing**: csv-parse
- **Backend**: Supabase (optional, for persistent storage)
- **Hosting**: Vercel, Netlify, or any static host

## 🚀 Deployment

### Option 1: Vercel (Recommended - 1 click)
1. Push your code to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Deploy automatically

### Option 2: Netlify
1. Push your code to GitHub
2. Connect to [Netlify](https://www.netlify.com)
3. Deploy automatically

### Option 3: Traditional Hosting
1. Run `npm run build`
2. Upload the `dist` folder to your web host
3. Set up environment variables on your host

## 🔒 Security

- **No Login Required**: Uses temporary PIN-based sessions
- **PIN Expiration**: Automatically expires when quiz ends
- **No Sensitive Data**: Minimal user input, no passwords
- **Client-Side**: Can work entirely without backend (optional Supabase)

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize colors:
```js
colors: {
  primary: '#6366f1',      // Indigo
  secondary: '#ec4899',    // Pink
  success: '#10b981',      // Green
  danger: '#ef4444',       // Red
}
```

### Timer Duration
Edit `src/components/QuizPlay.tsx`:
```ts
const QUESTION_TIME = 30; // Change to desired seconds
```

### Scoring Rules
Edit `src/services/gameSession.ts` → `submitAnswer()` function

## 📱 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (iOS 13+)
- Any modern browser with ES2020+ support

## 🐛 Troubleshooting

### CSV upload fails
- Check column names match exactly: `Question`, `Option A`, `Option B`, `Option C`, `Option D`, `Correct Answer`
- Ensure `Correct Answer` is: `A`, `B`, `C`, or `D`
- Save CSV as UTF-8 without BOM

### PIN doesn't work
- Make sure it's exactly 6 digits
- Ensure quiz is still in lobby (not ended)
- Check host hasn't ended the session

### Real-time updates not working
- The app works client-side by default
- For real multiplayer sync, configure Supabase in `.env.local`

## 📚 Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev/guide)

## 📄 License

MIT License - Feel free to use for educational purposes

## 🙋 Support

Need help? Check the `.env.example` file and the project structure comments.

---

**Happy Quizzing! 🎉**

Built with ❤️ for teachers and students everywhere.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
