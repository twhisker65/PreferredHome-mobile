PreferredHome — Build 3.2.09
============================
Lifestyle Toggle Wiring — Schools / Pet Amenities / Parking
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/add.tsx         — toggle loading + gated fields
app/(tabs)/compare.tsx     — toggle loading + gated rows (card + table)
app/edit.tsx               — toggle loading + gated fields
components/ViewPanel.tsx   — toggle loading + gated display sections

WHAT CHANGED IN THIS BUILD
----------------------------

1. app/(tabs)/add.tsx
   - Added useCallback to React import.
   - Added useFocusEffect to expo-router import.
   - Added import: loadProfileToggles, ProfileToggles from lib/profileStorage.
   - Added toggles state (children/pets/car, default all false).
   - Added useFocusEffect to load toggles on every screen focus.
   - SCHOOLS section: entire <Section> block wrapped in {toggles.children && ...}.
     Schools section does not appear at all when Children toggle is OFF.
   - FEATURES section: Pet Amenities <MultiRow> wrapped in {toggles.pets && ...}.
   - COSTS section: Parking Fee <Field> wrapped in {toggles.car && ...}.
   - FEATURES section: Parking Type <SelectRow> wrapped in {toggles.car && ...}.
   - ProfilePanel onClose now also reloads toggles (stays in sync if user changes toggles
     while on the Add screen without navigating away).

2. app/(tabs)/compare.tsx
   - Added import: loadProfileToggles, ProfileToggles from lib/profileStorage.
   - Added toggles state; loaded in useFocusEffect alongside criteria and compareIds.
   - TABLE_ROWS extended: added petAmenities, elemSchool, middleSchool, highSchool rows.
   - CARD_ROWS extended: added petAmenities, elemSchool, middleSchool, highSchool rows.
   - Added filterRows() helper: filters row list by car/pets/children toggles at render time.
   - getCellData() extended with cases for petAmenities, elemSchool, middleSchool, highSchool.
     School cells display: Name · Rating: N · Grades · Distance as a single plain text cell.
   - CompareTable now receives toggles prop; calls filterRows() to build visibleRows.
   - rowHeights changed from array (index-based) to Record<string, number> (key-based)
     so heights remain stable as visible rows change.
   - CompareCard now receives toggles prop; calls filterRows() to build visibleRows.
   - Result: Parking row hidden when car=false. Pet Amenities shown when pets=true.
     Three school rows shown when children=true.

3. app/edit.tsx
   - Added import: loadProfileToggles, ProfileToggles from lib/profileStorage.
   - Added toggles state (children/pets/car, default all false).
   - Added useEffect on mount to load toggles.
   - SCHOOLS section: entire <Section> block wrapped in {toggles.children && ...}.
   - FEATURES section: Pet Amenities <MultiRow> wrapped in {toggles.pets && ...}.
   - COSTS section: Parking Fee <Field> wrapped in {toggles.car && ...}.
   - FEATURES section: Parking Type <SelectRow> wrapped in {toggles.car && ...}.
   - ProfilePanel onClose now also reloads toggles.

4. components/ViewPanel.tsx
   - Added useState to React import.
   - Added import: loadProfileToggles, ProfileToggles from lib/profileStorage.
   - Added toggles state; loaded via useEffect on mount.
   - COSTS: Parking Fee <TwoCol> wrapped in {toggles.car && ...}.
   - FEATURES: Pet Amenities <CommaField> wrapped in {toggles.pets && ...}.
   - FEATURES: Parking Type display (AC Type / Laundry / Parking inline row)
     now only renders "Parking:" label and value when toggles.car is true.
   - SCHOOLS: existing {hasSchools && ...} gate extended to {hasSchools && toggles.children && ...}.

NO CHANGES to:
- app/(tabs)/index.tsx       (no gated fields on home screen)
- app/(tabs)/calendar.tsx    (no gated fields on calendar screen)
- app/(tabs)/listings.tsx    (ViewPanel loads its own toggles)
- lib/profileStorage.ts      (already correct — exports unchanged)
- components/ProfilePanel.tsx (already correct — saves toggles on change)
- API repo                   (no changes required)

DEPLOY STEPS
------------
Mobile repo only. No API or Render changes needed.

1. Open your local PreferredHome-mobile folder
2. Copy the 4 complete files from this ZIP into their matching locations
   (overwrite existing files):
     app/(tabs)/add.tsx
     app/(tabs)/compare.tsx
     app/edit.tsx
     components/ViewPanel.tsx
3. Commit in GitHub Desktop using the commit message below.
4. Push to GitHub.
5. Restart Expo using the command below.
6. Test on your physical device.

COMMIT MESSAGE
--------------
Build 3.2.09 -- Lifestyle toggle wiring: Schools/Pet Amenities/Parking gated by Children/Pets/Car toggles across Add, Edit, ViewPanel, Compare

EXPO RESTART COMMAND
--------------------
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel

TEST CHECKLIST
--------------
Profile — Children OFF, Pets OFF, Car OFF (all defaults)
[ ] 1. Open Add screen. Schools section not visible. Pet Amenities not visible. Parking Fee and Parking Type not visible.
[ ] 2. Open any listing View panel. Pet Amenities not visible. Parking Fee not visible. Parking Type label not visible. Schools section not visible.
[ ] 3. Open Edit for any listing. Same as Add.
[ ] 4. Open Compare (cards). Parking row not visible. Pet Amenities row not visible. School rows not visible.
[ ] 5. Open Compare (table). Same as cards.

Profile — Children ON, Pets ON, Car ON
[ ] 6. Open Add screen. Schools section appears. Pet Amenities row appears. Parking Fee and Parking Type appear.
[ ] 7. Open any listing View panel. Pet Amenities appears. Parking Fee appears. Parking row in Features appears. Schools section appears.
[ ] 8. Open Edit for any listing. Same as Add.
[ ] 9. Open Compare (cards). Parking, Pet Amenities, and all 3 school rows visible.
[10. Open Compare (table). Same as cards.

Toggle changes
[11. Toggle Children OFF while on Add screen — Schools section disappears immediately.
[12. Change toggles in Profile panel, close panel — Add screen reflects new state on next focus.
