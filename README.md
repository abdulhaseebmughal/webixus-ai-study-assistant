# AI-Powered Study Assistant - WebixusAI

Your AI-powered study companion that simplifies complex knowledge, boosts learning efficiency, and personalizes your study experience.

## Features

- **Research Paper Summarizer** - Upload or paste academic papers and get instant summaries with key points and conclusions
- **Smart Quiz Generator** - Create multiple-choice and short-answer quizzes with instant feedback
- **Flashcard Creator** - Convert topics into interactive flashcards for active recall practice
- **Learning Dashboard** - Track your progress, identify weak areas, and get personalized recommendations
- **Study Buddy Chat** - Get conversational Q&A support and explanations for difficult concepts

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/abdulhaseebmughal/webixus-ai-study-assistant.git

# Navigate to the project directory
cd webixus-ai-study-assistant

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI, DigitalOcean API key, and JWT secret

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# DigitalOcean AI API
DO_API_KEY=your-digitalocean-api-key
DO_API_URL=https://api.digitalocean.com/v2/ai/inference

# JWT Secret (Generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# App Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (with Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend
- **API:** Next.js App Router (Route Handlers)
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken + bcryptjs)
- **AI:** DigitalOcean AI Inference API
- **PDF Processing:** pdf-parse

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes (Next.js Route Handlers)
│   │   ├── auth/         # Authentication endpoints
│   │   ├── documents/    # Document management
│   │   ├── summarize/    # AI summarization
│   │   ├── quizzes/      # Quiz generation & submission
│   │   ├── flashcards/   # Flashcard creation & updates
│   │   ├── progress/     # User progress tracking
│   │   ├── chat/         # Study buddy chat
│   │   └── rewrite/      # Text rewriting
│   ├── page.tsx          # Home page
│   ├── layout.tsx        # Root layout
│   ├── dashboard/        # Dashboard page
│   ├── flashcards/       # Flashcards feature
│   ├── quiz/             # Quiz generator
│   ├── study-buddy/      # Study buddy chat
│   └── summarizer/       # Paper summarizer
├── components/           # Reusable components
│   ├── ui/              # UI components (shadcn/ui)
│   ├── navigation.tsx   # Main navigation
│   └── feature-layout.tsx # Layout for feature pages
├── lib/                 # Backend utilities
│   ├── db.ts           # MongoDB connection
│   ├── auth.ts         # JWT authentication helpers
│   ├── ai.ts           # DigitalOcean AI integration
│   └── models/         # Mongoose models
│       ├── User.ts
│       ├── Document.ts
│       ├── Quiz.ts
│       ├── Flashcard.ts
│       └── Progress.ts
└── styles/             # Global styles
```

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

### Key API Endpoints

- **Auth:** `/api/auth/signup`, `/api/auth/login`, `/api/auth/me`
- **Documents:** `/api/documents` (GET, POST, DELETE)
- **AI Features:**
  - `/api/summarize` - Generate summaries
  - `/api/quizzes` - Generate and manage quizzes
  - `/api/flashcards` - Create flashcard decks
  - `/api/chat` - Study buddy chat
  - `/api/rewrite` - Rewrite text
- **Progress:** `/api/progress` - User analytics

## Deployment

This project is ready to deploy on:

- **Vercel** (Recommended)
- **Netlify**
- **Any Node.js hosting platform**

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

## License

MIT License - feel free to use this project for learning and development.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and AI