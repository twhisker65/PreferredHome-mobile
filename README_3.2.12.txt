PreferredHome — Build 3.2.12
============================
Property Type Show/Hide + New Fields in ViewPanel and Compare
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/add.tsx         — property type show/hide + field move to Listing section
app/(tabs)/compare.tsx     — new rows, property type gating, field renames
app/edit.tsx               — property type show/hide + field move to Listing section
components/ViewPanel.tsx   — new fields, property type gating, petFee gate, coolingType fix

WHAT CHANGED IN THIS BUILD
----------------------------

1. app/(tabs)/add.tsx
   - PROPERTY_TYPES: removed "Other". Now exactly 5: Apartment, Condo, Co-op, Townhouse, House.
   - Added isAptCondoCoop derived from draft.propertyType.
   - Unit #, Floor Number: wrapped in {isAptCondoCoop && ...}. Hidden for House / Townhouse.
   - Top Floor, Corner Unit: wrapped in {isAptCondoCoop && ...}. Hidden for House / Townhouse.
   - Number of Floors: unchanged — shown for all property types.
   - shortTermAvailable and rentersInsuranceRequired: removed from PROPERTY section.
   - shortTermAvailable and rentersInsuranceRequired: added to LISTING section after noBrokerFee.
   - handleSave payload: unchanged — fields are still sent correctly from either location.

2. app/(tabs)/compare.tsx
   - "Unit Type" row (key: unitType) renamed to "Property Type" (key: propertyType).
   - "AC Type" row (key: acType) renamed to "Cooling Type" (key: coolingType).
   - New apt/condo/coop-gated rows: Unit # (unitNumber), Floor Number (floorNumber),
     Top Floor (topFloor), Corner Unit (cornerUnit).
     — Table view: rows hidden if NO selected listing is Apartment, Condo, or Co-op.
     — Card view: rows hidden per card based on that listing's property type.
   - New rows added to TABLE and CARD: Pet Fee (pets gated), Storage Rent, Broker Fee,
     Move-in Fee, Number of Floors, Heating Type, Rooms, Outdoor Space, Storage.
   - filterRows() updated: handles apt-only key set + petFee pets gate.
   - getCellData() updated: all new keys added with correct data extraction.

3. app/edit.tsx
   - Same changes as add.tsx: PROPERTY_TYPES cleaned to 5, isAptCondoCoop show/hide,
     shortTermAvailable and rentersInsuranceRequired moved to LISTING section.

4. components/ViewPanel.tsx
   - raw.acType corrected to raw.coolingType — was showing "—" for all listings saved
     after the Build 3.2.11A rename.
   - isAptCondoCoop derived from raw.propertyType.
   - Unit # removed from address for House / Townhouse listings.
   - Top Floor and Corner Unit BoolBadges hidden for House / Townhouse.
   - Floor Number display added — shown for Apartment / Condo / Co-op only.
   - Number of Floors display added — shown for all property types.
   - petFee now gated behind toggles.pets — matches Add / Edit behaviour.
   - New COSTS fields: storageRent, petFee (pets gated), brokerFee, moveInFee.
   - New FEATURES fields: heatingType (inline with Cooling / Laundry), roomTypes,
     privateOutdoorSpaceTypes, storageTypes.
   - LISTING section: shortTermAvailable and rentersInsuranceRequired BoolBadges added.
   - "AC Type" label updated to "Cooling" in the inline features row.

NO CHANGES TO:
- API repo                   (no changes required)
- lib/listingsNormalize.ts   (out of scope)
- lib/types.ts               (out of scope)
- lib/api.ts                 (out of scope)
- lib/profileStorage.ts      (out of scope)
- lib/compareStorage.ts      (out of scope)
- app/(tabs)/listings.tsx    (out of scope)
- app/(tabs)/index.tsx       (out of scope)
- app/(tabs)/calendar.tsx    (out of scope)
- components/ListingCard.tsx (out of scope)
- components/TopBar.tsx      (out of scope)
- components/MenuPanel.tsx   (out of scope)
- components/ProfilePanel.tsx (out of scope)

DEPLOY STEPS
------------
1. Copy the 4 files from this ZIP into their matching locations in your repository
   (overwrite existing files):
     app/(tabs)/add.tsx
     app/(tabs)/compare.tsx
     app/edit.tsx
     components/ViewPanel.tsx
2. Commit in GitHub Desktop using the commit message below.
3. Push to GitHub.
4. Restart Expo using the command below.
5. Test on your physical device using the test checklist below.

COMMIT MESSAGE
--------------
Build 3.2.12 -- Property type show/hide, new fields in ViewPanel and Compare, field move to Listing section

EXPO RESTART COMMAND
--------------------
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

TEST CHECKLIST
--------------
Add screen — Property Type show/hide
[ ] 1. Open Add screen. Property Type is Apartment (default). Unit #, Floor Number, Top Floor, Corner Unit are all visible.
[ ] 2. Change Property Type to House. Unit #, Floor Number, Top Floor, Corner Unit disappear immediately.
[ ] 3. Change Property Type to Townhouse. Same four fields disappear.
[ ] 4. Change Property Type to Condo. All four fields reappear.
[ ] 5. Change Property Type to Co-op. All four fields reappear.
[ ] 6. Number of Floors remains visible for all five property types.

Add screen — Field move
[ ] 7. Short Term Available and Renters Insurance Required are no longer in the Property section.
[ ] 8. Short Term Available and Renters Insurance Required appear in the Listing section alongside No Board Approval and No Broker Fee.

Edit screen — Property Type show/hide
[ ] 9. Open Edit for a House or Townhouse listing. Unit #, Floor Number, Top Floor, Corner Unit are hidden.
[ ] 10. Open Edit for an Apartment, Condo, or Co-op listing. All four fields are visible.

Edit screen — Field move
[ ] 11. Short Term Available and Renters Insurance Required are in the Listing section, not the Property section.

View Listing panel — Property Type show/hide
[ ] 12. Open a House or Townhouse listing in the View panel. Unit #, Floor Number, Top Floor badge, Corner Unit badge are not shown.
[ ] 13. Open an Apartment, Condo, or Co-op listing. All four appear as normal.

View Listing panel — New fields
[ ] 14. Number of Floors is visible in the property info area.
[ ] 15. Short Term Available and Renters Insurance Required appear in the Listing section.
[ ] 16. Storage Rent appears in Costs.
[ ] 17. Broker Fee appears in Costs.
[ ] 18. Move-in Fee appears in Costs.
[ ] 19. Heating Type appears in Features.
[ ] 20. Room Types appears in Features.
[ ] 21. Private Outdoor Space appears in Features.
[ ] 22. Storage appears in Features.
[ ] 23. Cooling Type now shows the correct value (was showing — after the rename).

View Listing panel — Pet Fee toggle
[ ] 24. Pets toggle OFF in Profile. Pet Fee is not visible in the View panel.
[ ] 25. Pets toggle ON. Pet Fee appears in Costs.

Compare — Property Type show/hide
[ ] 26. Select a House or Townhouse for Compare. Unit #, Floor Number, Top Floor, Corner Unit rows are hidden.
[ ] 27. Select an Apartment, Condo, or Co-op. All four rows appear.

Compare — New fields
[ ] 28. Storage Rent, Broker Fee, Move-in Fee, Heating Type, Room Types, Outdoor Space, and Storage rows are visible on both card and table views.
