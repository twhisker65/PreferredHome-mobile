HOTFIX 2 — Build 3.2.03
========================
PreferredHome | Mobile repo only | No API changes for these 3 files.
NOTE: The Save Failed (zipCode int64) issue requires an API fix — see below.

ISSUES FIXED IN THIS HOTFIX
-----------------------------
1. No Unit section (unauthorized section removed)
   The Data Architecture defines all property-level fields in a single PROPERTY
   section. No "Unit" section exists or was ever instructed. Bedrooms, Bathrooms,
   Square Footage, Top Floor, Corner Unit, and Furnished now appear at the end of
   the PROPERTY section on both Add and Edit screens.

2. Version label not showing in hamburger menu
   Root cause: label was placed after the Close button and getting cut off by the
   device's bottom safe area. Fixed: label now appears above the Close button.

3. City and State appear before Zip Code on Edit screen
   As instructed: Edit screen shows City and State as editable fields before the
   Zip Code field. (Add screen auto-fills from ZIP so order is different there.)

REMAINING ISSUE — API FIX REQUIRED
------------------------------------
Save Failed: "Invalid value '10601' for dtype 'int64'"

Root cause: The Google Sheet is storing the zipCode column as a number (integer),
not as text. When the API reads the sheet, pandas assigns that column dtype int64.
When the mobile sends zipCode as the string "10601" during an Edit save (PUT),
pandas rejects it because int64 cannot accept a string value.

Per the Data Architecture V4, zipCode is defined as type TEXT, not a number.
This is a bug in config_constants.py — zipCode must be removed from NUMERIC_FIELDS.

To fix this, a separate API change is needed:
  File: preferredhome_api/config/config_constants.py
  Change: Remove "zipCode" from the NUMERIC_FIELDS list (or equivalent).
  Then: Redeploy to Render and verify /health shows the correct version.

This API fix is out of scope for this hotfix ZIP. It requires a separate
authorized API build. Do NOT attempt this change without a full build session.

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/add.tsx     — Unit section removed; all fields now in PROPERTY
app/edit.tsx           — Unit section removed; City and State before Zip
components/MenuSheet.tsx — version label moved above Close button

DEPLOY STEPS
------------
1. Copy all 3 files from this ZIP into your local PreferredHome-mobile repo,
   overwriting existing files.

2. Run the Expo restart command:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel

3. Test on phone using the checklist below.

4. Commit via GitHub Desktop using the commit message below.

5. Push to GitHub.

6. Claude Project → GitHub connection → Sync now (mobile repo).

TEST CHECKLIST
--------------
[ ] 1. Hamburger menu — version label "PreferredHome v3.2.03" appears ABOVE the Close button
[ ] 2. Add screen — PROPERTY section contains Bedrooms, Bathrooms, Square Footage,
        Top Floor, Corner Unit, Furnished at the bottom of the section
[ ] 3. Add screen — NO separate "Unit" section header visible
[ ] 4. Edit screen — PROPERTY section shows City and State BEFORE Zip Code
[ ] 5. Edit screen — NO separate "Unit" section header visible
[ ] 6. Edit screen — Bedrooms, Bathrooms, Square Footage, Top Floor, Corner Unit,
        Furnished all appear at the bottom of the PROPERTY section
[ ] 7. Edit screen save — if zipCode is unchanged, confirm whether save now works
        (it may still fail until the API fix is applied)

COMMIT MESSAGE
--------------
Hotfix 2 — 3.2.03: remove Unit section (fields in PROPERTY), City/State before ZIP on Edit, version label above Close
