BUILD 3.2.06 — Menu System Redesign
=====================================

WHAT CHANGED
------------
Replaced the old SidePanel + MenuSheet hamburger system across all screens
with a new dropdown MenuPanel and three sub-panels: Profile, Criteria, Settings.

New behavior:
- Tap the hamburger icon → a dropdown panel appears below the header (left-aligned,
  half-screen width, same drop-in animation as the Filter panel).
- Four rows: Profile | Criteria | Settings | Help (Help is dimmed — coming soon).
- Tap a row → the dropdown closes and the selected sub-panel slides in from the left.
- Tap the overlay behind a sub-panel → everything closes.

ProfilePanel: name, email, search mode (Buy/Rent), work address, commute method,
departure time, and lifestyle toggles (Children, Pets, Car). Auto-saves on change.

CriteriaPanel: min square footage, max base rent, max total monthly, max commute
time, and a "Features — Coming soon" placeholder. Auto-saves on change.

SettingsPanel: Export and Import data buttons (both "Coming soon"), Appearance
section (Theme and Notifications — both future build), version label at bottom.

Version label in the menu footer updated to v3.2.06.

FILES CHANGED
-------------
app/(tabs)/index.tsx
app/(tabs)/listings.tsx
app/(tabs)/calendar.tsx
app/(tabs)/add.tsx
app/(tabs)/compare.tsx
app/edit.tsx
components/MenuPanel.tsx         (NEW)
components/ProfilePanel.tsx      (NEW)
components/CriteriaPanel.tsx     (NEW)
components/SettingsPanel.tsx     (NEW)
components/MenuSheet.tsx         (version label update only)
lib/profileStorage.ts            (added ProfileData and CriteriaData types + storage)

NO API CHANGES — API repo is unchanged.

DEPLOYMENT STEPS
----------------
MOBILE REPO (PreferredHome-mobile):

1. Open GitHub Desktop.
2. Confirm you are on the main branch.
3. Copy all files from this ZIP into your local repo, preserving the folder structure.
   Local path: C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile
4. In GitHub Desktop, review the changed files. They should match the list above.
5. Enter the commit message below, then click "Commit to main".
6. Click "Push origin".
7. In your terminal, run the Expo restart command below.
8. Open Expo Go on your phone and test the hamburger menu on every screen.

COMMIT MESSAGE (copy exactly):
-------------------------------
Build 3.2.06 -- Menu system redesign: hamburger opens dropdown MenuPanel with Profile/Criteria/Settings sub-panels; auto-save profile and criteria data; ProfilePanel (identity/search/commute/lifestyle), CriteriaPanel (property/costs/transportation/features placeholder), SettingsPanel (data management placeholders)

EXPO RESTART COMMAND (copy exactly):
-------------------------------------
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel

TESTING CHECKLIST
-----------------
[ ] Hamburger opens dropdown on Home screen
[ ] Hamburger opens dropdown on Listings screen
[ ] Hamburger opens dropdown on Calendar screen
[ ] Hamburger opens dropdown on Add screen
[ ] Hamburger opens dropdown on Compare screen
[ ] Hamburger opens dropdown on Edit Listing screen
[ ] Profile row opens ProfilePanel (slides from left)
[ ] Criteria row opens CriteriaPanel (slides from left)
[ ] Settings row opens SettingsPanel (slides from left)
[ ] Help row is dimmed and does not open anything
[ ] Tapping overlay closes sub-panel
[ ] Profile fields auto-save (re-open panel to confirm)
[ ] Criteria fields auto-save (re-open panel to confirm)
[ ] Edit Listing save still works and navigates to Listings
[ ] Add Listing save still works and navigates to Listings
[ ] Filters panel still works on Listings screen
