PreferredHome — Build 3.2.20.2
==============================
Typography & Color Token System — StatusPill color tokens applied.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
components/StatusPill.tsx     — color token references applied

WHAT CHANGED IN THIS BUILD
----------------------------

1. components/StatusPill.tsx
   - Added import: colors from ../styles/colors
   - bgFor() local hex map removed entirely.
     Replaced with colors.status[safeStatus] direct reference.
     The status map lives in colors.ts only — no duplication.
   - textFor() white return value: "#FFFFFF" → colors.textPrimary (#F8FAFC)
   - "#111827" (dark text on New/white pill) kept hardcoded — intentional.
     No dark-on-light text token exists in the design system.
   - "#D1D5DB" (New pill border) kept hardcoded — pill-specific edge case.
   - Pill text fontSize (12), fontWeight ("800"), letterSpacing (-0.4) unchanged.
     Pill text is not part of the textStyles token library per spec.
   - No layout, sizing, padding, or structural changes.

NO CHANGES TO:
   - Any other component or screen file
   - styles/colors.ts
   - styles/typography.ts
   - PreferredHome-api (no backend changes)

DEPLOY STEPS
------------
Mobile repo only. No API or Render changes needed.

1. Copy the changed file from this ZIP into your local repo,
   overwriting the existing file at the same path:
     components/StatusPill.tsx
2. Run Expo restart:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Confirm test checklist below on device.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.
6. Go to Claude Project -> click Sync now on the GitHub connection.

COMMIT MESSAGE
--------------
Build 3.2.20.2 - StatusPill color tokens applied

TEST CHECKLIST
--------------
[ ] App loads with no red screen
[ ] All five tabs render normally
[ ] Status pills display correct colors on Listings screen
[ ] "New" pill — white background, grey border, dark text
[ ] "Shortlisted" pill — blue background, white text
[ ] "Rejected" pill — red background, white text
[ ] "Approved" pill — green background, white text
[ ] No TypeScript errors in Expo terminal
