# 🌊 The Disciplined Trader

A beautiful, mobile-first trading journal app inspired by meditation app aesthetics. Track your pre-market plans, post-market audits, and build consistency streaks.

![Preview](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![Mobile](https://img.shields.io/badge/Mobile-First-green)

## Features

- **Pre-market Planning**: Lock in your daily trading plan with market conditions and mental state assessment
- **Post-market Audit**: Reflect on your execution, track mood, and identify violations
- **Calendar View**: Visualize your consistency with green/yellow/red day tracking
- **Streak System**: Build momentum with a 5-day probation streak
- **Offline-first**: Data saved to localStorage (works without internet)
- **Beautiful UI**: Ocean gradient backgrounds, glassmorphism cards, smooth animations

## Quick Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Import your GitHub repo
4. Vercel auto-detects Vite — just click "Deploy"
5. Done! Your app is live.

## Quick Deploy to Netlify

1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select your GitHub repo
5. Build settings are auto-detected — click "Deploy"
6. Done!

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
trading-app/
├── index.html          # Entry HTML
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── public/
│   └── favicon.svg     # App icon
└── src/
    ├── main.jsx        # React entry point
    └── App.jsx         # Main app component (all-in-one)
```

## Customization

### Connect to Google Sheets

The app currently uses localStorage. To sync with Google Sheets:

1. Set up a Google Cloud project with Sheets API
2. Create a service account and download credentials
3. Add environment variables for your credentials
4. Replace the `loadData()` and `saveData()` functions with API calls

### Modify Colors

All colors are defined as CSS variables in `App.jsx`:

```css
:root {
  --ocean-1: #E3F6FC;  /* Lightest */
  --ocean-5: #4AC5E8;  /* Primary accent */
  --green: #4ECBA0;    /* Success */
  --yellow: #F5B74E;   /* Warning */
  --red: #EF7B6C;      /* Error */
}
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool (fast!)
- **CSS-in-JS** - Styles embedded in component
- **localStorage** - Offline data persistence

## License

MIT — use freely for personal or commercial projects.

---

Built with 🌊 for disciplined traders who trade the process, not the outcome.
