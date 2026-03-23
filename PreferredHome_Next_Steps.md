# PreferredHome — Next Steps
**Closing Out Build 3.2.13.2 | March 2026**

---

## Build 3.2.13.2 — Confirmed Stable

Build 3.2.13.2 is confirmed stable. All 5 test items passed.

---

## This Session — What Was Done

| Item | Detail |
|---|---|
| Build 3.2.13 delivered | listingsNormalize.ts, ViewPanel.tsx, compare.tsx (mobile) + main.py, config_constants.py (API) |
| Build 3.2.13.1 delivered | config_constants.py hotfix — PARKING_OPTIONS restored after unauthorized rename crashed the API on Render |
| Build 3.2.13.2 delivered | compare.tsx — Total Rent now always calculated locally from raw fee fields |
| Protocol updated to V17 | Section 36 (Dependency Check Rule), Section 37 (Punishment Protocol), Section 38 (Complete Document Delivery Rule) added |
| Drift Log updated | 3 new Build 3.2.13 entries added |
| Design decision made | All screens calculate totalMonthly and totalUpfront locally — stored sheet values never used for display |

---

## Session Close Steps

1. Drop the following files into the repo root (overwrite previous versions):
   - `PreferredHome_Assistant_Briefing.md`
   - `PreferredHome_Next_Steps.md`
2. Commit in GitHub Desktop using the commit message below.
3. Push to GitHub.
4. Sync the Claude Project.

---

## Commit Message

```
Closing out Build 3.2.13.2 -- compare.tsx stable, closing docs updated
```

---

## Immediate Next Step — Build 3.2.14

**Scope:** ZIP to City/State auto-fill + Listing Site auto-detect from URL pattern match.

---

## Open Issues — Carried Forward

None. ISSUE 2 fully resolved.

---

## Test Checklist — Build 3.2.13.2

| # | Test |
|---|---|
| T1 | Open Compare with a listing that has fees. Total Rent = Base Rent + all fees. Correct. |
| T2 | Open the same listing in ViewPanel. ViewPanel Total Monthly matches Compare Total Rent exactly. |
| T3 | Open the same listing card on Listings screen. Fee subtotal on card matches the fees portion of Compare Total Rent. |
| T4 | Pull to refresh on Compare. Total Rent still correct — no change. |
| T5 | Change a fee field directly in Google Sheet. Pull to refresh on Compare — Total Rent reflects the new value immediately. |
