# CodeGPT

A ChatGPT-like learning platform with AI chat, Google Colab-style Python IDE, structured courses, quizzes, and achievement certificates.

**Live:** https://code-gpt-one.vercel.app

## Features

### AI Chat
- DeepSeek AI powered via OpenRouter
- Streaming responses with real-time token delivery
- Conversation history with sidebar navigation
- Markdown rendering with code syntax highlighting

### Python Notebook
- Google Colab-style IDE with cell-based editing
- Pyodide (Python 3.12) running in the browser
- Code and text cells with run buttons
- AI code generation assistant
- Run all cells or individual cells

### Learning Platform
- Structured courses with modules and lessons
- Quizzes with scoring and pass/fail
- Progress tracking across all courses
- Learning dashboard with stats

### User System
- Email registration and login
- Google OAuth sign-in
- User profiles with avatar and stats
- Persistent progress synced to Supabase

### Achievements
- Kaggle-style badge system (Bronze/Silver/Gold/Platinum/Diamond)
- 10 achievement types across progress, quizzes, and streaks
- Certificate modal with badge details
- Email certificates sent automatically on achievement unlock

### UI/UX
- Dark/Light mode toggle
- Responsive design (mobile + desktop)
- Google Colab-inspired IDE interface
- Clean, modern design throughout

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Styling | Custom CSS |
| AI | DeepSeek via OpenRouter |
| Auth | Supabase Auth + Google GIS |
| Database | Supabase (PostgreSQL) |
| Email | Resend API |
| Python | Pyodide (in-browser) |
| Deployment | Vercel |

## Project Structure

```
CodeGPT/
├── api/
│   ├── chat.js                    # AI chat proxy (OpenRouter streaming)
│   ├── auth/
│   │   ├── action.js              # Email register/login
│   │   └── google.js              # Google OAuth handler
│   └── achievements/
│       └── send-email.js          # Certificate email sender
├── frontend/
│   ├── public/
│   │   └── falcon.svg             # App logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat.jsx           # AI chat interface
│   │   │   ├── PythonIDE.jsx      # Colab-style notebook
│   │   │   ├── Profile.jsx        # User profile + achievements
│   │   │   ├── Dashboard.jsx      # Learning dashboard
│   │   │   ├── CourseView.jsx     # Course viewer
│   │   │   ├── LessonView.jsx     # Lesson content
│   │   │   ├── QuizView.jsx       # Quiz with scoring
│   │   │   ├── AuthPage.jsx       # Login/Register
│   │   │   ├── Header.jsx         # Top navigation
│   │   │   ├── Sidebar.jsx        # Dual-mode sidebar
│   │   │   └── Message.jsx        # Chat message renderer
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx    # Auth + progress state
│   │   ├── data/
│   │   │   └── courses.js         # Course content
│   │   ├── lib/
│   │   │   └── supabase.js        # Supabase client
│   │   ├── App.jsx                # Main app with routing
│   │   ├── App.css                # All styles
│   │   └── config.js              # API URL config
│   └── package.json
├── package.json                   # Root deps (Supabase, Resend)
└── vercel.json                    # Vercel deployment config
```

## Setup

### Prerequisites

- Node.js 18+
- Supabase project
- OpenRouter API key
- Resend API key (for certificates)

### 1. Clone & Install

```bash
git clone https://github.com/Mayankthakuri/CodeGPT.git
cd CodeGPT
npm install
cd frontend && npm install && cd ..
```

### 2. Environment Variables

Set these in Vercel dashboard or `.env.local`:

```bash
# Supabase
SUPABASE_URL=https://tyvpfmestblahyjkruxg.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# AI
OPENROUTER_API_KEY=your_openrouter_key

# Email
RESEND_API_KEY=your_resend_key
```

### 3. Supabase Setup

Create a `users` table:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar TEXT,
  google_id TEXT,
  provider TEXT DEFAULT 'email',
  stats JSONB DEFAULT '{}',
  achievements JSONB DEFAULT '[]',
  progress JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Deploy

```bash
vercel --prod
```

Or push to GitHub and connect to Vercel for auto-deploy.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Stream AI chat responses |
| `/api/auth/action` | POST | Login/register (email) |
| `/api/auth/google` | POST | Google OAuth sign-in |
| `/api/achievements/send-email` | POST | Send certificate email |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` | Run current cell (IDE) |
| `Shift+Ctrl+Enter` | Run all cells (IDE) |
| `Enter` | Send message (Chat) |

## License

MIT
