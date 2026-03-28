PreferredHome — Build 3.2.15.1 Hotfix
======================================
Generated: March 2026

CHANGED FILES
-------------

API repo (PreferredHome-api):
  main.py   — recalculate-all: single Sheets read, batch in-memory update, single write

Mobile repo (PreferredHome-mobile):
  app/(tabs)/add.tsx            — PROPERTY_TYPES, COOLING_TYPES, PARKING restored to 3.2.14.1 values
  app/edit.tsx                  — same
  components/ProfilePanel.tsx   — departure time Modal replaced with inline expandable list

WHAT WAS BROKEN AND WHY
------------------------

1. Listings page load failed (HTTP 500 / 429 quota exceeded)
   recalculate-all called update_listing() once per listing.
   Each update_listing() does a full Sheets read + full Sheets write.
   With N listings that is 3N Sheets API calls fired simultaneously.
   Google Sheets per-minute quota was exceeded, making ALL subsequent
   Sheets reads fail — including getListings() on every screen.
   FIX: recalculate-all now loads the sheet once, updates all commuteTime
   values in the DataFrame in memory, then writes once. 2 API calls total.

2. Compare page duplicate key error / continuous scroll
   ProfilePanel contained a Modal. A Modal nested inside an
   absolutely-positioned Animated.View interferes with React Native's
   scroll reconciliation for sibling ScrollViews (the compare table).
   FIX: Modal removed. Departure time is now an inline expandable list
   using nestedScrollEnabled inside the panel's own ScrollView.

3. Option arrays changed (PROPERTY_TYPES, COOLING_TYPES, PARKING)
   These were rewritten from scratch instead of copied from 3.2.14.1.
   FIX: All three arrays restored exactly to 3.2.14.1 values.
   A comment is now added above the constant block to make the freeze
   rule explicit in the file itself.

DEPLOY STEPS
------------

API:
1. Copy main.py into PreferredHome-api repo root (overwrite existing)
2. Commit in GitHub Desktop:
   Build 3.2.15.1 Hotfix - Fix Sheets quota breach in recalculate-all, fix compare scroll, restore option arrays
3. Push to GitHub (MAIN)
4. Render: "Deploy latest commit"
5. Verify: GET https://preferredhome-api.onrender.com/health
   Expected: { "ok": "PreferredHome API 3.2.15.1" }

Mobile:
1. Copy these 3 files into PreferredHome-mobile repo (overwrite existing):
   app/(tabs)/add.tsx
   app/edit.tsx
   components/ProfilePanel.tsx
2. Commit in GitHub Desktop (same message as above)
3. Push to GitHub (MAIN)
4. Restart Expo:
   cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

TEST CHECKLIST
--------------

T1 — Listings page loads
    Open Listings tab. Listings load without error. No 500 / quota error.

T2 — Compare table — no continuous scroll
    Add 2+ listings to compare. Switch to table view. Scroll normally.
    No runaway scrolling. No duplicate key error toast.

T3 — Cooling Type options correct
    Open Add or Edit. Features section → Cooling Type.
    Options: Central Air, Wall Unit, Window Unit, None.

T4 — Parking options correct
    Open Add or Edit (Car toggle ON). Features section → Parking Type.
    Options: Shared Garage, Shared Lot, Covered Space, Attached Garage,
    Detached Garage, Driveway, Carport, Street, None, Other.

T5 — Property Type options correct
    Open Add or Edit. Property section → Property Type.
    Options: Apartment, Condo, Co-op, Townhouse, House.

T6 — Departure time picker (inline, no modal)
    Open Profile panel. Tap Usual Departure Time field.
    Inline list expands below the field. Select a time — list collapses.
    Tap Clear — field resets. No modal appears.

T7 — Commute recalculates on profile close
    Set work address in Profile. Change commute method. Close panel.
    Wait ~10 seconds. Pull to refresh. Commute times updated.

T8 — Commute recalculates after edit save
    Open Edit on a listing with a street address. Change any field. Save.
    Wait ~5 seconds. Open the listing. Commute Time refreshed.

T9 — Health check
    GET https://preferredhome-api.onrender.com/health
    Returns: { "ok": "PreferredHome API 3.2.15.1" }
