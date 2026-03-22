PreferredHome — Build 3.2.12.4
==============================
Compare screen — Clear button, 7 missing CARD_ROWS, label truncation fix.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES
-------------
app/(tabs)/compare.tsx   — three surgical fixes (see below)

WHAT CHANGED IN THIS BUILD
---------------------------

1. CLEAR BUTTON RESTORED
   A "Clear" button now appears on the right side of the mode-toggle row.
   The grid/list icons remain centered — unaffected.
   Tapping Clear calls saveCompareIds([]) and clears the in-memory Set,
   deselecting all listings and returning to the empty state immediately.

2. 7 ROWS ADDED TO CARD_ROWS
   The following rows were already present in TABLE_ROWS but missing from
   CARD_ROWS. They are now added in TABLE_ROWS order, between Parking and
   Pet Amenities (with Close By after Pet Amenities):
     - Utilities Included  (key: utilitiesIncluded)
     - Unit Features       (key: unitFeatures)
     - Rooms               (key: roomTypes)
     - Outdoor Space       (key: privateOutdoorSpaceTypes)
     - Storage             (key: storageTypes)
     - Building Amenities  (key: buildingAmenities)
     - Close By            (key: closeBy)
   CARD_ROWS count: 28 → 35. Matches TABLE_ROWS count exactly.

3. LABEL_W INCREASED FROM 100 TO 120
   The table view label column was 100px wide. Long labels such as
   "Building Amenities" were truncating.
   LABEL_W is now 120px. All labels display without truncation.
   Both usages of LABEL_W (column width + label cell width) updated together.

COMMIT MESSAGE
--------------

```
Build 3.2.12.4 -- Compare: Clear button restored, 7 CARD_ROWS added, LABEL_W 120
```

EXPO RESTART COMMAND
--------------------

```
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel
```

INSTALL INSTRUCTIONS
--------------------
1. Download and unzip this file.
2. Copy the changed file into your local repository,
   overwriting the existing file at the same path:
     app/(tabs)/compare.tsx
3. Run the Expo restart command above.
4. Test on your physical device using the checklist below.
5. Commit via GitHub Desktop using the commit message above.
6. Push to GitHub.
7. Go to Claude Project and click Sync now on the GitHub connection.

TEST CHECKLIST
--------------
[ ] 1. Open Compare screen — Clear button visible on the right of the header row.
[ ] 2. Tap Clear — all listings deselected, empty state shown.
[ ] 3. Re-add listings. Open Card view — each card shows:
       Utilities Included, Unit Features, Rooms, Outdoor Space,
       Storage, Building Amenities, Close By.
[ ] 4. Switch to Table view — label column text is not cut off on any row,
       including "Building Amenities".
[ ] 5. Mode toggle (card/table icons) still works — no regression.
[ ] 6. Pet Amenities row hidden unless Pets toggle is on — no regression.
