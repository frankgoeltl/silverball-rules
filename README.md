# Silverball Rules

Pinball machine rules API and web application built with Next.js and Supabase.

## Tech Stack

- **Frontend/API**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/frankgoeltl/silverball-rules.git
   cd silverball-rules
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Supabase project at [supabase.com](https://supabase.com)

4. Run the schema SQL in Supabase SQL Editor:
   ```bash
   # Copy contents of supabase/schema.sql
   ```

5. Copy environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Then fill in your Supabase credentials.

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/pinrules/{opendbId}` | Get machine info, rules, and OPDB data |
| `GET /api/pinrules/opendbids` | List all machines with rules |
| `GET /api/pinrules/search?query={query}` | Search machines by name |

## Data Management

### Initial Migration

To migrate data from JSON files to Supabase:

```bash
npm run migrate
```

### Content Updates

To import new content updates:

```bash
npm run import path/to/updates/folder
```

The updates folder should contain:
- `SilverBalls_PinballMachines.json`
- `SilverBalls_PinballRules.json`

## Project Structure

```
silverball-rules/
├── src/
│   ├── app/
│   │   ├── api/pinrules/     # API routes
│   │   └── ...               # Pages
│   ├── components/           # React components
│   └── lib/                  # Utilities (Supabase client, types)
├── scripts/                  # CLI tools (migrate, import)
├── supabase/                 # Database schema
└── public/                   # Static assets
```

## Deployment

This project is configured for Vercel deployment:

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

## License

MIT
