PreferredHome — Build 3.2.18
============================
Sort functionality added to Filter panel. Full-page panel with back arrow header.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/listings.tsx       — applySort() added; sections useMemo applies sort after filter
components/FilterPanel.tsx    — full-page layout; FILTER label; SORT section added

WHAT CHANGED IN THIS BUILD
----------------------------

1. components/FilterPanel.tsx
   - Panel is now full-page (fills screen from TopBar to bottom edge).
     Previously was a half-width slide-out from the right.
   - Header bar added: back arrow (chevron-back) on the left, "Sort & Filter Listings"
     centered. Style matches the Edit Listing subtitle bar exactly.
   - "FILTER" section label added above the existing filter controls.
   - "SORT" section added below filters, separated by a divider line:
       - SORT BY: 6 pill chips — Status, Square Footage, Commute Time,
         Base Rent, Total Monthly Cost, Date Added. Tap to select; tap again to deselect.
         Only one key active at a time.
       - ORDER: Ascending / Descending two-button toggle.
   - Clear + Apply buttons moved to a fixed bottom bar (always visible, does not scroll).
   - Back arrow closes the panel without applying any changes (draft discarded).
   - FilterState type extended: sortKey (string) and sortOrder ("asc" | "desc").
   - DEFAULT_FILTERS extended: sortKey: "", sortOrder: "asc".
   - isFiltersActive() updated: returns true when sortKey is set (lights up filter icon).
   - tap-outside overlay removed (full-page panel — back arrow is the only close path).
   - All existing filter sub-components and option arrays unchanged (DRIFT 13 compliant).
   - SortKeyChip and SortOrderButton defined outside the export function (DRIFT 10 compliant).

2. app/(tabs)/listings.tsx
   - applySort() function added after applyFilters(). Sorts by the selected sortKey
     in the selected direction. Nulls/NaN always sort last regardless of direction.
     Sort keys map: Status → l.status (string); Square Footage → raw.squareFootage;
     Commute Time → raw.commuteTime; Base Rent → l.baseRent;
     Total Monthly Cost → raw.totalMonthly; Date Added → l.id (insertion order).
   - sections useMemo updated: applySort() wraps applyFilters() for both Preferred
     and Candidates groups. Sort and filter applied independently per group.

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
Build 3.2.18 - Sort functionality added to Filter panel, full-page layout with back arrow header

TEST CHECKLIST
--------------
[ ] 1. Tap the filter icon on the Listings screen.
       Panel opens full-screen between the top bar and the bottom nav.
       Back arrow and "Sort & Filter Listings" heading appear at the top.

[ ] 2. All existing filter controls are present and work:
       STATUS, UNIT TYPE, BROKER FEE, PREFERRED, MAX RENT, ZIP CODE all visible.
       A "FILTER" heading appears above them.

[ ] 3. Below the filter controls a divider line appears, then a "SORT" heading.
       Six chips appear under "SORT BY":
       Status, Square Footage, Commute Time, Base Rent, Total Monthly Cost, Date Added.
       "Ascending" and "Descending" buttons appear under "ORDER".

[ ] 4. Tap "Base Rent" chip — it highlights blue. Tap Apply.
       Both Preferred and Candidates groups are sorted lowest rent first (ascending).

[ ] 5. Open filter panel again. Tap "Descending". Tap Apply.
       Both groups are sorted highest rent first.

[ ] 6. Open filter panel. Tap "Base Rent" chip again (deselects it). Tap Apply.
       Listings return to default order.

[ ] 7. Open filter panel. Select a sort key AND a Status filter. Tap Apply.
       Filtered listings appear in the correct sorted order within each group.

[ ] 8. Open filter panel. Tap Clear.
       Panel closes. Listings return to default unfiltered, unsorted state.
       Filter icon returns to un-highlighted state.

[ ] 9. Tap the back arrow. Panel closes. No filter or sort was applied
       (listings unchanged from before the panel was opened).

[ ] 10. Filter icon in the top bar is highlighted when a sort is active
        (same highlight as when a filter is active).

NO API DEPLOY REQUIRED
-----------------------
This build is mobile-only. No Render changes. No /health check needed.
