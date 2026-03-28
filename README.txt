PreferredHome — Build 3.2.15.2 Hotfix
======================================
Generated: March 2026

CHANGED FILES
-------------

Mobile repo only:
  components/ProfilePanel.tsx — departure time reverted to plain TextInput

API repo: NO CHANGES.
add.tsx / edit.tsx: NO CHANGES.
compare.tsx / listings.tsx: NOT TOUCHED.

WHAT CHANGED
------------
ProfilePanel.tsx departure time field reverted to plain PanelField (TextInput),
identical to 3.2.06. The Modal added in 3.2.15 and the inline nested ScrollView
added in 3.2.15.1 both broke compare table scroll. Plain TextInput has no side
effects on sibling ScrollViews. commuteSnapshot and handleClose recalculate-all
logic from 3.2.15 are unchanged.

DEPLOY STEPS
------------
Mobile only — no API deploy, no Render deploy.

1. Copy components/ProfilePanel.tsx into PreferredHome-mobile repo (overwrite)
2. Commit in GitHub Desktop:
   Build 3.2.15.2 Hotfix - Revert ProfilePanel departure time to plain TextInput to fix compare scroll
3. Push to GitHub (MAIN)
4. Restart Expo:
   cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

TEST CHECKLIST
--------------

T1 — Compare table scrolls correctly
    Add 2+ listings to compare. Switch to table view.
    Scrolls vertically. No infinite horizontal scroll. No duplicate key error.

T2 — Profile panel loads
    Open Profile panel. All fields present. Departure Time is a text input.

T3 — Commute recalculates on profile close
    Change work address or commute method. Close panel.
    Wait ~10 seconds. Pull to refresh on Listings. Commute times updated.

T4 — Listings page loads
    Open Listings. No stack error. Listings load normally.
