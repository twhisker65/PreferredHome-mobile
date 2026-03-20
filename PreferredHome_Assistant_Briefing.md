# PreferredHome — Assistant Briefing
**Build 3.2.10 | March 2026**

---

## Project Identity

| Item | Detail |
|---|---|
| App | PreferredHome — Capture. Compare. Decide. |
| Platform | React Native / Expo Router — Expo Go with tunnel mode |
| Backend | Python FastAPI on Render — https://preferredhome-api.onrender.com |
| Data store | Google Sheets via gspread |
| Local path | `C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile` |
| Mobile repo | https://github.com/twhisker65/PreferredHome-mobile |
| API repo | https://github.com/twhisker65/PreferredHome-api |
| Protocols | Read `PreferredHome_Dev_Control_Protocols.md` in full before any build. |
| Drift Log | Read `PreferredHome_Drift_Log.md` in full. State most likely drift before touching any file. |

---

## Current State

| Item | Status |
|---|---|
| Stable baseline | Build 3.2.10 + Hotfix 3.2.10.1 — confirmed stable. |
| ISSUE 1 (carried fwd) | Edit page shows only Building Name. Root cause: edit.tsx passes ListingUI to rawToDraft() instead of raw API response. Target: 3.2.11. |
| ISSUE 2 (carried fwd) | API totalMonthly omits fees for some listings. Workaround: compare.tsx uses local baseRent + fees. Permanent fix: Build 3.2.13. |

---

## Build 3.2.10 Session Summary

| Build | Change |
|---|---|
| 3.2.10 | Tap-to-contact links — phone opens dialer, email opens mail app, address opens Maps, URL opens browser. ViewPanel only. |
| 3.2.10.1 HOTFIX | Maps link corrected to use street/city/state/zip only — unit number excluded from Maps query. |

---

## Active Drift Warnings — Carry Forward Every Session

| ID | Warning |
|---|---|
| DRIFT 1 | No Unit section — unit fields appear at end of PROPERTY section only. |
| DRIFT 5 | Apply boolStr() to every file that sends a payload to the API. |
| DRIFT 6 | No structural changes to any screen without explicit authorisation. |
| DRIFT 7 | Read the original spec before touching any form structure. |

---

## Roadmap — Remaining Builds

| Build | Scope |
|---|---|
| 3.2.11 | All new data fields — pet fee, property type, garage, yard, basement, floors. Also resolves ISSUE 1. |
| 3.2.12 | Field visibility rules — property type drives which fields show on all screens. |
| 3.2.13 | Auto-calculations — Total Monthly + Total One-Time Upfront. API totalMonthly fix (ISSUE 2). |
| 3.2.14 | ZIP to City/State auto-fill + Listing Site auto-detect from URL pattern match. |
| 3.2.15 | Commute Calculation + Walk / Transit / Bike Scores. |
| 3.2.16 | Add/Edit Unification + efficiency cleanup. |
| 3.2.17 | Canonical Data Model. |
| 3.2.18 | UI Polish. |
| 3.2.19 | APK — Android local testing. |
| 5.0+ | Notifications, Photos, Criteria Scoring, Login/Sync, URL Import, Import/Export, Themes, Help Center, User-Defined Lists, Buying Mode, Map View. |

---

## Session Start Protocol (Mandatory)

1. Read `PreferredHome_Dev_Control_Protocols.md` in full.
2. Read `PreferredHome_Drift_Log.md` in full. State which past drift is most likely to recur and how it will be avoided.
3. Acknowledge repo state — confirm GitHub sync has been performed.
4. Read this Assistant Briefing and Next Steps.
5. Restate Thomas's request precisely.
6. Ask clarifying questions.
7. Summarise all tasks.
8. Perform Code-Start Gate — read in-scope files, state working vs missing, produce Begin Build Brief with Do Not Touch list, produce Pre-Test Declaration, wait for confirmation.
9. Produce Session Confirmation Checklist widget — wait for Thomas to complete it.
10. Analyse both repos for compatibility.
11. Declare readiness. DO NOT write any code until Thomas explicitly says go ahead.
