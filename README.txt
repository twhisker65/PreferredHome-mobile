PreferredHome — Build 3.2.15
============================
Commute Calculation — API calculates commute time via Google Maps
and stores it in commuteTime on each listing.
Generated: March 2026

CHANGED FILES
-------------

API repo (PreferredHome-api):
  requirements.txt                          — added: requests library
  preferredhome_api/utils/helpers.py        — added: calculate_commute(), _next_monday_timestamp()
  main.py                                   — added: commute calc in POST/PUT handlers;
                                              POST /commute/recalculate-all endpoint; version 3.2.15

Mobile repo (PreferredHome-mobile):
  lib/api.ts                                — added: recalculateAllCommutes()
  app/(tabs)/add.tsx                        — added: profileRef; workAddress/commuteMethod/
                                              departureTime passed in save payload
  app/edit.tsx                              — same as add.tsx
  components/ProfilePanel.tsx               — departure time changed from free text to
                                              TIME_OPTIONS picker; commute snapshot + handleClose
                                              fires recalculateAllCommutes when commute fields change

HOW COMMUTE WORKS
-----------------
- Add/Edit save: mobile sends workAddress, commuteMethod, departureTime alongside the
  listing payload. API extracts them, calls Google Maps, injects commuteTime into the
  listing row, saves everything in one write. No separate call, no loop.

- Profile commute change: when the panel closes, if workAddress/commuteMethod/departureTime
  changed and workAddress is not blank, mobile fires POST /commute/recalculate-all.
  API loads the full sheet once, calculates commute for every listing with a street address
  in Python (no Sheets writes in the loop), then writes the entire sheet once.

- If GOOGLE_MAPS_API_KEY is not set: calculation silently skips. No crash, no error shown.
- If Google Maps returns no result: commuteTime field is left as-is.

REQUIRED BEFORE DEPLOYING
--------------------------
Confirm GOOGLE_MAPS_API_KEY is set in Render dashboard:
  Render → PreferredHome API → Environment
  Key: GOOGLE_MAPS_API_KEY
  Value: your Distance Matrix API key

DEPLOY STEPS — API
------------------
1. Copy these 3 files into your local PreferredHome-api repo (overwrite existing):
     requirements.txt
     preferredhome_api/utils/helpers.py
     main.py
2. Commit in GitHub Desktop:
     Build 3.2.15 - Commute calculation via Google Maps Distance Matrix API
3. Push to MAIN
4. Render: "Deploy latest commit" (never Restart)
5. Verify: https://preferredhome-api.onrender.com/health
   Expected: { "ok": "PreferredHome API 3.2.15" }

DEPLOY STEPS — MOBILE
----------------------
1. Copy these 4 files into your local PreferredHome-mobile repo (overwrite existing):
     lib/api.ts
     app/(tabs)/add.tsx
     app/edit.tsx
     components/ProfilePanel.tsx
2. Commit in GitHub Desktop (same message as above)
3. Push to MAIN
4. Restart Expo (see command below)
5. Test on physical device

TEST CHECKLIST
--------------
[ ] T1 — Add a new listing with a full street address. Save.
         Open the listing in ViewPanel — Commute Time shows a number (minutes).
[ ] T2 — Edit an existing listing. Change the street address. Save.
         Open listing — Commute Time updated.
[ ] T3 — Open Profile (hamburger → Profile). Change Work Address. Close panel.
         Open any listing — Commute Time updated across all listings.
[ ] T4 — Open Profile. Change Commute Method. Close panel.
         Open any listing — Commute Time updated.
[ ] T5 — Open Profile. Change Departure Time (now a picker, not free text).
         Close panel — Commute Time updated across all listings.
[ ] T6 — Add screen: Property Type options = Apartment, Condo, Co-op, Townhouse, House
         Cooling Type options = Central Air, Wall Unit, Window Unit, None
         Parking options = Shared Garage, Shared Lot, Covered Space, Attached Garage...
[ ] T7 — Edit screen: same option arrays as Add.
[ ] T8 — Listings page loads without error, all cards display.
[ ] T9 — Compare page loads, card view and table view both work.
[ ] T10 — Google Sheet: no duplicate rows after any save operation.
[ ] T11 — If Work Address is blank in Profile, closing panel after change does NOT fire
          a recalculate call (no error, no crash).

COMMIT MESSAGE
--------------
Build 3.2.15 - Commute calculation via Google Maps Distance Matrix API

EXPO RESTART COMMAND
--------------------
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

RENDER HEALTH CHECK
-------------------
https://preferredhome-api.onrender.com/health
