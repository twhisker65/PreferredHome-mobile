PreferredHome — Build 3.2.21
============================
UI Polish / Layout Restoration

COMMIT MESSAGE
--------------
Build 3.2.21 - restore approved Add/Edit layout, standardize panel structure, and fix Edit bottom nav

CHANGED FILES
-------------
PreferredHome-mobile/components/ListingForm.tsx
  — Save button moved from ScrollView to fixed sub-footer. shortTermAvailable and
    rentersInsuranceRequired moved from PROPERTY to LISTING section. Label "Building Name"
    → "Property Name" (display only). Label "Renters Insurance Required" → "No Renters
    Insurance Required" (display only). Removed broken headingLabel import (legacy alias
    removed in 3.2.20 Closeout) — replaced with textStyles.bodyEmphasis.

PreferredHome-mobile/app/edit.tsx
  — Custom bottom nav (EditBottomNav) added — 5 tabs, token colors, router.push() on tap.
    Defined outside main export (DRIFT 10). Local to this file only. No route restructuring.

PreferredHome-mobile/app/(tabs)/add.tsx
  — Build comment updated only. Sub-footer is now inside ListingForm.

PreferredHome-mobile/components/ViewPanel.tsx
  — Full-width layout (PANEL_LEFT removed). Sub-header: building name centered, back arrow
    left, blue heart right if Preferred. Backdrop pressable removed. ScoreBadge: circle →
    rounded square with neutral colors. CommaField: inline (label + values on same row).
    Preferred badge removed from property row (now in sub-header). Short Term, No Renters Ins,
    No Board, No Broker moved to Listing section. "Renters Ins." → "No Renters Ins" with
    display inversion (✓ when insurance not required).

PreferredHome-mobile/components/ProfilePanel.tsx
  — Full-width layout. Sub-header: "Profile" centered + back arrow. Sub-footer: Clear
    (resets to blank, saves, stays open) + Save (calls handleClose). Backdrop removed.
    Profile fields continue to save immediately on change. Toggles save immediately.

PreferredHome-mobile/components/CriteriaPanel.tsx
  — Full-width layout. Sub-header: "Criteria" centered + back arrow. Sub-footer: Clear
    (resets to blank) + Save (saves + closes). Backdrop removed.

PreferredHome-mobile/components/SettingsPanel.tsx
  — Full-width layout. Sub-header: "Settings" centered + back arrow. Sub-footer: Close
    button (no save state in settings). Backdrop removed. Content unchanged.

PreferredHome-mobile/app/(tabs)/compare.tsx
  — TopBar title "Compare" → "PreferredHome". One line only.

PreferredHome-mobile/app/(tabs)/calendar.tsx
  — Outer ScrollView replaced with fixed calendar + independent appointments ScrollView.
    Appointment address is now tappable — opens maps using street/city/state/zip only
    (no unit number). mapsAddress field added to Appt type.

API REPO
--------
Not touched. No API changes, no schema changes, no dependency changes.

EXPO RESTART
------------
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

TEST CHECKLIST
--------------
[ ] No red screen on launch
[ ] All 5 tabs render
[ ] Add page: TopBar → scrollable form sections (all open) → Save Listing sub-footer visible
[ ] Add page: PROPERTY section has no Short Term or Renters Insurance fields
[ ] Add page: LISTING section has Short Term Available and No Renters Insurance Required fields
[ ] Add page: Building Name field now labeled "Property Name *"
[ ] Add page: Save Listing saves successfully — listing appears in Listings
[ ] Edit page: Sub-header (Edit Listing + back arrow) visible
[ ] Edit page: Bottom nav (5 icons) visible at the bottom
[ ] Edit page: Bottom nav taps navigate to correct tabs
[ ] Edit page: Save Listing saves successfully — listing updates in Listings
[ ] Edit page: All sections open by default
[ ] ViewPanel: Opens full width (no 48px left gap)
[ ] ViewPanel: Sub-header shows building name centered, back arrow left
[ ] ViewPanel: Blue heart shows in sub-header for Preferred listings
[ ] ViewPanel: Neighborhood scores are rounded squares (not circles), neutral color
[ ] ViewPanel: Multi-select fields (Utilities, Unit Features, etc.) display inline
[ ] ViewPanel: LISTING section shows Short Term, No Renters Ins, No Board, No Broker badges
[ ] ViewPanel: Costs section unchanged
[ ] ViewPanel: Scrolls correctly through all content
[ ] Profile panel: Opens full width, centered sub-header with back arrow
[ ] Profile panel: Clear resets all fields, stays open
[ ] Profile panel: Save closes panel
[ ] Criteria panel: Opens full width, centered sub-header, Clear + Save buttons work
[ ] Settings panel: Opens full width, centered sub-header, Close button works
[ ] Compare page: TopBar shows "PreferredHome" (not "Compare")
[ ] Compare page: Card and table views still functional
[ ] Calendar page: Calendar visible at top, does not scroll away
[ ] Calendar page: Appointments scroll independently below calendar
[ ] Calendar page: Tapping an appointment address opens maps app
[ ] No TypeScript errors
[ ] API repo unchanged — no deploy needed
