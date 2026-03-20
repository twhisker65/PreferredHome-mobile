# PreferredHome — Project Strategy Brief
**Version V3 | March 2026**

---

## 1. Executive Summary

PreferredHome is a mobile application that solves a problem every apartment hunter and home buyer faces: listings are scattered across dozens of websites with no single place to track, compare, and decide. Zillow, Redfin, StreetEasy, Apartments.com, Craigslist, Facebook Marketplace, and direct building sites each have their own favourites and comparison tools — but only for their own listings. None of them talk to each other.

PreferredHome fills that gap. It is a personal real estate evaluation system — and the replacement for the apartment-hunting spreadsheet. Users capture listings from any source, organise them in one structured tool, track details, costs, contacts, and appointments, and objectively compare homes to determine their preferred choice.

**Core differentiator:** Every competing app only tracks its own listings. PreferredHome is the only tool that lets users compare listings from all sources side by side — in one place, on their terms.

---

## 2. Product Identity

| Element | Detail |
|---|---|
| App Name | PreferredHome — communicates the decision outcome rather than the browsing process. |
| Tagline 1 | Capture. Compare. Decide. — Primary |
| Tagline 2 | Replace your apartment-hunting spreadsheet. — Secondary |
| Tagline 3 | PreferredHome — From options to one. |
| Tagline 4 | PreferredHome — Turn listings into decisions. |

### Logo — Final Approved Spec (V8)

The logo is a document icon with a folded corner (upper right) and four equal-length list lines. The second line features a bold checkmark instead of a dot, representing the act of selecting a preferred home from a list of candidates.

| Element | Filled Version (Primary App Icon) | Outline Version (Marketing / Light BG) |
|---|---|---|
| Document body | #2563EB (app primary blue) | White with grey border |
| Fold corner | #1d4ed8 (darker blue) | Grey |
| List lines | Navy #1a3a6e | Dark grey #374151 |
| Dots (lines 1,3,4) | Navy #1a3a6e | Dark grey #374151 |
| Checkmark (line 2) | White — bold, round caps | #2563EB — bold, round caps |
| Checkmark weight | 6.5x stroke, 1.9x scale | 6.5x stroke, 1.9x scale |
| Checkmark position | Swept UP after pivot, lifted clear of line below | Same |

Both versions approved as of Build 3.1.15. Future refinement (Build 4.0): A professional vector version (1024x1024 for Apple, 512x512 for Google Play) will be required for App Store submission.

---

## 3. Target Users

| Primary Users | Secondary Users |
|---|---|
| Renters evaluating multiple apartment listings | Home buyers comparing properties before purchase |
| Professionals relocating to a new city | Anyone managing a complex housing search across multiple sites |
| Real estate clients tracking options independently | Users who currently track listings in spreadsheets |

---

## 4. What the App Does

### Core Workflow

1. **Capture** — Add a listing manually or paste a URL from any site to auto-import (URL Import — Build 5.0).
2. **Track** — Record rent, fees, amenities, contacts, appointments, notes, photos.
3. **Verify** — View full listing details. Call, email, or map-navigate directly from the app.
4. **Compare** — Side-by-side comparison of up to 3 listings against your personal baseline.
5. **Decide** — Progress listings through a status pipeline from New through to Signed.

### Status Pipeline

| Status | Color | Forward Path |
|---|---|---|
| New | #FFFFFF | → Contacted |
| Contacted | #EAB308 | → Scheduled |
| Scheduled | #F97316 | → Viewed |
| Viewed | #7C3AED | → Shortlisted |
| Shortlisted | #2563EB | → Applied |
| Applied | #0D9488 | → Approved |
| Approved | #10B981 | → Signed |
| Signed | #D97706 | Terminal — listing chosen. |
| Rejected | #EF4444 | Reachable from any status. → Archived. |
| Archived | #475569 | Terminal state. Historical record. |

### Profile-Driven Personalisation

Users set lifestyle toggles (Children, Pets, Car) that show or hide relevant fields and sections throughout the app — active as of Build 3.2.09. Users also define a baseline wishlist (Criteria) that drives comparison scoring in Compare.

---

## 5. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Mobile App | React Native / Expo Router | iOS and Android from one codebase. App store deployable. |
| API Backend | FastAPI (Python) on Render | Handles all data operations between app and Google Sheets. |
| Database | Google Sheets (current) / PostgreSQL (Phase 4.0) | Accessible zero-cost backend now. PostgreSQL on platform reset. |
| Version Control | GitHub | Two repos: PreferredHome-mobile and PreferredHome-api. MAIN branch only. |
| Deployment | Render (API) + Expo (Mobile) | API auto-deploys from GitHub. Mobile distributed via app stores. |

---

## 6. Development Roadmap Summary

### Phase 3.2 — Core Feature Completion (Current)

| Build | Name | Status |
|---|---|---|
| 3.2.01–3.2.10 | Foundation builds complete | Stable — all confirmed on device. |
| 3.2.11 | All New Data Fields | Up next — pet fee, property type, garage, yard, basement, floors. |
| 3.2.12 | Field Visibility Rules | Property type drives field display. |
| 3.2.13 | Auto-Calculations | Total Monthly + Total One-Time Upfront. API totalMonthly fix. |
| 3.2.14 | ZIP + URL Auto-Fill | City/State from ZIP. Listing Site from URL pattern. |
| 3.2.15 | Commute + Scores | Google Maps commute time. Walk/Transit/Bike scores. |
| 3.2.16 | Add/Edit Unification | Single shared form component. Efficiency cleanup. |
| 3.2.17 | Canonical Data Model | One master field list across all screens and API. |
| 3.2.18 | UI Polish | Spacing, typography, visual consistency. |
| 3.2.19 | APK — Android Testing | Local Android testing before App Store submission. |

### Phase 4.0 — Platform Reset

Migrate from Google Sheets to PostgreSQL and formal backend services. All 3.2.x work must be complete before this begins.

### Phase 5.0 — Major Expansion

| Feature | Description |
|---|---|
| Notifications/Reminders | Tour reminders, follow-up prompts, lease deadline alerts. |
| Photo Support | Attach and display listing photos from device camera or library. |
| Criteria Scoring | Score each listing automatically against Criteria settings. |
| Login / Sync | User accounts. Cloud data sync across devices. |
| URL Import | Paste a listing URL — app auto-populates fields from the page. |
| Import / Export | Backup and restore listing data. Export to CSV or PDF. |
| Themes | Light, dark, and custom colour themes. |
| Help Center | In-app guidance and FAQ. |
| User-Defined Lists | Thomas defines custom dropdown options per field. |
| Buying Mode | Switch app context from renting to home buying workflow. |
| Map View | Map display of listing locations on the Listings screen. |

---

## 7. Monetisation Strategy

| Tier | Model | Includes |
|---|---|---|
| Free | Base version | Listing tracking, add, view, delete. |
| Premium | One-time upgrade | Comparison analytics, advanced filtering, full baseline scoring. |
| Pro | Subscription | Cloud backup, data sync, multi-device access, priority support. |
| Future | Partnerships | Integrations with brokers, relocation services, property managers. |

---

## 8. Marketing Strategy

**Positioning:** Position PreferredHome as the replacement for the apartment-hunting spreadsheet. Every serious searcher currently maintains some form of manual tracking. PreferredHome replaces all of that with a purpose-built mobile tool that works across all listing sources.

**App Store Keywords:** apartment comparison, apartment tracker, rental tracker, home search organiser, listing comparison app, apartment hunting tool.

**Target Channels:**
- App Store organic search — primary discovery channel.
- Content marketing — apartment hunting workflow guides, relocation tips.
- Relocation and real estate communities — Reddit, Facebook groups, agent networks.
- Word of mouth — renters share with others actively searching.

---

## 9. App Store Deployment Requirements

| Apple App Store | Google Play Store |
|---|---|
| Apple Developer account ($99/year) | Google Play Developer account ($25 one-time) |
| App icon — 1024x1024 PNG (vector recreation of V8 logo) | App icon — 512x512 PNG (vector recreation of V8 logo) |
| App Store screenshots for all iPhone sizes | Feature graphic — 1024x500 |
| Privacy policy URL | Play Store screenshots |
| App description, keywords, category | Privacy policy and app description |

---

## 10. Current Development Status

| Item | Status |
|---|---|
| Mobile | Build 3.2.10 + Hotfix 3.2.10.1 — confirmed stable on device. |
| API | Build 3.2.10.1 — live on Render. /health endpoint confirmed. |
| Logo | V8 approved. Spec documented above. Vector recreation deferred to Build 4.0. |
| Next | Build 3.2.11 — all new data fields (pet fee, property type, garage, yard, basement, floors). |
| Documents | All governing documents in repo root as .md files. Synced to Claude Project automatically. |
