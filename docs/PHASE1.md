# Phase 1 — Setup & Foundations

**Completed:** Week 1  
**Status:** ✅ Complete

---

## Overview

Phase 1 covers the full project setup — from development environment to the scaffolded app running on a real device. By the end of this phase, the project had a working navigation structure, a live Supabase backend, and Google Maps configured and ready for Phase 2.

---

## What was built

- Initialised React Native + Expo project with TypeScript
- Set up ESLint + Prettier for consistent code formatting
- Created GitHub repo with branching strategy (main / dev / feature branches)
- Configured Supabase project with database schema, Row Level Security, and a storage bucket for incident photos
- Enabled Google Maps SDK and added API key configuration
- Built bottom tab navigation using Expo Router (Map, Report, Tips, Profile)
- Established folder structure and design system constants (colours, typography)

---

## Technical decisions

### Supabase over Firebase
Supabase was chosen over Firebase for three reasons: it's built on PostgreSQL (more portable and familiar), the free tier is significantly more generous, and Row Level Security gives fine-grained access control without a separate rules language.

### Expo Router over React Navigation
Expo Router uses file-based routing — the same mental model as Next.js. This makes the project structure more intuitive and reduces boilerplate compared to manually defining a navigation stack in React Navigation.

### TypeScript from day one
Starting with TypeScript avoids the painful migration later. It also makes the codebase look more professional in a portfolio context, and catches common bugs (null checks, wrong prop types) at compile time rather than runtime.

---

## Challenges

*(Fill this in as you go — document any setup issues you hit and how you solved them.)*

Example entries:
- "Expo Go wouldn't connect on the office WiFi — solved by switching to mobile hotspot"
- "Supabase RLS blocked all reads initially — fixed by adding a public SELECT policy"

---

## Commits this phase

| Commit | Message |
|---|---|
| Initial | `docs: initial README` |
| Setup | `feat: initialise Expo project with TypeScript` |
| Backend | `feat: add Supabase client setup` |
| Maps | `feat: add Google Maps configuration` |
| Nav | `feat: complete Phase 1 setup — navigation, Supabase, Maps` |

---

## Screenshots

*(Add screenshots of your terminal running `expo start` and the app open on your phone)*

---

## What's next

**Phase 2** — Building the core screens: the home/map screen with live incident markers pulled from Supabase, and the report incident form with location auto-fill and photo upload.