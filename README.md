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

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Tech Stack

- **Framework:** Next.js 16 (with Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI + shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── dashboard/         # Dashboard page
│   ├── flashcards/        # Flashcards feature
│   ├── quiz/              # Quiz generator
│   ├── study-buddy/       # Study buddy chat
│   └── summarizer/        # Paper summarizer
├── components/            # Reusable components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── navigation.tsx    # Main navigation
│   └── feature-layout.tsx # Layout for feature pages
├── lib/                  # Utility functions
└── styles/              # Global styles
```

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