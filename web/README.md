# LinguaStep — Web

A browser-based version of LinguaStep: a 2-minute English micro-lesson app with a
3-stage tactile letter-block vocabulary trainer, a CEFR placement test, and a
progress dashboard with streaks and daily reminders.

Built with React + TypeScript + Vite. No backend — all state (word mastery,
streaks, XP, reminder settings) is saved to your browser's `localStorage`, and
pronunciation uses the browser's built-in `SpeechSynthesis` API (American
English). Daily reminders use the browser `Notification` API while the tab is
open.

## Run it on your machine

Requirements: [Node.js](https://nodejs.org) 18+ (includes npm).

```bash
cd web
npm install
npm run dev
```

Then open the URL it prints — typically **http://localhost:5173**.

## Build a static production bundle

```bash
npm run build
npm run preview   # serves the built dist/ folder locally to double-check it
```

The production files land in `web/dist/` — you can host that folder on any
static file host (Netlify, Vercel, GitHub Pages, a plain `nginx` server, etc.)
if you want it reachable from somewhere other than your own machine.

## Notes

- Progress is per-browser (localStorage), so it won't follow you between
  different browsers or devices unless you add real backend sync.
- Pronunciation quality depends on the voices your OS/browser ships — most
  desktop browsers include a decent `en-US` voice out of the box.
- Notifications require you to grant the browser permission when you enable
  the daily reminder toggle on the Progress screen.
