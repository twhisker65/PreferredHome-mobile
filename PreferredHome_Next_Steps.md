# PreferredHome — Next Steps
**Closing Out Build 3.2.12.4.1 | March 2026**

---

## Build 3.2.12.4.1 — Confirmed Stable

Build 3.2.12.4.1 is confirmed stable. All 6 test items passed.

---

## This Session — What Was Done

| Item | Detail |
|---|---|
| Build 3.2.12.4 delivered | compare.tsx — Clear button, 7 CARD_ROWS added, LABEL_W 100→120 |
| Build 3.2.12.4.1 delivered | compare.tsx — 3 hotfixes from testing (see below) |
| Fix 1 | LABEL_W increased from 120 to 150 — "Building Amenities" still truncated at 120 |
| Fix 2 | ProfilePanel onClose now reloads toggles — Pet Amenities and Parking were hidden even with toggles ON |
| Fix 3 | rowHeights converted from useRef to useState — label rows were not matching multi-select data row heights |

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
Closing out Build 3.2.12.4.1 -- compare.tsx stable, closing docs updated
```

---

## Immediate Next Step — Build 3.2.13

**Scope:** Auto-calculations — Total Monthly and Total One-Time Upfront displayed on Add, Edit, and ViewPanel. API `totalMonthly` fix (ISSUE 2).

---

## Open Issues — Carried Forward

| ID | Issue | Target |
|---|---|---|
| ISSUE 2 | API `totalMonthly` omits fees for some listings. Compare screen uses local calculation as workaround. | Build 3.2.13 |
