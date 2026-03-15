PreferredHome — Build 3.2.08.1
==============================
Hotfix: 6 issues fixed from initial 3.2.08 testing.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES
-------------
app/(tabs)/compare.tsx   — 6 fixes applied (see below)

WHAT CHANGED
-------------

1. CRITERIA REFRESH FIX
   CriteriaPanel onClose now reloads criteria immediately into state.
   Previously criteria only reloaded on tab focus, so filling out criteria
   and closing the panel left the screen showing stale grey pills until
   the user navigated away and back.

2. TOP-LEFT CORNER HEADER
   The top-left cell of the table now reads "Criteria" in the same font
   as building names: white (textPrimary), fontSize 13, fontWeight 900.

3. LABEL AND DATA COLORS SWAPPED
   Label column text: white (textPrimary).
   Plain data cell text: grey (textSecondary).
   Colored pills and booleans are unchanged.

4. FROZEN PANES
   The label column is now fixed — it does not scroll horizontally.
   The building name row is now fixed — it does not scroll vertically.
   Horizontal scrolling in the data section drives the header via useRef
   so building names stay aligned with their columns at all times.
   The outer ScrollView wrapping the table has been removed. CompareTable
   manages its own vertical and horizontal scroll internally.

5. MULTI-SELECT ONE ITEM PER LINE
   Utilities Included, Unit Features, Building Amenities, and Close By
   now render each item on its own line (line-break separated).
   Previously items were shown as a comma-separated string on one line.

6. COLUMN WIDTHS REDUCED TO 75%
   LABEL_W: 134 → 100
   COL_W:   158 → 118

COMMIT MESSAGE
--------------
Build 3.2.08.1 -- Compare hotfix: criteria refresh, frozen panes, label colors, multi-select line breaks, column widths

EXPO RESTART (with cache clear)
--------------------------------
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

INSTALL INSTRUCTIONS
--------------------
1. Download and unzip this file.
2. Copy the one file into your local repository,
   overwriting the existing file at the same path:
     app/(tabs)/compare.tsx
3. Run the Expo restart command above.
4. Test on your physical device (see TEST CHECKLIST below).
5. Commit via GitHub Desktop using the commit message above.
6. Push to GitHub.
7. Go to Claude Project → click Sync now on the GitHub connection.

TEST CHECKLIST
--------------
[ ] 1. Open Compare tab with listings selected. If criteria are missing,
       the banner appears. Tap it — Criteria panel opens.
[ ] 2. Fill in all 4 criteria fields. Close the panel.
       Banner disappears immediately (no tab switch needed).
       Pill colors update immediately.
[ ] 3. In table view, the top-left corner reads "Criteria" in bold white.
[ ] 4. Label column text is white. Plain data cell text is grey.
[ ] 5. Scroll horizontally — label column stays fixed on the left.
       Building names in the header stay aligned with their data columns.
[ ] 6. Scroll vertically — building name row stays fixed at the top.
[ ] 7. Utilities Included, Unit Features, Building Amenities, Close By
       each show one item per line (not comma-separated on one line).
[ ] 8. Table columns are narrower than in 3.2.08.
