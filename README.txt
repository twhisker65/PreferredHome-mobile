PreferredHome — Revert to Build 3.2.14.1
=========================================
Generated: March 2026

This ZIP reverts ALL files changed during Build 3.2.15, 3.2.15.1, and 3.2.15.2
back to their exact pre-3.2.15 state. No commute feature. Stable 3.2.14.1 baseline.

CHANGED FILES
-------------

API repo (PreferredHome-api):
  requirements.txt                        — requests removed
  preferredhome_api/utils/helpers.py      — commute functions removed
  main.py                                 — commute endpoints removed, version 3.2.14

Mobile repo (PreferredHome-mobile):
  lib/api.ts                              — calculateCommute / recalculateAllCommutes removed
  app/(tabs)/add.tsx                      — commute logic removed, exact 3.2.14.1 option arrays
  app/edit.tsx                            — commute logic removed, exact 3.2.14.1 option arrays
  components/ProfilePanel.tsx             — exact 3.2.06 state, no commute logic

DEPLOY STEPS
------------

API:
1. Copy these 3 files into PreferredHome-api repo (overwrite existing):
   requirements.txt
   preferredhome_api/utils/helpers.py
   main.py
2. Commit: Revert to Build 3.2.14.1 - remove commute feature
3. Push to MAIN
4. Render: Deploy latest commit
5. Verify: https://preferredhome-api.onrender.com/health
   Expected: { "ok": "PreferredHome API 3.2.14" }

Mobile:
1. Copy these 4 files into PreferredHome-mobile repo (overwrite existing):
   lib/api.ts
   app/(tabs)/add.tsx
   app/edit.tsx
   components/ProfilePanel.tsx
2. Commit: Revert to Build 3.2.14.1 - remove commute feature
3. Push to MAIN
4. Restart Expo:
   cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

COMMIT MESSAGE
--------------
Revert to Build 3.2.14.1 - remove commute feature

TEST CHECKLIST
--------------

T1 — Listings page loads without error
T2 — Compare table scrolls vertically, no infinite horizontal scroll, no duplicate key error
T3 — Add screen: Property Type options = Apartment, Condo, Co-op, Townhouse, House
T4 — Add screen: Cooling Type options = Central Air, Wall Unit, Window Unit, None
T5 — Add screen: Parking options = Shared Garage, Shared Lot, Covered Space...
T6 — Profile panel opens, all fields present, closes without error
T7 — Add a listing — saves correctly
T8 — Edit a listing — saves correctly
