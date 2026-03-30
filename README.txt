PreferredHome — Build 3.2.20.9
==============================
Typography & Color Token System — FilterPanel font and color tokens applied.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
components/FilterPanel.tsx     — font and color token references applied

WHAT CHANGED IN THIS BUILD
----------------------------

1. components/FilterPanel.tsx
   - Added textStyles to import from ../styles/typography; removed headingLabel import
   - Panel wrapper backgroundColor: colors.card → colors.surface
   - Header bar backgroundColor: colors.card → colors.surface
   - Header back chevron color: colors.primaryBlue → colors.accent
   - Header title fontSize: 16 / fontWeight "700" → textStyles.subHeader
   - FILTER / SORT section labels: [headingLabel, {marginBottom:2}]
     → [textStyles.sectionTitle, {marginBottom:2}]
   - FilterRow label: [headingLabel, {fontSize:11, flex:1}] → [textStyles.label, {flex:1}]
   - DropdownButton: colors.primaryBlue → colors.accent (border, bg alpha, text, chevron)
   - DropdownButton inactive bg: colors.cardHover → colors.surfacePressed
   - MaxRent TextInput active state: colors.primaryBlue → colors.accent
   - MaxRent TextInput inactive bg: colors.cardHover → colors.surfacePressed
   - MultiSelectItem selected color + checkmark: colors.primaryBlue → colors.accent
   - MultiSelectItem pressed bg: colors.cardHover → colors.surfacePressed
   - SingleSelectItem selected color + checkmark: colors.primaryBlue → colors.accent
   - SingleSelectItem pressed bg: colors.cardHover → colors.surfacePressed
   - Bottom bar backgroundColor: colors.card → colors.surface
   - Clear button bg: colors.cardHover → colors.surfacePressed
   - Clear button text: fontWeight "700" / fontSize 13 → textStyles.button
   - Apply button bg: colors.primaryBlue → colors.accent
   - Apply button text: "#fff" → colors.textPrimary; fontWeight "700" / fontSize 13
     → textStyles.button
   - All filter/sort logic, state, animation, modal positioning unchanged

NO CHANGES TO:
   - Any other file
   - PreferredHome-api (no backend changes)

DEPLOY STEPS
------------
1. Copy the changed file from this ZIP into your local repo,
   overwriting the existing file at the same path:
     components/FilterPanel.tsx
2. Run Expo restart:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Confirm test checklist below on device.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.
6. Go to Claude Project -> click Sync now on the GitHub connection.

COMMIT MESSAGE
--------------
Build 3.2.20.9 - FilterPanel font and color tokens applied

TEST CHECKLIST
--------------
[ ] App loads with no red screen
[ ] Open Filter panel from Listings — panel slides up correctly
[ ] "Sort & Filter Listings" header visible — slightly larger than before (expected)
[ ] FILTER and SORT section labels visible — uppercase white (expected)
[ ] FilterRow labels (STATUS, UNIT TYPE, etc.) — grey, correct size
[ ] Dropdown buttons open and close correctly
[ ] Selected dropdown values show in blue
[ ] Checkmarks appear on selected items
[ ] Max Rent input field works — turns blue when active
[ ] Clear button resets filters — panel stays open
[ ] Apply button closes panel and applies filters
[ ] FILTERS ACTIVE banner appears on Listings when filters are applied
[ ] Back arrow closes without applying
[ ] No TypeScript errors in Expo terminal
