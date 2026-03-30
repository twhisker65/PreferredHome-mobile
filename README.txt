PreferredHome — Build 3.2.20.10
===============================
Typography & Color Token System — MenuPanel font and color tokens applied.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
components/MenuPanel.tsx     — font and color token references applied

WHAT CHANGED IN THIS BUILD
----------------------------

1. components/MenuPanel.tsx
   - Added textStyles to import from ../styles/typography
   - Panel backgroundColor: colors.card → colors.surface
   - Row pressed backgroundColor: colors.cardHover → colors.surfacePressed
   - Row label fontSize: 14 → textStyles.bodyPrimary.fontSize
   - Row label fontWeight: "700" → textStyles.bodyEmphasis.fontWeight
   - "soon" placeholder fontSize: 10 → textStyles.micro.fontSize
   - Version label fontSize: 10 → textStyles.micro.fontSize
   - Version label updated to v3.2.20 (current build)
   - All animation, layout, row logic unchanged

NO CHANGES TO:
   - Any other file
   - PreferredHome-api (no backend changes)

DEPLOY STEPS
------------
1. Copy the changed file from this ZIP into your local repo,
   overwriting the existing file at the same path:
     components/MenuPanel.tsx
2. Run Expo restart:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Confirm test checklist below on device.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.
6. Go to Claude Project -> click Sync now on the GitHub connection.

COMMIT MESSAGE
--------------
Build 3.2.20.10 - MenuPanel font and color tokens applied

TEST CHECKLIST
--------------
[ ] App loads with no red screen
[ ] Tap hamburger menu — panel drops down correctly
[ ] Profile, Criteria, Settings rows visible and tappable
[ ] Help row visible but muted with "soon" label
[ ] Tapping a row opens the correct sub-panel
[ ] Version label reads v3.2.20 at the bottom
[ ] Tapping outside the panel closes it
[ ] No TypeScript errors in Expo terminal
