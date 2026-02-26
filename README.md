# Daily Fact Website

A clean, professional Next.js demo showcasing a daily fact website with deterministic daily selection, Pexels API image integration, and Vercel-ready deployment.

## Features

- **Daily Fact Display**: Shows one fact per day with deterministic selection
- **No Database Required**: Facts stored locally in TypeScript
- **Pexels Integration**: Fetches relevant images via Pexels API
- **Category Constraints**: Prevents consecutive days with facts from the same category
- **Server-Side Security**: Fact data never exposed to client
- **TypeScript**: Fully typed codebase
- **TailwindCSS**: Modern styling framework
- **Vercel Ready**: Optimized for serverless deployment

## Project Structure

```
fact-engine/
├── app/
│   ├── api/
│   │   └── daily-fact/
│   │       └── route.ts          # API endpoint for daily fact
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── lib/
│   ├── dailyFactService.ts       # Daily selection logic
│   ├── facts.ts                  # Fact storage
│   └── pexels.ts                 # Pexels API integration
├── types/
│   └── fact.ts                   # Type definitions
├── styles/
│   └── globals.css               # Global styles
├── .env.local.example            # Environment variables template
├── .gitignore
├── next.config.js                # Next.js configuration
├── package.json
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

### 3. Get Pexels API Key

1. Visit [Pexels API Documentation](https://www.pexels.com/api/)
2. Sign up for a free account
3. Create an API key
4. Add it to `.env.local`:

```env
NEXT_PUBLIC_PEXELS_API_KEY=your_api_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the daily fact.

### 5. Build for Production

```bash
npm run build
npm start
```

## Environment Variables

### `.env.local` Example

```env
# Pexels API key for image fetching
NEXT_PUBLIC_PEXELS_API_KEY=your_pexels_api_key_here
```

Note: Because the image fetching happens server-side, the key can safely be exposed as `NEXT_PUBLIC_`.

## API Endpoint

### GET `/api/daily-fact`

Returns the daily fact with an image URL.

**Response:**

```json
{
  "date": "2026-02-26",
  "fact": {
    "id": "fact-001",
    "text": "Honey never spoils...",
    "category": "biology",
    "imageUrl": "https://images.pexels.com/..."
  }
}
```

## Daily Selection Logic

The daily fact selection uses:

- **Deterministic Seeding**: Same date always returns the same fact
- **Seeded Shuffle**: Facts are shuffled using a seed based on date
- **Category Constraint**: Prevents consecutive days with the same category
- **Cycle-Based**: When all facts are used, the cycle repeats but maintains determinism
- **No Client Exposure**: Fact selection logic is server-side only

## Facts Database

Facts are stored in [lib/facts.ts](lib/facts.ts) with the following structure:

```typescript
interface Fact {
  id: string;
  text: string;
  imageKeyword: string;
  category: string;
}
```

Current facts include:
- **12 demo facts**
- **5 categories**: biology, animals, geography, plants
- **Repeated categories** for flexible selection

## Deployment on Vercel

### Prerequisites

- Git repository initialized
- Vercel account

### Steps

1. Push your code to GitHub (or GitLab/Bitbucket)
2. Connect your repository to Vercel
3. Add environment variables in Vercel Dashboard:
   - `NEXT_PUBLIC_PEXELS_API_KEY`: Your Pexels API key
4. Deploy

Vercel automatically detects Next.js and configures the build.

## Technologies Used

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 3
- **Image Fetching**: Pexels API
- **Deployment**: Vercel-ready

## Key Design Decisions

1. **No Database**: Facts stored as static data for simplicity and cost reduction
2. **Server-Side Logic**: All fact selection happens server-side, never exposing the full dataset
3. **Seeded RNG**: Deterministic shuffle ensures consistency and allows new facts without reshuffling past days
4. **Image Caching**: Pexels API responses cached for 1 hour to reduce API calls
5. **TypeScript**: Full type safety across the codebase
6. **Vercel Optimization**: Uses Next.js Image component and proper caching headers

## Adding New Facts

1. Edit [lib/facts.ts](lib/facts.ts)
2. Add new fact objects to the `facts` array
3. Redeploy

The seeded shuffle ensures that existing dates still show the same facts, while new dates will use the new facts in the rotation.

## Troubleshooting

### Images not loading

- Verify `NEXT_PUBLIC_PEXELS_API_KEY` is set in `.env.local`
- Check Pexels API key is valid at https://www.pexels.com/api/
- Review browser console for CORS or API errors

### Same fact repeating

This is expected behavior when the fact database is small relative to date range. Increase the number of facts in [lib/facts.ts](lib/facts.ts).

### Build fails on Vercel

- Ensure `NEXT_PUBLIC_PEXELS_API_KEY` is in Vercel environment variables
- Check TypeScript errors locally with `npm run build`
- Review Vercel deployment logs

## License

This project is provided as-is for demonstration purposes.
