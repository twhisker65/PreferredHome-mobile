PreferredHome — Build 3.2.20.7
==============================
Typography & Color Token System — ListingForm font and color tokens applied.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
components/ListingForm.tsx     — font and color token references applied

WHAT CHANGED IN THIS BUILD
----------------------------

1. components/ListingForm.tsx
   - Added textStyles to import from ../styles/typography
   - Section() header: [headingLabel, { fontSize: 11 }] → textStyles.sectionTitle (15/900/white)
   - Field() label: fontSize 13 / fontWeight "600" → textStyles.label (12/600/textSecondary)
   - Field() input fontSize: 14 → textStyles.bodyPrimary.fontSize
   - Toggle() label: same as Field label → textStyles.label
   - Toggle() trackColor true: colors.primaryBlue → colors.accent
   - SelectRow() label: same → textStyles.label
   - SelectRow() value fontSize: 13 → textStyles.bodyPrimary.fontSize
   - MultiRow() label: same → textStyles.label
   - MultiRow() value fontSize: 13 → textStyles.bodyPrimary.fontSize
   - DateRow() label: same → textStyles.label
   - DateRow() value fontSize: 14 → textStyles.bodyPrimary.fontSize
   - DateRow() "Set" color: colors.primaryBlue → colors.accent
   - DateRow() "Set" fontSize: 14 → textStyles.linkText.fontSize
   - School sub-labels (ELEMENTARY/MIDDLE/HIGH SCHOOL): fontSize 11 / fontWeight "700"
     → textStyles.label; letterSpacing 0.5 kept (existing style)
   - Picker items: colors.primaryBlue → colors.accent; fontSize 15 → textStyles.bodyPrimary.fontSize
   - Picker checkmark: colors.primaryBlue → colors.accent
   - Picker "Done" button: colors.primaryBlue → colors.accent; "#fff" → colors.textPrimary
   - Save button: colors.primaryBlue → colors.accent; "#fff" → colors.textPrimary
   - Save button text: fontSize 15 / fontWeight "700" → textStyles.button
   - Picker modal container: colors.card → colors.surface
   - Date picker modal container: colors.card → colors.surface
   - Calendar theme: colors.card → colors.surface; colors.primaryBlue → colors.accent
   - headingLabel kept for picker modal title (legacy alias — Closeout removes it)
   - All option arrays unchanged (DRIFT 13)
   - All logic, handlers, state, payload builder unchanged

EXPECTED VISIBLE CHANGES
-------------------------
- Section headers (PROPERTY, COSTS, etc.): larger and bolder (11pt → 15pt)
  This is the correct standardisation to sectionTitle.
- Field labels: fractionally smaller (13pt → 12pt)
- "Set" date placeholder links: accent blue (unchanged color, same hex)
- Save button: accent blue background (unchanged)
- Picker modal: slightly lighter surface background

NO CHANGES TO:
   - app/(tabs)/add.tsx
   - app/edit.tsx
   - Any other file
   - PreferredHome-api (no backend changes)

DEPLOY STEPS
------------
1. Copy the changed file from this ZIP into your local repo,
   overwriting the existing file at the same path:
     components/ListingForm.tsx
2. Run Expo restart:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Confirm test checklist below on device.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.
6. Go to Claude Project -> click Sync now on the GitHub connection.

COMMIT MESSAGE
--------------
Build 3.2.20.7 - ListingForm font and color tokens applied

TEST CHECKLIST
--------------
[ ] App loads with no red screen
[ ] Add tab opens — all sections visible
[ ] Section headers (PROPERTY, COSTS, etc.) — larger and bolder than before (expected)
[ ] Field labels — grey, slightly smaller than before (expected)
[ ] Field input values — white, right-aligned
[ ] Toggle switches work — blue when on
[ ] Select and Multi-select rows open picker correctly
[ ] Picker items display correctly — selected item shows in blue
[ ] Date picker opens and selects a date correctly
[ ] "Set" date link shows in blue
[ ] Save button — accent blue, functional
[ ] Edit tab (if accessible) — same form renders correctly
[ ] No TypeScript errors in Expo terminal
