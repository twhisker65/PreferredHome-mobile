PreferredHome — Build 3.2.08.2
==============================
Hotfix: row height alignment + total monthly calculation fix.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES
-------------
app/(tabs)/compare.tsx   — 2 fixes applied (see below)

WHAT CHANGED
-------------

1. ROW HEIGHT ALIGNMENT
   Label column cells and data row cells are in separate view hierarchies
   (required for freeze-pane behaviour). Previously label cells had a fixed
   minHeight of 40px, which misaligned with data rows that grew taller due
   to multi-select content.
   Fix: each data row now reports its rendered height via onLayout. That
   height is stored in rowHeights[] state and applied directly to the
   matching label cell. Label rows now always match their data row exactly.

2. TOTAL MONTHLY CALCULATION
   The API returns totalMonthly as a calculated field. When the API sends
   "0" (zero) for a listing, rawNum() correctly returned 0 — but
   0 ?? fallback evaluates to 0 (not the fallback), producing a wrong result.
   Fix: the API value is only used when it is a positive number (> 0).
   If the API returns 0, null, or empty, the local calculation is used:
   baseRent + all fees (parking + amenity + admin + utility + other).

COMMIT MESSAGE
--------------
Build 3.2.08.2 -- Compare hotfix: label row height sync, total monthly calc fix

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
[ ] 1. In table view, scroll to the Utilities Included, Unit Features,
       Building Amenities, and Close By rows. Label cell height on the
       left matches the data rows on the right — no misalignment.
[ ] 2. All other rows (single-line data) also align correctly.
[ ] 3. Open a listing with fees (parking, amenity, etc.).
       Total Rent in Compare shows baseRent + all fees combined.
[ ] 4. A listing with no fees shows Total Rent equal to Base Rent.
