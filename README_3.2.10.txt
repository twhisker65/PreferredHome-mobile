PreferredHome — Build 3.2.10
==============================

CHANGED FILES
-------------
components/ViewPanel.tsx

CHANGES
-------
1. components/ViewPanel.tsx
   - Added Linking to React Native imports.
   - Address: tapping opens Maps (Google Maps URL).
   - URL: tapping opens browser. Address and URL values display in blue when tappable.
   - Phone: tapping opens dialer. Value displays in blue when tappable.
   - Email: tapping opens mail app. Value displays in blue when tappable.
   - All tappable fields show "—" (non-tappable) when no value is present.
   - No other layout, fields, or logic changed.

NO CHANGES TO:
- API repo (no changes required)
- All other mobile repo files

DEPLOY STEPS
------------
1. Copy the file from this ZIP into the matching location in your repository
   (overwrite existing file):
     components/ViewPanel.tsx
2. Commit in GitHub Desktop using the commit message below.
3. Push to GitHub.
4. Restart Expo using the command below.
5. Test on your physical device.

COMMIT MESSAGE
--------------
Build 3.2.10 -- Tap-to-contact links: phone opens dialer, email opens mail app, address opens Maps, URL opens browser

EXPO RESTART COMMAND
--------------------
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

TEST CHECKLIST
--------------
[ ] 1. Open any listing ViewPanel. Phone field — value appears in blue. Tapping opens the dialer with the number pre-filled.
[ ] 2. Email field — value appears in blue. Tapping opens the mail app with the address pre-filled.
[ ] 3. Address line — appears in blue. Tapping opens Maps with the address.
[ ] 4. URL field — appears in blue. Tapping opens the browser at the listing URL.
[ ] 5. A listing with no phone number — Phone field shows "—" and is not tappable.
[ ] 6. A listing with no email — Email field shows "—" and is not tappable.
[ ] 7. A listing with no address — address line shows "—" as plain text (not blue, not tappable).
[ ] 8. All other ViewPanel sections (Costs, Features, Transportation, Schools, Timeline, Notes) display correctly and are unchanged.
