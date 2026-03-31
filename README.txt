PreferredHome — Build 3.2.20.15
================================
Typography & Color Token System — Calendar screen font and color tokens applied.
This is the final sub-build before Build 3.2.20 Closeout.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/calendar.tsx     — font and color token references applied

WHAT CHANGED IN THIS BUILD
----------------------------

1. app/(tabs)/calendar.tsx
   - Replaced headingLabel import with textStyles from ../../styles/typography
   - markedDates selectedColor: colors.primaryBlue → colors.accent (same hex)
   - Calendar theme todayTextColor: colors.primaryBlue → colors.accent
   - "APPOINTMENTS" label: headingLabel → textStyles.sectionTitle
   - Error text color: colors.red → colors.compareFail
   - Error text fontSize: 13 → textStyles.bodySmall.fontSize
   - Empty state fontSize: 13 → textStyles.bodySmall.fontSize
   - Appointment card backgroundColor: colors.card → colors.surface
   - Appointment card building+date line: fontWeight "900"/fontSize 14
     → textStyles.bodyEmphasis (14/600/textPrimary)
   - Appointment card address fontSize: 12 → textStyles.bodySmall.fontSize
   - Appointment card contact fontSize: 12 → textStyles.bodySmall.fontSize
   - All appointment parsing, markedDates logic, scroll, and menu unchanged

EXPECTED VISIBLE CHANGES
-------------------------
- "APPOINTMENTS" label: sectionTitle style (15/900/white uppercase)
  vs previous headingLabel (same values — no visible change)
- Appointment card first line: slightly lighter weight (900 → 600)
- Appointment dot on calendar: accent blue (same hex as before)

NO CHANGES TO:
   - Any other file
   - PreferredHome-api (no backend changes)

DEPLOY STEPS
------------
1. Copy the changed file from this ZIP into your local repo,
   overwriting the existing file at the same path:
     app/(tabs)/calendar.tsx
2. Run Expo restart:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Confirm test checklist below on device.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.
6. Go to Claude Project -> click Sync now on the GitHub connection.

COMMIT MESSAGE
--------------
Build 3.2.20.15 - Calendar screen font and color tokens applied

TEST CHECKLIST
--------------
[ ] App loads with no red screen
[ ] Calendar tab opens — month calendar visible
[ ] Today's date highlighted in blue
[ ] Listings with viewing appointments show as filled blue circles on calendar
[ ] Navigating months with arrows works
[ ] APPOINTMENTS label visible below calendar
[ ] Appointment cards display: building+date line, address, contact
[ ] "No appointments for this month" message when month is empty
[ ] Pull to refresh works
[ ] No TypeScript errors in Expo terminal
