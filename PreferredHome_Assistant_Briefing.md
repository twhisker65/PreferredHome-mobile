# PreferredHome — Assistant Briefing
**Closing Out Build 3.2.12.4.1 | March 2026**

---

## Project Identity

| Item | Detail |
|---|---|
| App | PreferredHome — Capture. Compare. Decide. |
| Platform | React Native / Expo Router — Expo Go with tunnel mode |
| Backend | Python FastAPI on Render — https://preferredhome-api.onrender.com |
| Data Store | Google Sheets via gspread |
| Local Path | `C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile` |
| Mobile Repo | https://github.com/twhisker65/PreferredHome-mobile |
| API Repo | https://github.com/twhisker65/PreferredHome-api |
| Protocols | Read `PreferredHome_Dev_Control_Protocols.md` in full before any build. |
| Drift Log | Read `PreferredHome_Drift_Log.md` in full. State most likely drift before touching any file. |

---

## Current State

| Item | Status |
|---|---|
| Stable Baseline | Build 3.2.12.4.1 — confirmed stable. All 6 test items passed. |
| ISSUE 2 (carried fwd) | API `totalMonthly` omits fees for some listings. Workaround: `compare.tsx` uses local `baseRent + fees`. Permanent fix: Build 3.2.13. |

---

## Build History — 3.2.12 Series

| Build | File | Status | Notes |
|---|---|---|---|
| 3.2.12 | add.tsx, edit.tsx, ViewPanel.tsx, compare.tsx | Superseded | Wrong folder structure in ZIP — app/tabs/ instead of app/(tabs)/ |
| 3.2.12.1 | add.tsx, edit.tsx, ViewPanel.tsx, compare.tsx | Superseded | Folder structure fixed. Edit screen still crashed — fetchListing invented. Option arrays wrong. Compare Clear button missing. |
| 3.2.12.2 | edit.tsx only | Confirmed stable | fetchListing replaced with getListings + find. Option arrays restored. Costs order restored. |
| 3.2.12.3 | add.tsx only | Confirmed stable | 8 option arrays restored. Costs field order restored. Identical fix to edit.tsx. |
| 3.2.12.4 | compare.tsx | Superseded | Clear button restored. 7 CARD_ROWS added. LABEL_W 100→120. Label still truncated, toggle reload missing, rowHeights ref not re-rendering. |
| 3.2.12.4.1 | compare.tsx | Confirmed stable | LABEL_W 120→150. ProfilePanel onClose reloads toggles. rowHeights converted from useRef to useState. |

---

## What Is Currently Stable — Per File

| File | Stable Build | Notes |
|---|---|---|
| `app/(tabs)/add.tsx` | 3.2.12.3 | Option arrays correct. Costs order correct. Fully stable. |
| `app/edit.tsx` | 3.2.12.2 | Fully correct. |
| `components/ViewPanel.tsx` | 3.2.12.1 | All tests passed — stable. |
| `app/(tabs)/compare.tsx` | 3.2.12.4.1 | Clear button, 7 CARD_ROWS, label width, toggle reload, row height alignment — all confirmed stable. |

---

## Confirmed Stable Features — 3.2.12 Series

| Feature | Status |
|---|---|
| Property Type show/hide on Add | Stable — 3.2.12.1 |
| Property Type show/hide on Edit | Stable — 3.2.12.2 |
| Property Type show/hide on ViewPanel | Stable — 3.2.12.1 |
| Property Type show/hide on Compare table | Stable — 3.2.12.1 |
| shortTermAvailable + rentersInsuranceRequired moved to Listing section (Add) | Stable — 3.2.12.1 |
| shortTermAvailable + rentersInsuranceRequired moved to Listing section (Edit) | Stable — 3.2.12.2 |
| New fields visible in ViewPanel | Stable — 3.2.12.1 |
| coolingType fix in ViewPanel | Stable — 3.2.12.1 |
| petFee gated in ViewPanel | Stable — 3.2.12.1 |
| Option arrays correct on Add | Stable — 3.2.12.3 |
| Costs field order correct on Add | Stable — 3.2.12.3 |
| Compare Clear button | Stable — 3.2.12.4.1 |
| Compare CARD_ROWS — 7 added rows | Stable — 3.2.12.4.1 |
| Compare label truncation fix (LABEL_W 150) | Stable — 3.2.12.4.1 |
| Compare toggle reload on ProfilePanel close | Stable — 3.2.12.4.1 |
| Compare label row height alignment | Stable — 3.2.12.4.1 |

---

## Field Renames — Permanent Record

| Old Name | New Name | Completed |
|---|---|---|
| `unitType` | `propertyType` | Build 3.2.11A |
| `acType` | `coolingType` | Build 3.2.11A |

---

## Locked Terminology

- Property Type options: Apartment, Condo, Co-op, Townhouse, House — exactly 5, exact casing
- Co-op is lowercase 'o' and lowercase 'p' — confirmed correct and locked

---

## Open Issues — Carried Forward

| ID | Issue | Target |
|---|---|---|
| ISSUE 2 | API `totalMonthly` omits fees for some listings. Compare screen uses local calculation as workaround. | Build 3.2.13 |

---

## Immediate Next Step — Build 3.2.13

**Scope:** Auto-calculations — Total Monthly + Total One-Time Upfront. API `totalMonthly` fix (ISSUE 2).

---

## Roadmap — Remaining Builds

| Build | Scope |
|---|---|
| 3.2.13 | Auto-calculations — Total Monthly + Total One-Time Upfront. API totalMonthly fix (ISSUE 2) |
| 3.2.14 | ZIP to City/State auto-fill + Listing Site auto-detect from URL pattern |
| 3.2.15 | Commute Calculation + Walk / Transit / Bike Scores via backend API calls |
| 3.2.16 | Add/Edit Unification — single shared form component |
| 3.2.17 | Canonical Data Model — one master field list across all screens and API |
| 3.2.18 | UI Polish — spacing, typography, visual consistency. No functional changes. |
| 3.2.19 | APK build for Android local testing before App Store submission |

---

## Active Drift Warnings — Carry Forward Every Session

| ID | Rule |
|---|---|
| DRIFT 1 | No Unit section. Unit fields appear at the end of the PROPERTY section only. Never create a separate Unit sub-section. |
| DRIFT 5 | Apply `boolStr()` to every file that sends a payload to the API. Never apply it to only one file when the same pattern exists in others. |
| DRIFT 6 | No structural changes to any screen without explicit authorisation from Thomas. If in doubt — ask first. |
| DRIFT 7 | Read the original spec before touching any form structure. Never infer the structure from memory. |
| DRIFT 8 | Never invent API functions. Read `lib/api.ts` before writing any import that references it. |
