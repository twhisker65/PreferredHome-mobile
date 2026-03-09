HOTFIX — Build 3.2.03
=====================
PreferredHome | Mobile repo only | No API changes | No Render deploy required.

ISSUES FIXED
------------
1. Save Failed (HTTP 400) on Edit screen
   Root cause: Boolean fields (preferred, topFloor, cornerUnit, furnished,
   noBoardApproval, noBrokerFee) were being sent as JavaScript true/false.
   The API expects the strings "TRUE" or "FALSE".
   Fix: All boolean fields now serialized via boolStr() helper before sending.
   Same fix applied to add.tsx — same bug existed there.

2. Version label missing from hamburger menu
   Root cause: MenuSheet.tsx from Build 3.2.03 was not applied correctly.
   Fix: Re-delivering the file. Label reads "PreferredHome v3.2.03".

3. Unauthorized field reorder (PROPERTY section)
   Root cause: Unit-level fields (bedrooms, bathrooms, sqft, topFloor,
   cornerUnit, furnished) were merged into the PROPERTY section without
   authorization. This was wrong.
   Fix: Restored the separate UNIT section on both add.tsx and edit.tsx.

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/add.tsx     — boolean fix; restored separate UNIT section
app/edit.tsx           — boolean fix; restored separate UNIT section
components/MenuSheet.tsx — re-delivered; version label "PreferredHome v3.2.03"

DEPLOY STEPS
------------
1. Copy all 3 files from this ZIP into your local PreferredHome-mobile repo,
   overwriting existing files.

2. Run the Expo restart command:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel

3. Test on phone using checklist below.

4. Commit via GitHub Desktop using the commit message below.

5. Push to GitHub.

6. Claude Project → GitHub connection → Sync now (mobile repo).

TEST CHECKLIST
--------------
[ ] 1. Edit screen — open any listing, tap Save Changes — save succeeds (no HTTP 400)
[ ] 2. Edit screen — toggle any boolean (Preferred, Top Floor, etc.) — still saves correctly
[ ] 3. Add screen — save a new listing — saves successfully
[ ] 4. Hamburger menu — version label reads "PreferredHome v3.2.03"
[ ] 5. Add screen — PROPERTY section does not contain bedrooms/bathrooms/sqft
[ ] 6. Add screen — UNIT section is present and contains bedrooms, bathrooms,
        sqft, Top Floor, Corner Unit, Furnished
[ ] 7. Edit screen — same PROPERTY / UNIT section separation confirmed

COMMIT MESSAGE
--------------
Hotfix 3.2.03 — fix boolean serialization on Edit and Add save, restore UNIT section, re-deliver version label
