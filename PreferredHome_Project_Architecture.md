# PreferredHome — Project Architecture
**Version V7 | April 2026**

Defines how the app currently functions, how the screens are structured, and how the design/token system is applied. Scope: current app architecture and behavior only. Canonical data-model changes belong to V4 planning.

---

## 1. Project Identity

| Property | Value |
|---|---|
| App Name | PreferredHome |
| Tagline | Capture. Compare. Decide. |
| Purpose | Mobile-first rental listing evaluation tool |
| Mobile Repo | `twhisker65/PreferredHome-mobile` |
| API Repo | `twhisker65/PreferredHome-api` |
| API Live | `https://preferredhome-api.onrender.com` |
| Branch | MAIN only — via GitHub Desktop |

---

## 2. Operating Model

| Role | Responsibility |
|---|---|
| Thomas | Project director — defines product direction, design intent, priorities, approval |
| ChatGPT | Project manager — writes directives, reviews engineer questions, writes assessments and hotfix instructions, owns protocol and architecture doc updates |
| Claude | Project engineer — implements approved scope only after Begin Build Brief, blocker check, and ENGAGE |

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React Native with Expo Router |
| Cross-platform | Single codebase for iOS and Android |
| Backend (current) | Python FastAPI on Render |
| Datastore (current) | Google Sheets via gspread |
| Backend / storage (future) | PostgreSQL + SQLite in V4 |
| Version Control | GitHub Desktop — MAIN branch only |
| Expo Command | `npx expo start --tunnel --clear` when needed |
| Local Mobile Path | `C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile` |

---

## 4. Design System — Color Tokens

These are the current approved live color tokens derived from the token system build. Build-history instructions are intentionally excluded here.

| Token | Hex | Current Role |
|---|---|---|
| background | `#112240` | Primary app background |
| surface | `#1B2A4A` | Cards, panel shells, section header shells |
| surfacePressed | `#162A45` | Pressed/active state only — never default background |
| border | `#223A70` | Dividers, card borders, shell borders |
| accent | `#2563EB` | Primary blue accent |
| textPrimary | `#F8FAFC` | Primary white text |
| textSecondary | `#94A3B8` | Secondary / muted text |
| comparePass | `#22C55E` | Compare positive state only |
| compareWarn | `#F59E0B` | Compare warning state only |
| compareFail | `#DC2626` | Compare fail state only |

### Color Usage Rules

- `surfacePressed` is a state token only.
- `accent` is the primary blue.
- Compare colors are reserved for compare logic and compare scoring contexts.
- Status pill colors are managed by the status map and are not redefined here.

---

## 5. Design System — Typography Tokens

| Token | Size / Weight | Current Role |
|---|---|---|
| mainTitleBlue | 20 / 800 | “Preferred” word in TopBar title |
| mainTitleWhite | 20 / 800 | “Home” word in TopBar title and similar white title usage |
| subHeader | 18 / 600 | Secondary header bars on panels/pages |
| sectionTitle | 15 / 900 | Group anchors / section headings |
| cardTitle | 16 / 700 | Listing title / card heading text |
| cardSecondary | 14 / 500 | Rent/fees secondary card line |
| bodyPrimary | 14 / 400 | Standard entered values / data values |
| bodyEmphasis | 14 / 600 | Highlighted metric or emphasized value |
| label | 12 / 600 | Field labels |
| bodySmall | 12 / 400 | Secondary/supporting information |
| linkText | 14 / 600 | Tappable links / active text |
| button | 13 / 700 | Clear / Apply / Save / Close button text |
| micro | 10 / 400 | Small support text |
| pill | 12 / 800 | Status pill only |
| scorePill | 13 / 700 | Compare scoring pill only |

### Typography Usage Rules

- Bottom-nav label typography remains Expo-managed.
- `sectionTitle` is used for section and group headings.
- `label` is visually secondary to `bodyPrimary`.
- `bodyEmphasis` is reserved for emphasis, not default values.

---

## 6. Layout Hierarchy Rules

Current app structure follows this general order:

1. TopBar
2. Secondary header / sub-header where required
3. Scrollable content body
4. Fixed action footer where required
5. Bottom navigation where applicable

### Current Screen/Panel Rules

- Full-page/panel treatments now apply to ViewPanel, Profile, Criteria, and Settings.
- Filter / Sort remains the key structural reference for row discipline and footer treatment.
- Add and Edit currently use collapsible card-style section headers.
- Add does not require a sub-header by default.
- Edit uses a sub-header with title and back arrow.
- ViewPanel uses a centered sub-header with back arrow and conditional preferred heart.

---

## 7. App Screens (5 Tabs)

| Tab | Screen | Purpose |
|---|---|---|
| 1 | Home | Dashboard / summary screen |
| 2 | Listings | Full listing cards grouped by Preferred / Candidates |
| 3 | Add | Form to create a new listing |
| 4 | Compare | Side-by-side comparison of up to 3 listings |
| 5 | Calendar | Month view with viewing appointment list below |

---

## 8. Current Global UI Components

| Component | Current Role |
|---|---|
| TopBar | PreferredHome brand title + hamburger + optional right icon |
| Bottom Nav | 5-tab navigation; Expo-managed label styling |
| MenuPanel | Entry point to Profile, Criteria, Settings |
| FilterPanel | Structural standard for row discipline and footer controls |
| ListingCard | Summary card for listing in Listings |
| StatusPill | Listing status display |
| ViewPanel | Full-width detail panel / page treatment |
| CompareStorage | AsyncStorage-backed compare selection state |

---

## 9. Add / Edit Architecture (Current Accepted State)

### Section Structure

Eight collapsible sections:
- PROPERTY
- COSTS
- FEATURES
- TRANSPORTATION
- SCHOOLS
- LISTING
- TIMELINE
- NOTES

### Current Rules

- all sections open by default
- Add/Edit use card-style collapsible section headers
- section headers use card shell treatment with border
- Add/Edit footer save action is fixed below the scroll body
- Add/Edit scroll fix is achieved by keeping the sub-footer outside the KeyboardAvoidingView
- Add page currently has no sub-header by default
- Edit page retains sub-header + back arrow
- current accepted UI grouping places Short Term Available and No Renters Insurance Required in LISTING

---

## 10. Profile / Criteria / Settings Panels (Current Accepted State)

| Panel | Current Behavior |
|---|---|
| Profile | Full-width panel, centered sub-header, back arrow, Clear + Save footer |
| Criteria | Full-width panel, centered sub-header, back arrow, Clear + Save footer |
| Settings | Full-width panel, centered sub-header, back arrow, action footer present; content behavior remains limited |

### Current Hierarchy Rules

- section/group headings use `sectionTitle`
- labels use `label`
- entered/displayed values use `bodyPrimary`
- footer actions use `button`

---

## 11. ViewPanel (Current Accepted State)

| Item | Current Behavior |
|---|---|
| Width | Full-width treatment |
| Header | Centered title, back arrow, blue heart if Preferred |
| Multi-select fields | Inline `LABEL: value, value, value` format |
| Scores | Rounded-square neutral treatment |
| Costs | Kept visually stable from prior approved state |
| Deep links | Phone, email, maps, browser active where applicable |

---

## 12. Compare Screen (Current Accepted State)

| Item | Current Behavior |
|---|---|
| Main title | PreferredHome |
| Modes | Card view and table view |
| Compare state | Centralized compare selection logic |
| Residual UI restore items | Deferred to V5 UI track (frozen row / `Criteria` upper-left heading and related table polish) |

---

## 13. Calendar Screen (Current Accepted State)

| Item | Current Behavior |
|---|---|
| Layout | Calendar at top, appointments list below |
| Appointments | Independent scrolling area below calendar |
| Address tap | Opens maps using street/city/state/zip only |
| Residual polish | Any remaining layout polish deferred to V5 UI track |

---

## 14. Listings Screen (Current Accepted State)

| Item | Current Behavior |
|---|---|
| Grouping | Preferred / Candidates |
| Card actions | Heart, Compare, View, Edit, Delete |
| Filter / sort | Controlled through FilterPanel / sort logic |
| Residual future feature UI | List/Map sub-header controls belong to V5 Map View feature build |

---

## 15. Home Screen (Current Accepted State)

Home remains part of the accepted 3.2.x baseline. Any further existing-screen polish belongs to the V5 UI track unless specifically reopened.

---

## 16. Folder Structure (Current High-Level Map)

| Path | Contents |
|---|---|
| `app/(tabs)/` | Core tab screens |
| `app/` | Non-tab routes such as edit and any panel-style routes |
| `components/` | Shared UI components |
| `lib/` | API helpers, storage helpers, normalization, compare/profile state |
| `styles/` | Color, typography, spacing tokens |
| `assets/` | Icons and images |

---

## 17. API Functions (Current)

| Function | Method + Path | Purpose |
|---|---|---|
| getHealth() | GET `/health` | Check API status |
| getListings() | GET `/listings` | Fetch listings |
| postListing() | POST `/listings` | Add listing |
| updateListing() | PUT `/listings/:id` | Update listing |
| deleteListing() | DELETE `/listings/:id` | Delete listing |

---

## 18. Current Testing Protocol

| Test | Purpose |
|---|---|
| Device smoke test | No red screen, all tabs render |
| Add / Save test | Listing can be added successfully |
| Edit / Save test | Listing can be edited successfully |
| Panel open/close test | ViewPanel, Profile, Criteria, Settings behavior |
| Compare test | Card/table modes still work |
| Calendar test | Calendar + appointments remain usable |
| API verify | `/health` after backend deploys only |

---

## 19. Architecture Governance Notes

- Project Architecture is PM-owned and updated only when explicitly requested.
- This document reflects accepted current behavior, not speculative next steps.
- Build history, commit history, and migration notes are intentionally excluded.
- V4 will add a separate Master Engineering Directive rather than replacing this document.
