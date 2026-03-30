PreferredHome — Build 3.2.20.11
================================
Typography & Color Token System — ProfilePanel font and color tokens applied.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
components/ProfilePanel.tsx     — font and color token references applied

WHAT CHANGED IN THIS BUILD
----------------------------

1. components/ProfilePanel.tsx
   - Replaced headingLabel import with textStyles from ../styles/typography
   - Panel backgroundColor: colors.card → colors.surface
   - Panel header "PROFILE" label: headingLabel → textStyles.subHeader
   - SectionLabel: fontSize 10/800/letterSpacing 0.8 → textStyles.label properties
   - fieldLabel const: fontSize 10/700/letterSpacing 0.4 → textStyles.label
   - PanelField label: → textStyles.label
   - PanelField input background: colors.cardHover → colors.surfacePressed
   - PanelField input value fontSize: 12 → textStyles.bodySmall.fontSize
   - PanelSelectRow label: → textStyles.label
   - PanelSelectRow background: colors.cardHover → colors.surfacePressed
   - PanelSelectRow value fontSize: 12 → textStyles.bodySmall.fontSize
   - Search Mode buttons: colors.primaryBlue → colors.accent; colors.cardHover → colors.surfacePressed
   - Commute Method buttons: same pattern
   - Lifestyle toggle labels fontSize: 13 → textStyles.bodyPrimary.fontSize
   - Lifestyle toggle trackColor true: colors.primaryBlue → colors.accent
   - Departure Time Clear fontSize: 10 → textStyles.micro.fontSize
   - Picker modal backgroundColor: colors.card → colors.surface
   - Picker modal header fontSize: 14/700 → textStyles.bodyEmphasis
   - Picker items fontSize: 14 → textStyles.bodyPrimary.fontSize
   - Picker items/checkmark: colors.primaryBlue → colors.accent
   - All logic, state, commute recalculation, animation unchanged

EXPECTED VISIBLE CHANGES
-------------------------
- "Profile" panel header: subHeader style (18/600) vs previous headingLabel (15/900)
- Section labels (PERSONAL, COMMUTE, etc.): slightly larger (10→12), lighter (800→600)
- Field labels: slightly larger (10→12), lighter (700→600)

NO CHANGES TO:
   - Any other file
   - PreferredHome-api (no backend changes)

DEPLOY STEPS
------------
1. Copy the changed file from this ZIP into your local repo,
   overwriting the existing file at the same path:
     components/ProfilePanel.tsx
2. Run Expo restart:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Confirm test checklist below on device.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.
6. Go to Claude Project -> click Sync now on the GitHub connection.

COMMIT MESSAGE
--------------
Build 3.2.20.11 - ProfilePanel font and color tokens applied

TEST CHECKLIST
--------------
[ ] App loads with no red screen
[ ] Open hamburger → Profile — panel slides in from left
[ ] "Profile" header visible at top of panel
[ ] PERSONAL, SEARCH MODE, COMMUTE, LIFESTYLE section labels visible
[ ] Name and Email fields accept input
[ ] Rent / Buy search mode buttons work — selected shows blue
[ ] Work Address field accepts input
[ ] Commute Method buttons work — selected shows blue
[ ] Departure Time picker opens and selects correctly
[ ] Children / Pets / Car toggles work — turn blue when on
[ ] Panel closes correctly (tap overlay or X)
[ ] No TypeScript errors in Expo terminal
