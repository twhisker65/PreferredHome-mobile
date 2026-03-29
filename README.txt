PreferredHome — Build 3.2.18.1 Hotfix
======================================
Two regressions introduced in Build 3.2.18 fixed.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/listings.tsx    — rightIconName prop fixed; FILTERS ACTIVE banner restored

WHAT CHANGED IN THIS HOTFIX
-----------------------------

1. TopBar prop name corrected
   Build 3.2.18 passed rightIcon="..." to TopBar. The correct prop name is
   rightIconName. The wrong name was silently ignored — the filter icon
   disappeared from the Listings header entirely.
   Fixed: rightIconName="filter" and rightIconColor prop restored.

2. FILTERS ACTIVE banner restored
   Build 3.2.18 accidentally removed the blue "FILTERS ACTIVE" banner that
   appears below the header when any filter or sort is active. Restored in full.
   The banner now also appears when a sort key is selected (isFiltersActive
   returns true when sortKey is set).

DEPLOY STEPS
------------
Mobile repo only. No API changes. No Render deploy required.

1. Copy the file from this ZIP into your local PreferredHome-mobile folder,
   overwriting the existing file:
     app/(tabs)/listings.tsx

2. Restart Expo:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Test on your physical phone using the checklist below.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.

EXPO RESTART COMMAND
---------------------
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

COMMIT MESSAGE
--------------
Build 3.2.18.1 Hotfix - restore filter icon and FILTERS ACTIVE banner on Listings screen

TEST CHECKLIST
--------------
[ ] 1. Open the Listings screen.
       Filter icon (funnel) is visible in the top-right corner of the header.

[ ] 2. Tap the filter icon.
       Panel opens — Sort & Filter Listings full-page panel appears.

[ ] 3. Select any sort key (e.g. Base Rent). Tap Apply.
       Blue "FILTERS ACTIVE" banner appears below the header.
       Filter icon in the header is now blue.

[ ] 4. Tap the filter icon again. Tap Clear.
       Banner disappears. Filter icon returns to default color.

NO API DEPLOY REQUIRED
-----------------------
This build is mobile-only. No Render changes. No /health check needed.
