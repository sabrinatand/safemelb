# 🛡️ SafeMelb — Community Safety App

> A real-time community safety app built for Melbourne. Report incidents, see live alerts near you, and access practical safety tips — all in one place.

![Status](https://img.shields.io/badge/status-in%20development-orange)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue)
![Stack](https://img.shields.io/badge/stack-React%20Native%20%7C%20Expo%20%7C%20Supabase-purple)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📱 Screenshots

> *(Wireframes — full screenshots coming after Phase 2)*

| Home / Map | Report Incident | Safety Tips |
|---|---|---|
| ![Home](docs/screenshots/home.png) | ![Report](docs/screenshots/report.png) | ![Tips](docs/screenshots/tips.png) |

---

## ✨ Features

- 🗺️ **Live incident map** — see community-reported safety concerns near you in real time
- 🚨 **Emergency SOS** — one-tap call to 000 with automatic location sharing
- 📋 **Incident reporting** — quickly log what you see with incident type, location, and optional photo
- 🛡️ **Safety tips** — practical, legal advice for staying safe day-to-day
- 🔔 **Push notifications** — get alerted when a new incident is reported nearby *(Phase 3)*
- 👤 **Anonymous mode** — use the app and submit reports without creating an account

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | React Native + Expo | Cross-platform iOS & Android from one codebase |
| Language | TypeScript | Type safety, better DX, portfolio-ready code |
| Navigation | Expo Router | File-based routing, mirrors Next.js conventions |
| Backend | Supabase | PostgreSQL + Realtime + Auth + Storage, generous free tier |
| Maps | Google Maps SDK | Industry standard, reliable location APIs |
| Notifications | Expo Push Notifications | Free, built into Expo ecosystem |
| Styling | StyleSheet API | Native performance, no runtime overhead |

---

## 🗂️ Project Structure

```
safemelb/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx         # Home / Map screen
│   │   ├── report.tsx        # Report incident screen
│   │   ├── tips.tsx          # Safety tips screen
│   │   └── _layout.tsx       # Tab bar configuration
│   └── _layout.tsx           # Root layout
├── components/               # Shared UI components
│   ├── SOSButton.tsx
│   ├── AlertCard.tsx
│   ├── IncidentPin.tsx
│   └── TipCard.tsx
├── lib/
│   └── supabase.ts           # Supabase client setup
├── constants/
│   ├── Colors.ts             # Design system colours
│   └── Tips.ts               # Static safety tips data
├── assets/                   # Icons and images
├── docs/                     # Phase documentation & screenshots
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- Expo CLI — `npm install -g expo-cli`
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/safemelb.git
cd safemelb

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Supabase and Google Maps keys (see below)

# 4. Start the development server
npx expo start
```

### Environment Variables

Create a `.env` file in the root with:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_api_key
```

> **Never commit your `.env` file.** It is already listed in `.gitignore`.

To get these keys:
- **Supabase**: [supabase.com](https://supabase.com) → your project → Settings → API
- **Google Maps**: [console.cloud.google.com](https://console.cloud.google.com) → Credentials

---

## 🗄️ Database Schema

```sql
-- Incidents table
create table incidents (
  id          uuid     default gen_random_uuid() primary key,
  created_at  timestamptz default now(),
  type        text     not null,
  description text,
  latitude    float8   not null,
  longitude   float8   not null,
  photo_url   text,
  user_id     uuid     references auth.users(id)
);

-- Safety tips table
create table tips (
  id       uuid default gen_random_uuid() primary key,
  category text not null,
  title    text not null,
  body     text not null
);
```

Row Level Security is enabled — users can view all incidents but only modify their own submissions.

---

## 📅 Roadmap

| Phase | Description | Status |
|---|---|---|
| Phase 1 | Project setup, navigation, Supabase config | ✅ Complete |
| Phase 2 | Map screen, report form, safety tips | 🔧 In progress |
| Phase 3 | Auth, realtime feed, push notifications | ⏳ Planned |
| Phase 4 | Polish, testing, README & demo video | ⏳ Planned |
| Phase 5 | Google Play & App Store launch | ⏳ Planned |

---

## 📖 Documentation

Detailed documentation for each phase lives in the `/docs` folder:

- [Phase 1 — Setup & Foundations](docs/PHASE1.md)
- Phase 2 — Core Features *(coming soon)*
- Phase 3 — Auth & Realtime *(coming soon)*

---

## 🤝 Contributing

This is a personal portfolio project but suggestions are welcome! Feel free to open an issue if you spot a bug or have a feature idea.

---

## ⚠️ Disclaimer

SafeMelb is a community tool and does not replace official emergency services. Always call **000** in an emergency.

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">Built with ❤️ in Melbourne, Australia</p>