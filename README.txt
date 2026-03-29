PreferredHome — Build 3.2.16
============================
Add/Edit Unification — single shared form component.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/add.tsx               — refactored to use shared ListingForm
app/edit.tsx                     — refactored to use shared ListingForm
components/ListingForm.tsx       — new shared form component (new file)

WHAT CHANGED IN THIS BUILD
----------------------------
A single shared form component (ListingForm.tsx) now contains all form
logic previously duplicated across add.tsx and edit.tsx. Both screens
are refactored to use it. No user-visible changes. No field changes.
No section changes. No UI changes.

1. components/ListingForm.tsx (NEW FILE)
   - Contains: Draft type, BLANK_DRAFT, all option arrays (copied exactly
     from source), all utility functions (boolStr, boolVal, str, numStr,
     multiVal, clampRating, rawToDraft, buildPayload, buildViewingAppointment).
   - Contains: all sub-components (Section, Field, Toggle, SelectRow,
     MultiRow, DateRow) — all defined OUTSIDE the export function.
   - Contains: the complete 8-section form JSX (Property, Costs, Features,
     Transportation, Schools, Listing, Timeline, Notes).
   - Contains: picker Modal and date picker Modal.
   - Contains: zip lookup useEffect (fires when zip reaches 5 digits,
     auto-fills City and State — both remain manually editable).
   - Contains: detectListingSite useEffect.
   - Props: initialDraft, toggles, saving, onSave(payload, draft), insets.
   - Exports: ListingForm (default), BLANK_DRAFT, Draft type, rawToDraft,
     buildPayload, boolStr.

2. app/(tabs)/add.tsx (CHANGED)
   - Imports ListingForm, BLANK_DRAFT from components/ListingForm.
   - Retains: useFocusEffect to load profile/toggles on screen focus.
   - Retains: postListing API call, calculateCommute fire-and-forget.
   - Retains: post-save navigation to listings screen.
   - Uses formKey to remount ListingForm with blank draft after each save.
   - Menu panel pattern matches all other tab screens (onSelectPanel +
     separate sub-panel rendering).

3. app/edit.tsx (CHANGED)
   - Imports ListingForm, rawToDraft from components/ListingForm.
   - Retains: listing fetch via getListings on mount.
   - Retains: updateListing API call, calculateCommute fire-and-forget.
   - Retains: post-save router.back() navigation.
   - Shows ActivityIndicator spinner while listing loads.
   - Once listing is loaded, renders ListingForm with rawToDraft(raw).

COMMIT MESSAGE
--------------
Copy and paste exactly:

Build 3.2.16 - Add/Edit Unification — single shared form component

EXPO RESTART COMMAND
--------------------
Copy and paste exactly (run in order):

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile
npx expo start --tunnel --clear

RENDER HEALTH CHECK
-------------------
No API changes — no Render deploy required.
https://preferredhome-api.onrender.com/health

TEST CHECKLIST
--------------
[ ] Open app. Tap Add. Confirm form loads with all sections visible and all fields blank.
[ ] Fill in Building Name and Street Address. Enter a 5-digit zip — confirm City and State auto-fill.
[ ] Fill in Base Rent. Save. Confirm listing appears in Listings screen with correct data.
[ ] Tap Edit on that listing. Confirm all saved fields pre-populate correctly.
[ ] Change Base Rent on Edit. Save. Confirm Listings screen shows updated rent.
[ ] On Add: toggle Children ON in Profile. Confirm Schools section appears. Toggle OFF — confirm it disappears.
[ ] On Add: toggle Car ON. Confirm Parking Fee and Parking Type fields appear.
[ ] On Edit: same toggle tests as above.
[ ] Open a picker (e.g. Property Type). Select a value. Confirm it saves correctly on both Add and Edit.
[ ] Open a date picker (e.g. Date Available). Set a date. Confirm it saves correctly.
[ ] Add a listing with a street address while Work Address is set in Profile. Confirm commute time populates.
[ ] No red screen on any screen throughout testing.
