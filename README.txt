PreferredHome — Build 3.2.20.13
================================
Typography & Color Token System — ViewPanel minimal font and color token pass.
Full ViewPanel rework deferred to Build 3.2.21.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
components/ViewPanel.tsx     — minimal font and color token references applied

WHAT CHANGED IN THIS BUILD
----------------------------

1. components/ViewPanel.tsx
   - Replaced headingLabel import with textStyles from ../styles/typography
   - styles.panel backgroundColor: colors.card → colors.surface
   - styles.headerTitle: fontSize 15/fontWeight "700" → textStyles.subHeader
   - SectionHead: [headingLabel, {fontSize:10, marginBottom:4}]
     → [textStyles.label, {marginBottom:4}]
   - ScoreBadge: colors.green → colors.comparePass; colors.red → colors.compareFail
   - SchoolRow rating circle backgroundColor: colors.card → colors.surface
   - SchoolRow rating text color: colors.primaryBlue → colors.accent
   - Close button (‹) color: colors.primaryBlue → colors.accent
   - Full address tappable link: colors.primaryBlue → colors.accent
   - Preferred heart color: colors.primaryBlue → colors.accent
   - BoolBadge checkmark color: colors.primaryBlue → colors.accent
   - Total row values color: colors.primaryBlue → colors.accent
   - Total row fontSize: 13 → textStyles.bodyPrimary.fontSize (14)
   - URL/phone/email tappable links: colors.primaryBlue → colors.accent
   - styles.label / styles.value: already correct token names — unchanged
   - All data logic, layout, sections, toggle gating unchanged

EXPECTED VISIBLE CHANGES
-------------------------
- Building name in header: slightly larger (15/700 → 18/600) per subHeader token
- Section dividers (Costs, Features, etc.): label style (12/600/grey) vs previous 10/900
- Total amounts: slightly larger (13→14pt)

NO CHANGES TO:
   - Any other file
   - PreferredHome-api (no backend changes)

DEPLOY STEPS
------------
1. Copy the changed file from this ZIP into your local repo,
   overwriting the existing file at the same path:
     components/ViewPanel.tsx
2. Run Expo restart:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Confirm test checklist below on device.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.
6. Go to Claude Project -> click Sync now on the GitHub connection.

COMMIT MESSAGE
--------------
Build 3.2.20.13 - ViewPanel font and color tokens applied (minimal pass)

TEST CHECKLIST
--------------
[ ] App loads with no red screen
[ ] Tap View (eye icon) on a listing card — ViewPanel slides in from right
[ ] Building name displays in header
[ ] Back arrow (‹) visible and closes panel
[ ] All sections display: Costs, Features, Neighborhood, Listing, Timeline
[ ] Tappable links (address, phone, email, URL) show in blue
[ ] Total Monthly and Total Upfront amounts show in blue
[ ] Bool badges (Furnished, Top Floor, etc.) show checkmarks in blue when true
[ ] Score badges display for listings with walk/transit/bike scores
[ ] Panel slides out correctly on close
[ ] No TypeScript errors in Expo terminal
