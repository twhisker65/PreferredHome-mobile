PreferredHome — Build 3.2.20.14
================================
Typography & Color Token System — Compare screen font and color tokens applied.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/compare.tsx     — font and color token references applied

WHAT CHANGED IN THIS BUILD
----------------------------

1. app/(tabs)/compare.tsx
   - Added textStyles to import from ../../styles/typography
   - CC color constants updated to token hex values:
     CC.green → colors.comparePass (#22C55E)
     CC.yellow → colors.compareWarn (#F59E0B)
     CC.red → colors.compareFail (#DC2626)
   - Mode toggle icons: colors.primaryBlue → colors.accent (×2)
   - Clear button: colors.primaryBlue → colors.accent;
     fontSize 13 → textStyles.linkText.fontSize
   - Missing criteria banner: colors.primaryBlue → colors.accent (bg, border, text)
   - CompareCard wrapper: colors.card → colors.surface
   - CompareCard building name: fontSize 17/fontWeight "900" → textStyles.cardTitle
   - CompareCard address: fontSize 12 → textStyles.bodySmall.fontSize
   - CompareCard row label: fontSize 12/fontWeight "600" → textStyles.label
   - CompareCard row value (plain): fontSize 13 → textStyles.bodyPrimary.fontSize
   - CompareTable font sizes kept as-is (table density — intentional)
   - CPill/CPill text sizes kept as-is (compare-only scoring pills)
   - All getCellData logic, filterRows, row definitions, scroll sync unchanged

EXPECTED VISIBLE CHANGES
-------------------------
- Compare icon turns blue when active (same hex, renamed token)
- Pill colors on scoring fields: slightly different hex
  (comparePass #22C55E vs old #10B981, compareWarn #F59E0B vs old #D97706,
   compareFail #DC2626 vs old #EF4444) — intentional token standardisation
- CompareCard building name: slightly smaller (17/900 → 16/700 via cardTitle)
- CompareCard labels: slightly smaller (12/600 grey — matches label token)

NO CHANGES TO:
   - Any other file
   - PreferredHome-api (no backend changes)

DEPLOY STEPS
------------
1. Copy the changed file from this ZIP into your local repo,
   overwriting the existing file at the same path:
     app/(tabs)/compare.tsx
2. Run Expo restart:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Confirm test checklist below on device.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.
6. Go to Claude Project -> click Sync now on the GitHub connection.

COMMIT MESSAGE
--------------
Build 3.2.20.14 - Compare screen font and color tokens applied

TEST CHECKLIST
--------------
[ ] App loads with no red screen
[ ] Compare tab opens
[ ] Grid/List toggle icons work — active icon shows blue
[ ] Clear button visible on the right — functional
[ ] With listings selected: card view displays correctly
[ ] CompareCard building names and address lines visible
[ ] Scoring pills display with correct colors (green/yellow/red/grey)
[ ] Bool cells (✓ / —) display correctly
[ ] Missing criteria banner appears when criteria not set — tapping opens Criteria panel
[ ] Banner disappears when all criteria filled
[ ] Table view renders correctly — frozen label column, horizontal scroll
[ ] No TypeScript errors in Expo terminal
