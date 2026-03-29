PreferredHome — Build 3.2.18.3 Hotfix
======================================
Filter panel: horizontal row layout, bug fixes, zip code removed.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/listings.tsx       — propertyType fix, broker fee un-reversed, zip removed
components/FilterPanel.tsx    — horizontal rows, UNIT_TYPES fixed, zip removed

WHAT CHANGED IN THIS HOTFIX
-----------------------------

1. Horizontal row layout (FilterPanel.tsx)
   Every filter and sort row now shows the label on the left and the
   dropdown/input on the right — matching the Add/Edit form row style.
   Label flex 1, control flex 2. DropdownList expands full-width below the row.

2. UNIT_TYPES corrected (FilterPanel.tsx)
   Was: Rental, Condo, Co-op, Townhouse, House
   Fixed: Apartment, Condo, Co-op, Townhouse, House
   "Rental" is not a valid propertyType value — selecting it filtered out everything.

3. Unit Type field name fixed (listings.tsx)
   Filter logic was reading raw.unitType. Field was renamed to raw.propertyType
   in Build 3.2.11A. Fixed.

4. Broker Fee logic un-reversed (listings.tsx)
   "With Fee" and "No Fee" were producing the opposite result.
   Fixed: "With Fee" now correctly keeps listings where noBrokerFee is FALSE.
          "No Fee" now correctly keeps listings where noBrokerFee is TRUE.

5. Zip Code removed entirely
   FilterState.zipCodes, DEFAULT_FILTERS.zipCodes, the ZIP CODE row,
   filter logic, and the listings prop (only used for uniqueZips) all removed.

DEPLOY STEPS
------------
Mobile repo only. No API changes. No Render deploy required.

1. Copy both files from this ZIP into your local PreferredHome-mobile folder,
   overwriting the existing files:
     app/(tabs)/listings.tsx
     components/FilterPanel.tsx

2. Restart Expo:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Test on your physical phone using the checklist below.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.

EXPO RESTART COMMAND
---------------------
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

COMMIT MESSAGE
--------------
Build 3.2.18.3 Hotfix - horizontal filter rows, unit type and broker fee fixes, zip code removed

TEST CHECKLIST
--------------
[ ] 1. Open Sort & Filter Listings panel.
       All rows show label on the left, dropdown on the right.
       No vertical stacking — label and control are side by side.

[ ] 2. Zip Code row is gone.

[ ] 3. UNIT TYPE — select "Apartment". Tap Apply.
       Only Apartment listings appear. Does NOT filter out all listings.

[ ] 4. UNIT TYPE — select "House". Tap Apply.
       Only House listings appear (or empty if none exist).

[ ] 5. BROKER FEE — select "No Fee". Tap Apply.
       Only listings with noBrokerFee = TRUE appear.

[ ] 6. BROKER FEE — select "With Fee". Tap Apply.
       Only listings with noBrokerFee = FALSE appear.

[ ] 7. PREFERRED — select "Yes". Tap Apply.
       Only hearted listings appear.

[ ] 8. STATUS filter still works correctly.

[ ] 9. MAX RENT — enter a value. Tap Apply. Listings above that rent disappear.

[ ] 10. SORT BY and ORDER dropdowns still work correctly.

[ ] 11. Clear wipes all filters and sort. Listings return to default state.

NO API DEPLOY REQUIRED
-----------------------
This build is mobile-only. No Render changes. No /health check needed.
