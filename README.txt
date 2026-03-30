PreferredHome — Build 3.2.20.6
==============================
Typography & Color Token System — Home screen font and color tokens applied.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/index.tsx     — font and color token references applied

WHAT CHANGED IN THIS BUILD
----------------------------

1. app/(tabs)/index.tsx
   - Added textStyles to import from ../../styles/typography
   - StatPill label fontSize: 11 → textStyles.micro.fontSize (10)
   - StatPill label letterSpacing: 0.7 kept — no token, existing style
   - StatPill value fontSize: 18 / fontWeight: "900"
     → textStyles.cardTitle.fontSize / textStyles.cardTitle.fontWeight (16/700)
     Matches card building name hierarchy as approved.
   - Stats heading color: colors.text → colors.textPrimary (legacy alias migrated)
   - Stats heading fontSize: 16 / fontWeight: "800"
     → textStyles.subHeader.fontSize / textStyles.subHeader.fontWeight (18/600)
   - Count text fontSize: 13 → textStyles.bodySmall.fontSize (12)
   - headingLabel on "TOP 3" kept — legacy alias, stays until Closeout
   - No logic, state, layout, or structural changes.

EXPECTED VISIBLE CHANGES
-------------------------
- Stat values (e.g. $3,200): slightly smaller and lighter (18/900 → 16/700)
  Intentional — matches cardTitle hierarchy, approximates future rework.
- "Base Rent Snapshot" heading: slightly larger, lighter (16/800 → 18/600)
- Count text: fractionally smaller (13 → 12)

NO CHANGES TO:
   - Any other file
   - PreferredHome-api (no backend changes)

DEPLOY STEPS
------------
1. Copy the changed file from this ZIP into your local repo,
   overwriting the existing file at the same path:
     app/(tabs)/index.tsx
2. Run Expo restart:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Confirm test checklist below on device.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.
6. Go to Claude Project -> click Sync now on the GitHub connection.

COMMIT MESSAGE
--------------
Build 3.2.20.6 - Home screen font and color tokens applied

TEST CHECKLIST
--------------
[ ] App loads with no red screen
[ ] Home tab renders normally
[ ] Base Rent Snapshot section visible — heading slightly lighter than before (expected)
[ ] Stat pills visible — values slightly smaller than before (expected)
[ ] TOP 3 section and cards render correctly
[ ] No TypeScript errors in Expo terminal
