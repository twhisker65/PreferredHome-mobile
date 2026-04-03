PreferredHome — Build 3.2.21.1 Hotfix
======================================
Add/Edit layout restoration and panel hierarchy cleanup

COMMIT MESSAGE
--------------
Build 3.2.21.1 Hotfix - Add/Edit card-style sections, scroll fix, panel hierarchy cleanup

CHANGED FILES
-------------
PreferredHome-mobile/components/ListingForm.tsx
  — Section component: card-style expandable header (surface bg, border, rounded corners,
    surfacePressed on press, body connects flush to header). KAV restructured to wrap only
    the ScrollView — sub-footer and modals moved outside KAV, eliminating sticky scroll.

PreferredHome-mobile/components/ProfilePanel.tsx
  — SectionLabel token: textStyles.label → textStyles.sectionTitle. PanelField input
    fontSize: bodySmall → bodyPrimary. Hierarchy tightening only.

PreferredHome-mobile/components/CriteriaPanel.tsx
  — SectionLabel token: textStyles.label → textStyles.sectionTitle. NumericField input
    fontSize: bodySmall → bodyPrimary. Hierarchy tightening only.

PreferredHome-mobile/components/SettingsPanel.tsx
  — DATA and APPEARANCE labels: textStyles.label → textStyles.sectionTitle.
    Content and behavior unchanged.

PreferredHome-mobile/app/(tabs)/calendar.tsx
  — minHeight: 350 added to calendar wrapper View. Appointment section stays visually
    anchored at a stable position across 5-row and 6-row months. No other changes.

API REPO
--------
Not touched. No schema changes. No storage changes. No dependency changes. No routing changes.

EXPO RESTART
------------
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

TEST CHECKLIST
--------------
[ ] No red screen on launch
[ ] All 5 tabs render
[ ] Add page: section headers are card-style pills with surface background, border, rounded corners
[ ] Add page: all sections open by default
[ ] Add page: field rows — label left, input/control right (matches Filter/Sort alignment)
[ ] Add page: scrolls smoothly without stickiness
[ ] Add page: Save Listing button fixed in sub-footer, does not scroll
[ ] Add page: Save Listing saves successfully
[ ] Edit page: same card-style sections as Add
[ ] Edit page: scrolls smoothly without stickiness
[ ] Edit page: Save Listing saves successfully
[ ] Edit page: bottom nav visible and functional
[ ] Profile panel: section group headings (PERSONAL, COMMUTE, etc.) are larger/bolder
[ ] Profile panel: field labels are grey/secondary, field values are white/primary
[ ] Profile panel: Clear and Save buttons present and functional
[ ] Criteria panel: section group headings (PROPERTY, COSTS, etc.) are larger/bolder
[ ] Criteria panel: field values are white/primary, labels are grey/secondary
[ ] Criteria panel: Clear and Save buttons present and functional
[ ] Settings panel: DATA and APPEARANCE headings are larger/bolder
[ ] Settings panel: Close button present and functional
[ ] Calendar: appointment section stays at consistent vertical position on a 6-row month (e.g. May 2026)
[ ] Calendar: calendar still visible and scrolls to correct month
[ ] Calendar: appointments scroll independently
[ ] No TypeScript errors
[ ] API repo unchanged — no deploy needed
