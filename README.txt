PreferredHome — Build 3.2.18.4 Hotfix
======================================
Dropdown lists now overlay content — do not push rows down. Scrollable.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
components/FilterPanel.tsx    — overlay Modal dropdown with internal ScrollView

WHAT CHANGED IN THIS HOTFIX
-----------------------------

Dropdown lists now float above the panel content instead of pushing rows down.

Mechanism:
- Each DropdownButton is wrapped in a View with a ref.
- When tapped, measureInWindow() records the button's exact screen position.
- A transparent Modal renders over the entire screen.
- The dropdown list is positioned absolutely at {top: buttonY + buttonHeight},
  left: 16, right: 16 — anchored directly below the tapped button.
- The list is wrapped in a ScrollView with maxHeight: 240 — always scrollable
  regardless of how many items it contains.
- Tapping anywhere outside the list (the full-screen backdrop Pressable)
  closes the dropdown without applying any selection.
- Single-select items (Broker Fee, Preferred, Sort By, Order) close the
  dropdown automatically after selection.
- Multi-select items (Status, Unit Type) keep the dropdown open so multiple
  items can be selected — tap outside to close.

All types, constants, FilterState, DEFAULT_FILTERS, isFiltersActive,
filter logic helpers, and sub-components unchanged from Build 3.2.18.3.

DEPLOY STEPS
------------
Mobile repo only. No API changes. No Render deploy required.

1. Copy the file from this ZIP into your local PreferredHome-mobile folder,
   overwriting the existing file:
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
Build 3.2.18.4 Hotfix - dropdown lists overlay content via Modal, scrollable with maxHeight

TEST CHECKLIST
--------------
[ ] 1. Open Sort & Filter Listings panel.
       All rows visible at once — no list open by default.

[ ] 2. Tap STATUS dropdown.
       List floats over the rows below it. UNIT TYPE, BROKER FEE etc.
       remain visible and stationary beneath the overlay.

[ ] 3. STATUS list is scrollable — scroll through all 10 statuses.
       Select multiple. Tap outside the list to close.
       STATUS button shows correct label (e.g. "3 selected").

[ ] 4. Tap UNIT TYPE — list floats over content below. Select one.
       Tap outside to close.

[ ] 5. Tap BROKER FEE — list appears. Tap "No Fee" — list closes
       automatically. BROKER FEE button shows "No Fee".

[ ] 6. Tap PREFERRED — list appears. Tap "Yes" — closes automatically.

[ ] 7. Tap SORT BY — list appears and is scrollable. Tap a key —
       closes automatically.

[ ] 8. Tap ORDER — list appears. Tap "Descending" — closes automatically.

[ ] 9. Tap Apply. Correct filter and sort applied to listings.

[ ] 10. Tap Clear. All selections reset. Panel closes.

[ ] 11. No rows shift or reflow when any dropdown opens or closes.

NO API DEPLOY REQUIRED
-----------------------
This build is mobile-only. No Render changes. No /health check needed.
