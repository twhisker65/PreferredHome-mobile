PreferredHome — Build 3.2.06 Hotfix
====================================
Fixes two bugs reported after Build 3.2.06 delivery.

CHANGED FILES
-------------
app/(tabs)/index.tsx   — BUG 1 fix: stat pills restored to Max Rent + Baseline Rent
app/edit.tsx           — BUG 2 fix: status changes no longer wipe listing data

BUG 1 — Home page stat pills were wrong
  Min Rent and Avg Rent were delivered instead of Max Rent and Baseline Rent.
  Fixed: pills now show Total, Max Rent, and Baseline Rent (loaded from your
  saved criteria via AsyncStorage).

BUG 2 — Changing status wiped all listing data
  Root cause: the edit form was initializing from the wrong data object,
  causing all fields to load blank. Saving then wrote those blank values
  to the sheet. Fixed: the form now correctly reads from the raw API data.

COMMIT MESSAGE
--------------
Copy and paste exactly:

fix: restore Max Rent + Baseline Rent pills; fix status change wiping data

EXPO RESTART COMMAND
--------------------
Copy and paste exactly (two lines, run in order):

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile
npx expo start --tunnel

INSTALL INSTRUCTIONS
--------------------
1. Copy both files from this ZIP into your local repository,
   replacing the existing files at the same paths.
2. In GitHub Desktop, review the changes, then commit using
   the commit message above.
3. Push to MAIN.
4. Run the Expo restart command above.
