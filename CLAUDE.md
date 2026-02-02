# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Silverball Rules - A pinball machine rules API and web application.

**Migrated from**: .NET 8.0 API + Angular (see `sbm-23-01_API` repo for reference)

**Current Stack**:
- Next.js 16 (App Router)
- Supabase (PostgreSQL)
- Tailwind CSS
- Vercel (planned)

## Migration Status

### Completed
- [x] GitHub repo created
- [x] Next.js project initialized with TypeScript + Tailwind
- [x] Supabase client configuration (`src/lib/supabase.ts`)
- [x] Database schema ready (`supabase/schema.sql`)
- [x] API routes created (3 endpoints)
- [x] Migration/import scripts (`scripts/`)

### Pending
- [ ] Create Supabase project at supabase.com
- [ ] Run schema.sql in Supabase SQL Editor
- [ ] Set up .env.local with Supabase credentials
- [ ] Run data migration (`npm run migrate`)
- [ ] Build frontend pages and components
- [ ] Deploy to Vercel

## Common Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint

# Data Management
npm run migrate      # Initial data migration from JSON files
npm run import       # Import content updates
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/pinrules/{opendbId}` | Get machine info, rules, and OPDB data |
| `GET /api/pinrules/opendbids` | List all machines with rules |
| `GET /api/pinrules/search?query={query}` | Search machines by name |

## Key Files

- `src/lib/supabase.ts` - Supabase client
- `src/lib/types.ts` - TypeScript types
- `src/lib/logging.ts` - API request logging
- `src/app/api/pinrules/` - API route handlers
- `supabase/schema.sql` - Database schema
- `scripts/migrate-data.ts` - Data migration script
- `scripts/import.ts` - Content update import tool

## Data Source

JSON files from the original .NET project:
- Path: `../sbm-23-01_API/updates/update-2026-01/`
- Files: `SilverBalls_PinballMachines.json`, `SilverBalls_PinballRules.json`

## Original .NET API (for reference)

Production URL: https://silverballsapi.azurewebsites.net
- Keep running in parallel until Next.js version is verified
- Same API response format maintained for compatibility

## Important Notes

- Do not auto commit
- Keep API response format identical to .NET version for frontend compatibility
