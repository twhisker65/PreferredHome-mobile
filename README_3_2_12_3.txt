PreferredHome — Build 3.2.12.3 (HOTFIX)
=========================================
Scope: app/(tabs)/add.tsx only.
Fixes option arrays and Costs field order in the Add screen.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

WHAT CHANGED
------------
1. Restored 8 option arrays to exact 3.2.11B values (same fix applied to edit.tsx in 3.2.12.2):
   - UTILITIES
   - UNIT_FEATURES
   - BUILDING_AMENITIES
   - PRIVATE_OUTDOOR_SPACE
   - PET_AMENITIES
   - CLOSE_BY
   - STORAGE_TYPES
   - ROOM_TYPES

2. Restored Costs section field order to exact 3.2.11B sequence (same fix applied to edit.tsx in 3.2.12.2):
   MONTHLY: Base Rent → Utility Fee → Amenity Fee → Parking Fee (car gated) → Storage Rent → Pet Fee (pets gated) → Admin Fee → Other Fee
   UPFRONT: Security Deposit → Application Fee → Broker Fee → Move-in Fee

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/add.tsx

DEPLOY STEPS
------------
1. Copy app/(tabs)/add.tsx from this ZIP into your local PreferredHome-mobile folder, overwriting the existing file.
2. Commit in GitHub Desktop using the commit message below.
3. Push to GitHub.
4. Restart Expo using the command below.
5. Test on your physical device using the test checklist below.

COMMIT MESSAGE
--------------
Build 3.2.12.3 -- Hotfix: restore option arrays and Costs field order in add.tsx

EXPO RESTART COMMAND
--------------------
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

TEST CHECKLIST
--------------
[ ] 1. Open Add screen — no crash on load
[ ] 2. Open Utilities picker — 13 options: Electric, Gas, Heat, Hot Water, Water, Sewer, Trash, Internet, Cable, Parking, Lawn Care, Snow Removal, Pool Maintenance
[ ] 3. Open Unit Features picker — 6 options: Hardwood Floors, Dishwasher, Microwave, Fireplace, Views, Large Windows
[ ] 4. Open Building Amenities picker — 12 options: Rooftop Space, Common Lounge, Barbecue Area, Firepits, Gym, Pool, Doorman, Elevator, Game Room, Theater Room, Playground, Tennis Court
[ ] 5. Open Outdoor Space picker — 7 options: Balcony, Patio, Deck, Porch, Private Yard, Fenced Yard, Other
[ ] 6. Open Storage picker — 11 options: Closet, Walk-in Closet, Basement, Attic, Garage, Shed, Locker, Pantry, Outdoor Storage, Bike Storage, Other
[ ] 7. Open Rooms picker — 17 options: Living Room, Dining Room, Kitchen, Eat-in Kitchen, Foyer, Den, Family Room, TV Room, Office, Library, Sunroom, Mudroom, Laundry Room, Finished Basement, Bonus Room, Playroom, Other
[ ] 8. Open Close By picker — 15 options: Subway, Bus Stop, Grocery Store, Park, Restaurants, Pharmacy, Coffee Shop, Gym, School, Hospital, Library, Dog Park, Farmer's Market, Shopping Mall, Highway Access
[ ] 9. Open Pet Amenities picker — 2 options: Pet Washing, Dog Park
[ ] 10. Costs monthly order: Base Rent → Utility Fee → Amenity Fee → Storage Rent → Pet Fee (if pets on) → Admin Fee → Other Fee
[ ] 11. Property Type show/hide — no regression (Apartment shows Unit #, Floor, Top Floor, Corner Unit; House/Townhouse hides them)
