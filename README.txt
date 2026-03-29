PreferredHome — Build 3.2.18.2 Hotfix
======================================
SORT BY and ORDER converted from chips/toggle to standard dropdown selectors.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
components/FilterPanel.tsx    — SORT BY and ORDER converted to standard dropdowns

WHAT CHANGED IN THIS HOTFIX
-----------------------------

1. SORT BY — was a row of pill chips, now a standard DropdownButton + DropdownList
   with SingleSelectItem for each option, matching BROKER FEE and PREFERRED exactly.
   Options: None (clears sort), Status, Square Footage, Commute Time,
            Base Rent, Total Monthly Cost, Date Added.
   Selecting an option closes the dropdown immediately.
   Button highlights blue when any sort key other than None is selected.

2. ORDER — was a two-button Ascending/Descending toggle, now a standard
   DropdownButton + DropdownList with SingleSelectItem for Ascending and Descending.
   Selecting an option closes the dropdown immediately.
   Button highlights blue when a sort key is active (order only applies then).

3. SortKeyChip and SortOrderButton sub-components removed (no longer used).

DEPLOY STEPS
------------
Mobile repo only. No API changes. No Render deploy required.

1. Copy the file from this ZIP into your local PreferredHome-mobile folder,
   overwriting the existing file:
     components/FilterPanel.tsx

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
Build 3.2.18.2 Hotfix - SORT BY and ORDER converted to standard dropdown selectors

TEST CHECKLIST
--------------
[ ] 1. Open the Sort & Filter Listings panel.
       SORT BY shows a dropdown button labelled "None".
       ORDER shows a dropdown button labelled "Ascending".

[ ] 2. Tap SORT BY dropdown. A list opens:
       None, then (divider), Status, Square Footage, Commute Time,
       Base Rent, Total Monthly Cost, Date Added.

[ ] 3. Tap "Base Rent". Dropdown closes.
       SORT BY button now shows "Base Rent" and highlights blue.
       ORDER button also highlights blue.

[ ] 4. Tap ORDER dropdown. Ascending and Descending appear.
       Tap "Descending". Dropdown closes. ORDER button shows "Descending".

[ ] 5. Tap Apply. Listings sorted by Base Rent descending in both groups.

[ ] 6. Open panel again. Tap SORT BY → None. Tap Apply.
       Sort clears. Both dropdowns return to unhighlighted state.

NO API DEPLOY REQUIRED
-----------------------
This build is mobile-only. No Render changes. No /health check needed.
