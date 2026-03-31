PreferredHome — Build 3.2.20 Closeout
======================================
Typography & Color Token System — legacy aliases removed. Migration complete.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
components/MenuSheet.tsx        — dead file cleanup (TypeScript safety)
components/SettingsPanel.tsx    — final legacy token migration (missed from sub-builds)
styles/colors.ts                — legacy alias block removed
styles/typography.ts            — legacy exports removed (headingLabel, typography)

WHAT CHANGED IN THIS BUILD
----------------------------

1. styles/colors.ts
   REMOVED the entire legacy alias block:
     card, cardHover, primaryBlue, text, primary, green, yellow, purple, red
   All 15 sub-builds (3.2.20.1–3.2.20.15) confirmed clean before removal.
   Only the new named tokens remain.

2. styles/typography.ts
   REMOVED the legacy export block:
     headingLabel
     typography (h1, h2, body, muted)
   All components confirmed migrated to textStyles before removal.

3. components/SettingsPanel.tsx
   This component was not on the sub-build list and was migrated here at Closeout.
   Changes:
   - colors.card → colors.surface (panel background)
   - colors.cardHover → colors.surfacePressed (ActionButton pressed bg)
   - [headingLabel, { fontSize:10 }] → textStyles.label (DATA + APPEARANCE labels)
   - Header title: fontSize 15/fontWeight "900" → textStyles.subHeader
   - ActionButton label: fontSize 13/fontWeight "700" → textStyles.button
   - FutureRow label: → textStyles.button
   - FutureRow "Future build": fontSize 11 → textStyles.micro.fontSize + italic
   - Version label: fontSize 10 → textStyles.micro.fontSize; updated to v3.2.20

4. components/MenuSheet.tsx
   Dead component (replaced by MenuPanel in Build 3.2.06, never rendered).
   Legacy references updated to prevent TypeScript errors after alias removal:
   - typography.h2/body → textStyles.subHeader/button
   - colors.card/cardHover → colors.surface/surfacePressed
   - Version label updated to v3.2.20

THE TOKEN SYSTEM IS NOW LOCKED
--------------------------------
styles/colors.ts and styles/typography.ts contain only the final named tokens.
No legacy aliases or legacy exports remain anywhere in the codebase.
UI freeze is now in effect — no changes to any component until V4.

DEPLOY STEPS
------------
1. Copy all 4 changed files from this ZIP into your local repo,
   overwriting the existing files at the same paths:
     styles/colors.ts
     styles/typography.ts
     components/SettingsPanel.tsx
     components/MenuSheet.tsx
2. Run Expo restart:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Confirm test checklist below on device.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.
6. Go to Claude Project -> click Sync now on the GitHub connection.
7. Confirm stability, then request closing docs.

COMMIT MESSAGE
--------------
Build 3.2.20 Closeout - Typography and Color Token System complete

TEST CHECKLIST
--------------
[ ] App loads with no red screen
[ ] All 5 tabs render: Home, Listings, Add, Compare, Calendar
[ ] Listings — cards display, filter works, FILTERS ACTIVE banner works
[ ] Add — all form sections open, pickers work, Save works
[ ] Compare — card and table views render, scoring pills correct
[ ] Calendar — calendar and appointments render
[ ] Open hamburger → Profile, Criteria, Settings — all 3 panels open correctly
[ ] Settings panel header reads "Settings" — slightly different style (expected)
[ ] No TypeScript errors in Expo terminal
