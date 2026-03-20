# PreferredHome — Next Steps
**Build 3.2.11B | March 2026**

---

## Build 3.2.11B — Confirmed Stable

Build 3.2.11B is confirmed stable. All test steps passed.

---

## Test Checklist — Completed

| Step | Result |
|---|---|
| Add screen — Property Type at position 2 | PASS |
| Add screen — Number of Floors after Floor Number | PASS |
| Add screen — Short Term Available and Renters Insurance Required toggles | PASS |
| Add screen — COSTS section shows MONTHLY and UPFRONT sub-labels | PASS |
| Add screen — Parking Fee gated by Car toggle | PASS |
| Add screen — Pet Fee gated by Pets toggle | PASS |
| Add screen — Storage Rent, Broker Fee, Move-in Fee present | PASS |
| Add screen — Features section order correct | PASS |
| Add screen — Save with new fields filled in, no errors | PASS |
| Edit screen — all fields load correctly (ISSUE 1 resolved) | PASS |
| Edit screen — Property Type, Cooling Type, all new fields populate | PASS |
| Edit screen — Save changes, no errors | PASS |
| Listings screen — propertyType shown in unit summary | PASS |
| Listings screen — petFee and storageRent included in fee total | PASS |

---

## What Was Delivered — Build 3.2.11B

| File | Change |
|---|---|
| `app/(tabs)/add.tsx` | New fields, renamed fields, updated option arrays, COSTS Monthly/Upfront grouping, FEATURES restructure |
| `app/edit.tsx` | Same as add.tsx plus rawToDraft parsing for all new fields. ISSUE 1 resolved. |
| `lib/listingsNormalize.ts` | `unitType` → `propertyType`, `petFee` and `storageRent` added to fees total |

---

## Issues Resolved This Build

| Issue | Resolution |
|---|---|
| ISSUE 1 — Edit page showed only Building Name | Fixed. `rawToDraft()` now correctly reads `propertyType`, `coolingType`, and all 11 new fields from the raw API response. |

---

## Deferred Items — Carry Forward

| Item | Target Build |
|---|---|
| `components/ViewPanel.tsx` — display new fields | To be scheduled |
| `app/(tabs)/compare.tsx` — display new fields | To be scheduled |
| ISSUE 2 — API `totalMonthly` omits fees for some listings | Build 3.2.13 |

---

## Immediate Next Step

Decide where ViewPanel and Compare fit in the roadmap relative to the remaining scheduled builds (3.2.12 through 3.2.17). Options to discuss at next session start.

---

## Session Close Steps

1. Drop `PreferredHome_Next_Steps.md` and `PreferredHome_Assistant_Briefing.md` into the repo root (overwrite previous versions)
2. Commit in GitHub Desktop
3. Push to GitHub
4. Sync the Claude Project
