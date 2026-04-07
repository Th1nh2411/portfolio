# Thinh Portfolio

A modern, production-ready personal portfolio built with **React + TypeScript + Firebase**.

## Tech Stack
- **React 18** (functional components + hooks)
- **TypeScript** + **Vite**
- **Firebase** (Firestore + Hosting)
- **TailwindCSS** — custom design system
- **Framer Motion** — smooth animations
- **react-i18next** — EN/VI multilingual support
- **react-router-dom v6** — client-side routing
- **react-helmet-async** — SEO meta tags

## Features
- Dark / Light theme (persisted in `localStorage`)
- English & Vietnamese language toggle (persisted in `localStorage`)
- Dynamic data from Firestore with local fallback JSON
- Smooth page transitions and scroll animations
- Skeleton loading states
- Contact form → saves to Firestore
- Lazy-loaded routes for fast initial load
- Deployed on Firebase Hosting

---

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Th1nh2411/portfolio
cd portfolio
npm install
```

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/) → Create project
2. Enable **Firestore Database** (start in test mode)
3. Go to Project Settings → Add web app → copy config

### 3. Environment Variables
```bash
cp .env.example .env
# Edit .env with your Firebase config values
```

### 4. Seed Firestore Data (optional)
```bash
npm install dotenv  # if not already
node scripts/seed.mjs
```
This populates Firestore with your profile, projects, skills, and experience.  
**Note:** The app uses local fallback data automatically if Firestore is unreachable.

### 5. Run Dev Server
```bash
npm run dev
```
Open http://localhost:5173

---

## Folder Structure
```
src/
├── components/
│   ├── common/       # Reusable UI: FadeIn, Skeleton, ProjectCard, Spinner
│   └── layout/       # Navbar, Footer, Layout
├── data/
│   └── fallback.ts   # Local JSON fallback data
├── hooks/
│   └── index.ts      # useTheme, useFetch, useScrollToTop, useInView
├── i18n/
│   ├── index.ts      # i18next setup
│   └── locales/      # en.json, vi.json
├── lib/
│   ├── firebase.ts   # Firebase init
│   └── firestore.ts  # Data fetching layer
├── pages/
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   ├── ProjectsPage.tsx
│   ├── ProjectDetailPage.tsx
│   └── ContactPage.tsx
├── types/
│   └── index.ts      # TypeScript interfaces
├── App.tsx           # Router
├── main.tsx          # Entry
└── index.css         # Global styles + Tailwind
```

---

## Deploy to Firebase Hosting

### First time setup
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select your project, set public dir to "dist", configure as SPA
```

### Deploy
```bash
npm run deploy
# This runs: tsc && vite build && firebase deploy
```

---

## Customization

### Update your info
Edit `src/data/fallback.ts` — this is the source of truth when Firestore isn't configured.

### Add a new project
1. Add to `projectsData` array in `src/data/fallback.ts`
2. OR add directly to Firestore `projects` collection

### Change colors
Edit `tailwind.config.js` → `theme.extend.colors.accent`

### Add a new language
1. Create `src/i18n/locales/[lang].json`
2. Register in `src/i18n/index.ts`
3. Add toggle logic in `Navbar.tsx`

---

## Firestore Security Rules (production)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /portfolio/{doc} { allow read: if true; }
    match /projects/{doc}  { allow read: if true; }
    match /experience/{doc}{ allow read: if true; }
    match /skills/{doc}    { allow read: if true; }
    match /contacts/{doc}  { allow create: if true; allow read, write: if false; }
  }
}
```

---

Built by Nguyen Duc Thinh · ducthnh2411@gmail.com
