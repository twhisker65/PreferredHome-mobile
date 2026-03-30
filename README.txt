PreferredHome — Build 3.2.20
============================
Typography & Color Token System — system lock.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
styles/colors.ts     — new color tokens; legacy aliases preserved
styles/typography.ts — new textStyles token object; legacy exports preserved

WHAT CHANGED IN THIS BUILD
----------------------------

1. styles/colors.ts
   NEW TOKENS (replacing hardcoded hex values across the app in subsequent sub-builds):
     background:     #112240   (was #0B1220 — true navy, replaces near-black)
     surface:        #1B2A4A   (was card #111827 — visible card lift)
     surfacePressed: #162A45   (state token only — pressed/active containers)
     border:         #223A70   (was #1F2937 — navy-blue dividers)
     accent:         #2563EB   (was primaryBlue — same hex, rename only)
     comparePass:    #22C55E   (compare logic only)
     compareWarn:    #F59E0B   (compare logic only)
     compareFail:    #DC2626   (compare logic only)
   REMOVED:
     accentBlue #3B82F6 — confirmed dead token, never used in RN app
   LEGACY ALIASES KEPT (until 3.2.20 Closeout):
     card, cardHover, primaryBlue, text, primary, green, yellow, purple, red
     These point to the new hex values so no component breaks before migration.

2. styles/typography.ts
   NEW EXPORT: textStyles object with 14 named tokens:
     mainTitleBlue, mainTitleWhite, subHeader, sectionTitle,
     cardTitle, cardSecondary, bodyPrimary, bodyEmphasis,
     label, bodySmall, linkText, button, navLabel, micro
   LEGACY EXPORTS KEPT (until 3.2.20 Closeout):
     headingLabel — unchanged
     typography (h1, h2, body, muted) — unchanged
   No existing import in any component file breaks.

WHAT THOMAS WILL SEE
---------------------
Nothing visible changes on device in this build.
The token files are the foundation. Each subsequent sub-build
(3.2.20.1 through 3.2.20.15) consumes these tokens one component at a time.

NO CHANGES TO:
   - Any component file
   - Any screen file
   - Any lib/ file
   - PreferredHome-api (no backend changes)

DEPLOY STEPS
------------
Mobile repo only. No API or Render changes needed.

1. Copy the 2 changed files from this ZIP into your local repo,
   overwriting the existing files at the same paths:
     styles/colors.ts
     styles/typography.ts
2. Run Expo restart:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Confirm no red screen and all five tabs render.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.
6. Go to Claude Project → click Sync now on the GitHub connection.

COMMIT MESSAGE
--------------
Build 3.2.20 - typography and color token system locked

TEST CHECKLIST
--------------
[ ] App loads with no red screen after replacing both files
[ ] All five tabs render normally (Home, Listings, Add, Compare, Calendar)
[ ] Listings screen shows cards — confirms colors import still works
[ ] No TypeScript errors in Expo terminal output
[ ] No visible change on device — this build locks tokens only
