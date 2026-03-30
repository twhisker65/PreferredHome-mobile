PreferredHome — Build 3.2.20.5
==============================
Typography & Color Token System — Listings screen font and color tokens applied.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/listings.tsx     — font and color token references applied

WHAT CHANGED IN THIS BUILD
----------------------------

1. app/(tabs)/listings.tsx
   - Added textStyles to import from ../../styles/typography
   - rightIconColor: colors.primaryBlue → colors.accent (same hex)
   - FILTERS ACTIVE banner backgroundColor: ${colors.primaryBlue}20 → ${colors.accent}20
   - FILTERS ACTIVE banner borderBottomColor: ${colors.primaryBlue}66 → ${colors.accent}66
   - FILTERS ACTIVE banner Text color: colors.primaryBlue → colors.accent
   - FILTERS ACTIVE banner fontSize:11/fontWeight:"700"/letterSpacing:0.9 kept as-is —
     no matching token; existing style predating migration, not a new ad hoc value.
   - Error text color: colors.red → colors.compareFail
   - Error text fontSize: 14 → textStyles.bodyPrimary.fontSize
   - All filter logic, sort logic, section data, state, API calls — unchanged.

NO CHANGES TO:
   - Any other file
   - PreferredHome-api (no backend changes)

DEPLOY STEPS
------------
1. Copy the changed file from this ZIP into your local repo,
   overwriting the existing file at the same path:
     app/(tabs)/listings.tsx
2. Run Expo restart:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Confirm test checklist below on device.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.
6. Go to Claude Project -> click Sync now on the GitHub connection.

COMMIT MESSAGE
--------------
Build 3.2.20.5 - Listings screen font and color tokens applied

TEST CHECKLIST
--------------
[ ] App loads with no red screen
[ ] Listings screen loads and displays cards
[ ] PREFERRED and CANDIDATES section headers visible and correct
[ ] Filter icon turns blue when filters are active — unchanged appearance
[ ] FILTERS ACTIVE banner appears when filters applied — unchanged appearance
[ ] Pull to refresh works
[ ] Tap to expand card icon row works
[ ] No TypeScript errors in Expo terminal
