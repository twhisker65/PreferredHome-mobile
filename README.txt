PreferredHome — Build 3.2.15.1 Hotfix
======================================
Commute calculation fix — restore separate calculate endpoint.
Generated: March 2026

ROOT CAUSE
----------
Build 3.2.15 injected commute calculation inline inside the POST/PUT handlers.
If the Google Maps call returned None for any reason, the listing saved with 200 OK
and no trace appeared in the logs. The previous working approach used a separate
endpoint called after save, which is more reliable and debuggable.

CHANGED FILES
-------------

API repo (PreferredHome-api):
  main.py   — POST/PUT handlers reverted to 3.2.14.1 (no inline commute).
              Restored: POST /commute/calculate/{listing_id} as standalone endpoint.
              Kept: POST /commute/recalculate-all unchanged.
              Version: 3.2.15.1

Mobile repo (PreferredHome-mobile):
  lib/api.ts      — added calculateCommute(listingId, params)
  app/(tabs)/add.tsx — removed 3 commute fields from payload;
                       fires calculateCommute after postListing succeeds (fire-and-forget)
  app/edit.tsx    — same as add.tsx

NOT CHANGED
-----------
  components/ProfilePanel.tsx — unchanged from 3.2.15 delivery
  requirements.txt            — unchanged from 3.2.15 delivery
  preferredhome_api/utils/helpers.py — unchanged from 3.2.15 delivery

DEPLOY STEPS — API
------------------
1. Copy main.py into PreferredHome-api repo (overwrite existing)
2. Commit in GitHub Desktop:
     Build 3.2.15.1 Hotfix - restore separate commute calculate endpoint
3. Push to MAIN
4. Render: "Deploy latest commit"
5. Verify: https://preferredhome-api.onrender.com/health
   Expected: { "ok": "PreferredHome API 3.2.15.1" }

DEPLOY STEPS — MOBILE
----------------------
1. Copy these 3 files into PreferredHome-mobile repo (overwrite existing):
     lib/api.ts
     app/(tabs)/add.tsx
     app/edit.tsx
2. Commit in GitHub Desktop (same message as above)
3. Push to MAIN
4. Restart Expo (see command below)
5. Test on physical device

TEST CHECKLIST
--------------
[ ] T1 — Add a new listing with a full street address. Save.
         Open listing in ViewPanel — Commute Time shows a number (minutes).
[ ] T2 — Edit an existing listing. Change the street address. Save.
         Open listing — Commute Time updated.
[ ] T3 — Open Profile. Change Work Address. Close panel.
         Open any listing — Commute Time updated across all listings.
[ ] T4 — Open Profile. Change Commute Method. Close panel.
         Commute times updated.
[ ] T5 — Open Profile. Change Departure Time. Close panel.
         Commute times updated.
[ ] T6 — Google Sheet: no duplicate rows after any operation.

COMMIT MESSAGE
--------------
Build 3.2.15.1 Hotfix - restore separate commute calculate endpoint

EXPO RESTART COMMAND
--------------------
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

RENDER HEALTH CHECK
-------------------
https://preferredhome-api.onrender.com/health
