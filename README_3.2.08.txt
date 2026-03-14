PreferredHome — Build 3.2.08
============================
Compare page — full implementation.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/compare.tsx   — full Compare page implementation (card + table views)
app/(tabs)/listings.tsx  — compareStorage wired in; max compare changed from 4 to 3
lib/compareStorage.ts    — NEW: persists selected compare IDs in AsyncStorage

WHAT CHANGED IN THIS BUILD
----------------------------

1. lib/compareStorage.ts — NEW FILE
   - AsyncStorage wrapper for the selected compare listing IDs.
   - loadCompareIds(): returns the persisted array (max 3) on startup.
   - saveCompareIds(): writes the current selection back to storage.
   - Key: preferredhome.compare.v1
   - Max 3 IDs enforced at both save and load.

2. app/(tabs)/listings.tsx
   - Imports loadCompareIds and saveCompareIds from lib/compareStorage.
   - useFocusEffect now loads compareIds from storage on every focus
     (so the compare icons stay in sync after navigating away and back).
   - toggleCompare: max changed from 4 to 3. Tapping a 4th listing is
     silently ignored. Each successful toggle saves to AsyncStorage.

3. app/(tabs)/compare.tsx — FULL IMPLEMENTATION
   Selected listing IDs loaded from compareStorage on focus.
   Criteria values loaded from AsyncStorage on focus.

   MISSING CRITERIA BANNER
   - Appears at the top when any of the 4 criteria values are blank
     AND at least one listing is selected for compare.
   - Lists which criteria are missing by name.
   - Tapping the banner opens the Criteria sub-panel.
   - Dismisses automatically once all criteria are set.

   CARD VIEW (grid icon — default)
   - One card per selected listing, styled like listing cards.
   - Building name and address in card header.
   - 15 fields displayed in alternating rows (label left, value right).
   - Color-coded pills: Base Rent, Total Rent, Square Footage,
     AC Type, Laundry, Parking, Commute Time.
   - Checkmark (✓) or dash (—) for boolean fields.
   - Plain text for Unit Type, Bedrooms, Bathrooms.

   TABLE VIEW (list icon)
   - Horizontally scrollable (all columns visible on scroll).
   - Vertically scrollable via outer ScrollView.
   - Building name row at top with double horizontal line beneath it.
   - Label column on left with double vertical line to its right.
   - 19 fields including all multi-select fields (Utilities Included,
     Unit Features, Building Amenities, Close By).
   - Alternating row shading for readability.

   COLOR RULES (both views)
   - Base Rent: green ≤ Max Base Rent, red > Max Base Rent
   - Total Rent: green ≤ Max Total Monthly, red > Max Total Monthly
   - Square Footage: green ≥ Min Square Footage, red < Min Square Footage
   - Commute Time: green ≤ Max Commute Time, red > Max Commute Time
   - AC Type: Central = green, None = red, all others = yellow
   - Laundry: In-Unit = green, None = red, all others = yellow
   - Parking: Covered = green, None = red, all others = yellow
   - Any criteria field not set: pill shown in grey

COMMIT MESSAGE
--------------
Build 3.2.08 -- Compare page: card + table views, persistent selection, criteria color-coding, missing criteria banner

EXPO RESTART COMMAND
--------------------
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel

INSTALL INSTRUCTIONS
--------------------
1. Download and unzip this file.
2. Copy all three files into your local repository,
   overwriting the existing files at the same paths:
     app/(tabs)/compare.tsx
     app/(tabs)/listings.tsx
     lib/compareStorage.ts  (NEW — place in the lib/ folder)
3. Run the Expo restart command above in your terminal.
4. Test on your physical device (see TEST CHECKLIST below).
5. Commit via GitHub Desktop using the commit message above.
6. Push to GitHub.
7. Go to Claude Project → click Sync now on the GitHub connection.

TEST CHECKLIST
--------------
[ ] 1. Go to Listings. Tap the compare icon on 1 listing — icon turns blue.
[ ] 2. Tap compare on a 2nd and 3rd listing — all three turn blue.
[ ] 3. Attempt to tap a 4th listing — nothing happens (max 3 enforced).
[ ] 4. Navigate to the Compare tab — all 3 selected listings appear.
[ ] 5. Switch between card view and table view using the icons at the top.
[ ] 6. In table view — confirm building names appear as the header row with
       double lines beneath. Confirm label column has double lines on its right.
[ ] 7. In table view — scroll horizontally and vertically to confirm both work.
[ ] 8. Confirm color-coded pills appear (green/red/yellow/grey) on rent,
       square footage, AC Type, Laundry, Parking, and Commute Time fields.
[ ] 9. Open Criteria (hamburger > Criteria) — leave some fields blank.
       Return to Compare — confirm the banner appears naming the blank fields.
[ ] 10. Tap the banner — confirm Criteria panel opens.
[ ] 11. Fill in all criteria — banner disappears.
[ ] 12. Navigate away from Compare and back — selection persists.
[ ] 13. Navigate away from Listings and back — blue compare icons still show.
