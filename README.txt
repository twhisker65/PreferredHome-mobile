PreferredHome — Build 3.2.18.5 Hotfix
======================================
Dropdown width aligned to control column, Select All/Clear All removed,
Clear button keeps panel open.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
components/FilterPanel.tsx    — dropdown width fix, STATUS cleanup, Clear behaviour fix

WHAT CHANGED IN THIS HOTFIX
-----------------------------

1. Dropdown list width aligned to control column
   measureInWindow now captures x and width in addition to y and height.
   The overlay list is positioned at left: x, width: w — matching the
   right-hand control column exactly, not full panel width.

2. Select All / Clear All removed from STATUS list
   Default empty selection already means "all statuses shown".
   The Clear button at the bottom handles full reset. These two items
   were redundant and added visual noise.

3. Clear button keeps panel open
   Clear now resets the draft state in place — panel stays open so the
   user can see the reset state and make new selections before applying.
   Only Apply closes the panel. Back arrow closes without applying.

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
Build 3.2.18.5 Hotfix - dropdown aligned to control column, Select All removed, Clear stays open

TEST CHECKLIST
--------------
[ ] 1. Open Sort & Filter Listings panel.

[ ] 2. Tap STATUS dropdown.
       List width matches the dropdown button — not full panel width.
       No "Select All" or "Clear All" items — just the 10 statuses.
       Select a few. Tap outside to close.

[ ] 3. Tap UNIT TYPE. List width matches the button. Select one. Tap outside.

[ ] 4. Tap Clear.
       Panel stays open. All dropdowns reset to default (All / Both / None).
       No selections remain.

[ ] 5. Make new selections. Tap Apply.
       Panel closes. Filters applied to listings.

[ ] 6. Tap filter icon. Panel reopens showing the applied selections.

[ ] 7. Tap back arrow. Panel closes. Listings unchanged.

NO API DEPLOY REQUIRED
-----------------------
This build is mobile-only. No Render changes. No /health check needed.
