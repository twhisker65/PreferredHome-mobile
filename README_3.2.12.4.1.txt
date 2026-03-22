PreferredHome — Build 3.2.12.4.1
=================================
Hotfix — three issues from 3.2.12.4 testing.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES
-------------
app/(tabs)/compare.tsx   — three fixes applied (see below)

WHAT CHANGED IN THIS BUILD
---------------------------

1. LABEL_W INCREASED FROM 120 TO 150
   "Building Amenities" was still truncating at 120px.
   At fontSize 11 with paddingHorizontal 8 each side, only 104px was
   available for text — not enough for 18 characters. Now 150px (134px
   usable). All labels display without truncation.

2. PROFILEPANEL ONCLOSE NOW RELOADS TOGGLES
   Pet Amenities and Parking were hidden even with toggles ON.
   Root cause: when ProfilePanel is opened from the Compare screen it
   overlays the tab — the Compare screen never loses focus, so
   useFocusEffect does not re-fire when the panel closes. The onClose
   callback only called setActiveSubPanel(null) and did not reload toggles.
   Fix: onClose now also calls loadProfileToggles().then(setToggles).
   Toggles update immediately when the panel closes.

3. ROWHEIGHTS CONVERTED FROM USEREF TO USESTATE
   Label column cell heights were not matching tall multi-select data rows.
   Root cause: rowHeights was a useRef. Updating a ref does not trigger a
   re-render, so the label column cells never received the correct heights
   from onLayout. Fix: rowHeights is now useState with a guarded setter
   (only updates state when the height actually changes, preventing loops).
   Label rows now re-render with the correct height after data rows lay out.

COMMIT MESSAGE
--------------

```
Build 3.2.12.4.1 -- Compare hotfix: LABEL_W 150, toggle reload on panel close, rowHeights useState
```

EXPO RESTART COMMAND
--------------------

```
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel
```

INSTALL INSTRUCTIONS
--------------------
1. Download and unzip this file.
2. Copy app/(tabs)/compare.tsx into your local repository,
   overwriting the existing file.
3. Run the Expo restart command above.
4. Test on your physical device using the checklist below.
5. Commit via GitHub Desktop using the commit message above.
6. Push to GitHub.
7. Go to Claude Project and click Sync now on the GitHub connection.

TEST CHECKLIST
--------------
[ ] 1. Table view — "Building Amenities" label not cut off.
[ ] 2. Profile toggles: turn Pets ON. Pet Amenities row appears in both
       card and table view without navigating away.
[ ] 3. Profile toggles: turn Car ON. Parking row appears in both
       card and table view without navigating away.
[ ] 4. Table view — scroll to a multi-select row (e.g. Building Amenities
       with several items). Label cell height on the left matches the
       data cell height on the right — no misalignment.
[ ] 5. All rows from 3.2.12.4 still present — Utilities Included, Unit
       Features, Rooms, Outdoor Space, Storage, Building Amenities, Close By.
[ ] 6. Clear button still present and working — no regression.
