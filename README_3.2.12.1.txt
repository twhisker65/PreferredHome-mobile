PreferredHome — Build 3.2.12.1 (HOTFIX)
=========================================
Fixes wrong folder structure from Build 3.2.12 delivery.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

WHAT WENT WRONG IN 3.2.12
---------------------------
Build 3.2.12 ZIP had files at app/tabs/ instead of app/(tabs)/.
The parentheses were dropped during packaging.
This caused:
- Original app/(tabs)/add.tsx and app/(tabs)/compare.tsx were never overwritten.
- A new wrongly-named app/tabs/ folder was created, causing a routing conflict.
- The routing conflict triggered a crash on the Edit screen.

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/add.tsx         — same file as 3.2.12, correctly placed
app/(tabs)/compare.tsx     — same file as 3.2.12, correctly placed
app/edit.tsx               — same file as 3.2.12 (correctly placed in 3.2.12 also)
components/ViewPanel.tsx   — same file as 3.2.12 (correctly placed in 3.2.12 also)

DEPLOY STEPS
------------
IMPORTANT: Step 1 must be done before copying new files.

1. In your local PreferredHome-mobile folder, DELETE the entire app/tabs/ folder
   (the wrongly-created one — it has no parentheses).
   The correct folder is app/(tabs)/ — do NOT delete that one.

2. Copy the 4 files from this ZIP into their matching locations, overwriting existing:
     app/(tabs)/add.tsx
     app/(tabs)/compare.tsx
     app/edit.tsx
     components/ViewPanel.tsx

3. Commit in GitHub Desktop using the commit message below.
4. Push to GitHub.
5. Restart Expo using the command below.
6. Test on your physical device using the full test checklist.

COMMIT MESSAGE
--------------
Build 3.2.12.1 -- Hotfix: correct folder structure for add.tsx and compare.tsx

EXPO RESTART COMMAND
--------------------
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

TEST CHECKLIST — Full re-test required
---------------------------------------
Add screen — Property Type show/hide
[ ] 1. Open Add screen. Property Type is Apartment (default). Unit #, Floor Number, Top Floor, Corner Unit are all visible.
[ ] 2. Change Property Type to House. Unit #, Floor Number, Top Floor, Corner Unit disappear immediately.
[ ] 3. Change Property Type to Townhouse. Same four fields disappear.
[ ] 4. Change Property Type to Condo. All four fields reappear.
[ ] 5. Change Property Type to Co-op. All four fields reappear.
[ ] 6. Number of Floors remains visible for all five property types.

Add screen — Field move
[ ] 7. Short Term Available and Renters Insurance Required are no longer in the Property section.
[ ] 8. Short Term Available and Renters Insurance Required appear in the Listing section alongside No Board Approval and No Broker Fee.

Edit screen — Property Type show/hide
[ ] 9. Open Edit for a House or Townhouse listing. Unit #, Floor Number, Top Floor, Corner Unit are hidden.
[ ] 10. Open Edit for an Apartment, Condo, or Co-op listing. All four fields are visible.

Edit screen — Field move
[ ] 11. Short Term Available and Renters Insurance Required are in the Listing section, not the Property section.

View Listing panel — (previously passing, confirm unchanged)
[ ] 12-25. All previously passing tests still pass.

Compare — Property Type show/hide
[ ] 26. Select a House or Townhouse for Compare. Unit #, Floor Number, Top Floor, Corner Unit rows are hidden.
[ ] 27. Select an Apartment, Condo, or Co-op. All four rows appear.

Compare — New fields
[ ] 28. Storage Rent, Broker Fee, Move-in Fee, Heating Type, Room Types, Outdoor Space, and Storage rows are visible on both card and table views.
