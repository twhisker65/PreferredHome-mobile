PreferredHome — Build 3.2.20.3
==============================
Typography & Color Token System — ListingCard font and color tokens applied.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
components/ListingCard.tsx     — font and color token references applied

WHAT CHANGED IN THIS BUILD
----------------------------

1. components/ListingCard.tsx
   - Added import: textStyles from ../styles/typography
   - preferredColor: colors.primaryBlue → colors.accent (same hex)
   - compareColor:   colors.primaryBlue → colors.accent (same hex)
   - Card wrapper backgroundColor: colors.card → colors.surface
   - Photo placeholder backgroundColor: colors.cardHover → colors.surfacePressed
     (state token used correctly — photo placeholder is a contained visual area,
      not a layout background)
   - Building name: fontSize 17 / fontWeight "900" / textPrimary
     → textStyles.cardTitle (fontSize 16 / fontWeight "700" / textPrimary)
   - Address line: fontSize 12 / textSecondary
     → textStyles.bodySmall (fontSize 12 / fontWeight "400" / textSecondary)
   - Unit summary: fontSize 12 / textSecondary
     → textStyles.bodySmall (same as address)
   - Rent + fees: fontSize 15 / fontWeight "900" / textPrimary
     → textStyles.cardSecondary (fontSize 14 / fontWeight "500" / textSecondary)
   - marginTop: 3 on address and unit summary — unchanged (layout, not touched)
   - All borderRadius, borderWidth, padding, gap, flex — unchanged

EXPECTED VISIBLE CHANGES
-------------------------
- Building name: very slightly smaller (17→16) and lighter weight (900→700)
- Rent/fees line: now grey instead of white, lighter weight (900→500)
  This is correct per the approved cardSecondary token spec.
- Card background: slightly lighter navy (surface #1B2A4A vs old card #111827)
  The card lift against the screen background (#112240) is now more visible.

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
     components/ListingCard.tsx
2. Run Expo restart:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Confirm test checklist below on device.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.
6. Go to Claude Project -> click Sync now on the GitHub connection.

COMMIT MESSAGE
--------------
Build 3.2.20.3 - ListingCard font and color tokens applied

TEST CHECKLIST
--------------
[ ] App loads with no red screen
[ ] All five tabs render normally
[ ] Cards visible on Listings screen and Home screen (TOP 3)
[ ] Building name readable — white, slightly less bold than before (expected)
[ ] Address and unit summary — grey (unchanged)
[ ] Rent/fees line — now grey, lighter weight (expected change per cardSecondary token)
[ ] Card background has visible navy lift against screen background
[ ] Heart icon blue when listing is Preferred, grey when not
[ ] Compare icon blue when selected, grey when not
[ ] No TypeScript errors in Expo terminal
