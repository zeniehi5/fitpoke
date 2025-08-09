# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FitPoke (피트포케) is a health-focused poke bowl recommendation service built with React, TypeScript, Vite, and TailwindCSS. The application provides personalized meal recommendations based on user nutritional requirements.

## Development Commands

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Run linting
yarn lint

# Preview production build
yarn preview
```

## Architecture

### Tech Stack
- **Frontend Framework**: React 19 with React Router for routing
- **Build Tool**: Vite 7 with React plugin
- **Language**: TypeScript 5.8
- **Styling**: TailwindCSS v4 with Vite plugin integration
- **UI Components**: Shadcn/ui components with Radix UI primitives
- **Forms**: React Hook Form with Zod validation

### Project Structure
- `/src/pages/` - Page components (Home, InputForm, RecommendResult)
- `/src/components/ui/` - Shadcn UI components
- `/src/features/recommend/` - Menu recommendation logic
- `/src/utils/` - Utility functions (BMI/BMR calculations)
- `/src/data/` - Data models and menu items
- `@/` - Path alias for `/src/` directory

### Key Features
1. **Nutrition Calculator** (`src/utils/calculator.ts`): Calculates BMI, BMR, and recommended daily calorie intake
2. **Menu Recommendation Engine** (`src/features/recommend/recommendMenu.ts`): Optimizes menu combinations based on:
   - Target calories (50% weight)
   - Protein content (30% weight)
   - Nutritional balance (20% weight)
3. **Routing**: Three main routes - Home (`/`), Input Form (`/form`), Results (`/result`)

### Configuration Notes
- Uses Vite's path aliasing with `@/` pointing to `src/`
- TailwindCSS configured with CSS variables and Neutral base color
- Shadcn components use New York style with Lucide icons
- No test framework currently configured