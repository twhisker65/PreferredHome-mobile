# PreferredHome — Next Steps
**Build 3.2.11A | March 2026**

---

## Build 3.2.11A — Confirmed Stable

Build 3.2.11A is confirmed stable. All test steps passed.

---

## Test Checklist — Completed

| Step | Result |
|---|---|
| `/health` endpoint returns healthy response | PASS |
| `/listings` endpoint returns all listings with new fields present | PASS |
| Existing listings display correctly on Listings screen | PASS |
| View panel opens without error | PASS |
| No data loss on existing listings | PASS |
| `modal.tsx` deleted — bundler error cleared | PASS |

---

## What Was Delivered — Build 3.2.11A

| File | Change |
|---|---|
| `preferredhome_api/core/config_constants.py` | Full data model update — see below |
| `preferredhome_api/utils/helpers.py` | Import fix: `AC_TYPE_OPTIONS` → `COOLING_TYPE_OPTIONS` |

**config_constants.py changes:**
- `unitType` renamed to `propertyType` throughout
- `acType` renamed to `coolingType` throughout
- 11 new fields added to `LISTINGS_COLUMNS`: `numberOfFloors`, `heatingType`, `shortTermAvailable`, `rentersInsuranceRequired`, `petFee`, `storageRent`, `brokerFee`, `moveInFee`, `privateOutdoorSpaceTypes`, `storageTypes`, `roomTypes`
- `BOOLEAN_FIELDS`: added `shortTermAvailable`, `rentersInsuranceRequired`
- `NUMERIC_FIELDS`: added `numberOfFloors`, `petFee`, `storageRent`, `brokerFee`, `moveInFee`
- `DROPDOWN_FIELDS`: updated to `propertyType`, `coolingType`, `heatingType`, `numberOfFloors`
- `CATEGORY_FIELDS`: added `privateOutdoorSpaceTypes`, `storageTypes`, `roomTypes`
- `CATEGORY_DEFINITIONS`: full replacement with expanded option lists
- `CARD_FIELDS`: `unitType` → `propertyType`
- `BASELINE_COMPARED_FIELDS`: `acType` → `coolingType`
- New constants: `PROPERTY_TYPE_OPTIONS`, `COOLING_TYPE_OPTIONS`, `HEATING_TYPE_OPTIONS`, `NUMBER_OF_FLOORS_OPTIONS`
- `PARKING_OPTIONS`: updated to 10-value list

---

## Immediate Next Step — Build 3.2.11B

Build 3.2.11B is the mobile forms and display update. It must be started in a new session.

**Repo:** `twhisker65/PreferredHome-mobile`
**Files in scope:** `app/(tabs)/add.tsx`, `app/edit.tsx`, `lib/listingsNormalize.ts`, `components/ViewPanel.tsx`
**Build brief PDF:** `BUILD_3_2_11B_INSTRUCTIONS.pdf` — bring this to the next session.

**Before starting Part B session:**
1. Commit `modal.tsx` deletion to the mobile repo in GitHub Desktop
2. Push mobile repo to GitHub
3. Commit both changed API files to the API repo (if not already done)
4. Push API repo to GitHub
5. Sync the Claude Project

---

## Session Close Steps

1. Drop `PreferredHome_Next_Steps.md` and `PreferredHome_Assistant_Briefing.md` into the repo root (overwrite previous versions)
2. Commit in GitHub Desktop
3. Push to GitHub
4. Sync the Claude Project
