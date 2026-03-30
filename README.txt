PreferredHome — Build 3.2.20.8
==============================
Typography & Color Token System — Edit screen font and color tokens applied.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
app/edit.tsx     — font and color token references applied

NOTE: app/(tabs)/add.tsx was confirmed clean — no legacy token names or
hardcoded font values in the screen wrapper. No changes needed there.

WHAT CHANGED IN THIS BUILD
----------------------------

1. app/edit.tsx
   - Added textStyles to import from ../styles/typography
   - ActivityIndicator color: colors.primaryBlue → colors.accent (same hex)
   - Back chevron color: colors.primaryBlue → colors.accent (same hex)
   - Subtitle bar title fontSize: 16 → textStyles.subHeader.fontSize (18)
   - Subtitle bar title fontWeight: "700" → textStyles.subHeader.fontWeight ("600")
   - All other properties unchanged (backgroundColor, borderBottomColor,
     paddingHorizontal, paddingVertical, flex, textAlign — all layout, untouched)

EXPECTED VISIBLE CHANGES
-------------------------
- "Edit Listing" subtitle text: fractionally larger and slightly lighter
  (16/700 → 18/600). Consistent with subHeader token used in FilterPanel.
- Loading spinner: accent blue (unchanged — same hex).

NO CHANGES TO:
   - app/(tabs)/add.tsx (confirmed clean)
   - Any other file
   - PreferredHome-api (no backend changes)

DEPLOY STEPS
------------
1. Copy the changed file from this ZIP into your local repo,
   overwriting the existing file at the same path:
     app/edit.tsx
2. Run Expo restart:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Confirm test checklist below on device.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.
6. Go to Claude Project -> click Sync now on the GitHub connection.

COMMIT MESSAGE
--------------
Build 3.2.20.8 - Edit screen font and color tokens applied

TEST CHECKLIST
--------------
[ ] App loads with no red screen
[ ] Edit a listing from Listings screen — Edit Listing page loads
[ ] "Edit Listing" subtitle bar visible — fractionally larger than before (expected)
[ ] Back arrow (chevron) visible and functional — returns to Listings
[ ] Form fields render correctly — same as Add screen
[ ] Save button works — listing updates and returns to Listings
[ ] No TypeScript errors in Expo terminal
