PreferredHome — Build 3.2.13.2 (Hotfix)
========================================
Compare: Total Rent now always calculated locally from raw fee fields.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES
-------------
app/(tabs)/compare.tsx   — totalMonthly case replaced with pure local calculation

WHAT CHANGED
------------
getCellData(), totalMonthly case:
  - Removed: hybrid logic that preferred the stored raw.totalMonthly value
    from the sheet, with local fallback only if that value was zero or blank.
  - Added: always calculates locally from individual raw fee fields:
    baseRent + parkingFee + amenityFee + adminFee + utilityFee +
    storageRent + petFee + otherFee.
  - This is identical to how ViewPanel and listing cards calculate Total Monthly.
  - Result: Total Rent on Compare now always matches every other screen.
    Stale stored values in the sheet can no longer cause a mismatch.

NO OTHER CHANGES. One case block. Nothing else touched.

DEPLOY STEPS
------------
1. Copy the file from this ZIP into your local PreferredHome-mobile repo:
     app/(tabs)/compare.tsx
2. Commit using the commit message below.
3. Push to GitHub.
4. Restart Expo using the command below.
5. Test on your physical device.
6. Sync the Claude Project.

COMMIT MESSAGE
--------------
Build 3.2.13.2 -- Compare Total Rent now always calculated locally from raw fee fields

EXPO RESTART COMMAND
--------------------
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

TEST CHECKLIST
--------------
[ ] T1. Open Compare with a listing that has fees.
        Total Rent = Base Rent + all fees. Correct.
[ ] T2. Open the same listing in ViewPanel.
        ViewPanel Total matches Compare Total Rent exactly.
[ ] T3. Open the same listing card on Listings screen.
        Fee subtotal on card matches the fees portion of Compare Total Rent.
[ ] T4. Pull to refresh on Compare. Total Rent still correct — no change.
[ ] T5. Change a fee field directly in Google Sheet.
        Pull to refresh on Compare — Total Rent reflects the new value immediately.
