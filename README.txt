PreferredHome — Build 3.2.20.4
==============================
Typography & Color Token System — tab bar color token applied.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/_layout.tsx     — color token reference applied

WHAT CHANGED IN THIS BUILD
----------------------------

1. app/(tabs)/_layout.tsx
   - tabBarActiveTintColor: colors.primaryBlue → colors.accent
     Same hex (#2563EB) — rename only. No visual change.
   - All other properties unchanged.
   - navLabel stays Expo-managed — no fontSize or fontWeight added.

NO CHANGES TO:
   - Any other file
   - PreferredHome-api (no backend changes)

DEPLOY STEPS
------------
1. Copy the changed file from this ZIP into your local repo,
   overwriting the existing file at the same path:
     app/(tabs)/_layout.tsx
2. Run Expo restart:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Confirm test checklist below on device.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.
6. Go to Claude Project -> click Sync now on the GitHub connection.

COMMIT MESSAGE
--------------
Build 3.2.20.4 - tab bar color token applied

TEST CHECKLIST
--------------
[ ] App loads with no red screen
[ ] All five tabs render normally
[ ] Active tab icon and label show blue — appearance unchanged
[ ] Inactive tabs show grey — appearance unchanged
[ ] No TypeScript errors in Expo terminal
