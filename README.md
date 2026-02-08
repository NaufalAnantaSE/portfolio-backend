# Portfolio Backend API

Backend API untuk portfolio Naufal Ananta.

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api` | GET | Health check |
| `/api/chat` | POST | AI Chat (Gemini) |
| `/api/projects` | GET | Daftar project |
| `/api/tech-stacks` | GET | Tech stacks |
| `/api/personal-info` | GET | Info personal |
| `/api/seo-settings` | GET | SEO settings |

## Setup

1. Clone repo
2. `npm install`
3. Copy `.env.example` ke `.env` dan isi `GEMINI_API_KEY`
4. `npm run dev`

## Deploy ke Vercel

1. Push ke GitHub
2. Import project di Vercel
3. Set environment variable `GEMINI_API_KEY`
4. Deploy

## Environment Variables

- `GEMINI_API_KEY` - API key dari Google AI Studio
