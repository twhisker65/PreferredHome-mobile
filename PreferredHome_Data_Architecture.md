# PreferredHome — Data Architecture
**Version V6 | March 2026**

Single source of truth for all fields, sections, types, visibility rules, and Google Sheet structure.

---

## Field Renames — Permanent Record

| Old Name (code) | New Name (code) | Completed |
|---|---|---|
| `unitType` | `propertyType` | Build 3.2.11A |
| `acType` | `coolingType` | Build 3.2.11A |

---

## Field Visibility Rules

### Property Type — Listing-Level Toggle

Property Type is field position 2 (after Status) on every listing. It controls field visibility per listing, unlike Lifestyle Toggles which apply globally across all listings.

| Field | Apartment / Condo / Co-op | House / Townhouse |
|---|---|---|
| Apartment / Unit # | Show | Hide |
| Floor Number | Show | Hide |
| Top Floor | Show | Hide |
| Corner Unit | Show | Hide |
| Number of Floors | Show | Show |

### Lifestyle Toggles — Profile-Level (Global, All Listings)

Lifestyle Toggles are set once in the Profile panel and apply to every listing simultaneously.

| Toggle | Fields Shown When ON |
|---|---|
| Children | Schools section (Add, Edit, ViewPanel, Compare) |
| Pets | Pet Fee (Costs), Pet Amenities (Features) |
| Car | Parking Fee (Costs), Parking Type (Features) |

---

## Section 1 — PROPERTY

All fields in one PROPERTY collapsible section on Add and Edit screens. No sub-sections. Unit fields appear at the end of the PROPERTY section only — no separate Unit sub-section ever.

| UI Label | Field Name (code) | Sheet Column | Type | Parameters / Notes |
|---|---|---|---|---|
| Status | status | Status | Drop | New, Contacted, Scheduled, Viewed, Shortlisted, Applied, Approved, Signed, Rejected, Archived. |
| Property Type | propertyType | Property Type | Drop | Apartment, Condo, Co-op, Townhouse, House. Default: Apartment. Position 2 — drives field visibility per listing. Build 3.2.12. |
| Preferred | preferred | Preferred | Bool | TRUE / FALSE. Drives Preferred grouping in Listings. Default: FALSE. |
| Building Name | buildingName | Building Name | Text | Primary display name on listing card. Required to save. |
| Street Address | streetAddress | Street Address | Text | Street only — no city/state/zip here. |
| Zip Code | zipCode | Zip Code | Text | TEXT type — not numeric. Triggers city/state auto-fill (Build 3.2.14). |
| City | city | City | Text | Add: read-only, auto-filled from ZIP. Edit: editable. |
| State | state | State | Text | Add: read-only, auto-filled from ZIP. Edit: editable. |
| Neighborhood | neighborhood | Neighborhood | Text | |
| Apartment / Unit # | unitNumber | Unit # | Text | Apartment / Condo / Co-op only — hidden for House / Townhouse. Build 3.2.12. |
| Floor Number | floorNumber | Floor Number | Int | Apartment / Condo / Co-op only — hidden for House / Townhouse. Build 3.2.12. |
| Number of Floors | numberOfFloors | Number of Floors | Num | Decimal-pad. Shown for all property types. Build 3.2.11. |
| Bedrooms | bedrooms | Bedrooms | Num | Integer. |
| Bathrooms | bathrooms | Bathrooms | Num | Decimal allowed (e.g. 1.5). |
| Square Footage | squareFootage | Square Footage | Num | If empty — dash on listing card. |
| Top Floor | topFloor | Top Floor | Bool | TRUE / FALSE. Apartment / Condo / Co-op only — hidden for House / Townhouse. Build 3.2.12. |
| Corner Unit | cornerUnit | Corner Unit | Bool | TRUE / FALSE. Apartment / Condo / Co-op only — hidden for House / Townhouse. Build 3.2.12. |
| Furnished | furnished | Furnished | Bool | TRUE / FALSE. |
| Short Term Available | shortTermAvailable | Short Term Available | Bool | TRUE / FALSE. Build 3.2.11. |
| Renters Insurance Required | rentersInsuranceRequired | Renters Insurance Required | Bool | TRUE / FALSE. Build 3.2.11. |

---

## Section 2 — COSTS

Split into two visual sub-groups: MONTHLY and UPFRONT. Sub-group labels are display-only dividers, not sections.

### MONTHLY

| UI Label | Field Name (code) | Sheet Column | Type | Parameters / Notes |
|---|---|---|---|---|
| Monthly Rent | baseRent | Monthly Rent | Curr | Core stat — shown on listing card. |
| Pet Fee | petFee | Pet Fee | Curr | Pets lifestyle toggle gated. Build 3.2.11. |
| Storage Rent | storageRent | Storage Rent | Curr | Always visible. Build 3.2.11. |
| Amenity Fee | amenityFee | Amenity Fee | Curr | |
| Admin Fee | adminFee | Admin Fee | Curr | |
| Utility Fee | utilityFee | Utility Fee | Curr | |
| Parking Fee | parkingFee | Parking Fee | Curr | Car lifestyle toggle gated. |
| Other Fee | otherFee | Other Fee | Curr | |
| Total Monthly | totalMonthly | Total Monthly | Calc | baseRent + petFee + storageRent + amenityFee + adminFee + utilityFee + parkingFee + otherFee. API calculated. ISSUE 2 — fix in Build 3.2.13. |

### UPFRONT

| UI Label | Field Name (code) | Sheet Column | Type | Parameters / Notes |
|---|---|---|---|---|
| Security Deposit | securityDeposit | Security Deposit | Curr | Covers first / last month concept. |
| Application Fee | applicationFee | Application Fee | Curr | |
| Broker Fee | brokerFee | Broker Fee | Curr | Build 3.2.11. |
| Move-in Fee | moveInFee | Move-in Fee | Curr | Build 3.2.11. |
| Total One-Time Upfront | totalUpfront | Total Upfront | Calc | securityDeposit + applicationFee + brokerFee + moveInFee. API calculated. Build 3.2.13. |

---

## Section 3 — FEATURES

Multi-select fields store comma-delimited arrays in Google Sheets.

| UI Label | Field Name (code) | Sheet Column | Type | Parameters / Notes |
|---|---|---|---|---|
| Utilities Included | utilitiesIncluded | Utilities Included | Multi | Gas, Electric, Internet, Water, Sewage, Trash, Parking. |
| Unit Features | unitFeatures | Unit Features | Multi | Hardwood Floors, Air Conditioning, Dishwasher, Microwave, Balcony/Terrace. |
| Private Outdoor Space | privateOutdoorSpaceTypes | Private Outdoor Space | Multi | Patio, Deck, Balcony, Porch, Yard. Build 3.2.11. |
| Building Amenities | buildingAmenities | Building Amenities | Multi | Extra Storage, Rooftop Space, Common Lounge, Barbecue Area, Firepits, Gym, Pool. |
| Pet Amenities | petAmenities | Pet Amenities | Multi | Pet Washing, Dog Park. Pets lifestyle toggle gated. |
| Close By | closeBy | Close By | Multi | Subway, Bus Stop, Grocery Store, Park, Restaurants, Pharmacy, Coffee Shop, Gym, School. |
| Room Types | roomTypes | Room Types | Multi | Living Room, Dining Room, Office, Bonus Room. Build 3.2.11. |
| Storage Types | storageTypes | Storage Types | Multi | Build 3.2.11. |
| Cooling Type | coolingType | Cooling Type | Drop | None, Central, Window, Split, Other. Renamed from acType — Build 3.2.11A. |
| Heating Type | heatingType | Heating Type | Drop | Forced Air, Baseboard, Radiant, Steam, Electric, Natural Gas, Oil, Propane, None. Build 3.2.11. |
| Laundry | laundry | Laundry | Drop | None, In-Unit, On Floor, In Building. |
| Parking Type | parkingType | Parking Type | Drop | None, Covered, Uncovered, Street, Garage. Car lifestyle toggle gated. |

---

## Section 4 — TRANSPORTATION

| UI Label | Field Name (code) | Sheet Column | Type | Parameters / Notes |
|---|---|---|---|---|
| Commute Time (mins) | commuteTime | Commute Time | Num | Integer minutes. Auto-calculated via Google Maps — Build 3.2.15. |
| Walk Score | walkScore | Walk Score | Num | 0–100. Auto-populated via Walk Score API — Build 3.2.15. |
| Transit Score | transitScore | Transit Score | Num | 0–100. Auto-populated via Walk Score API — Build 3.2.15. |
| Bike Score | bikeScore | Bike Score | Num | 0–100. Auto-populated via Walk Score API — Build 3.2.15. |

---

## Section 5 — SCHOOLS

Children lifestyle toggle gated — entire section hidden when Children is OFF. Three sub-groups: Elementary, Middle, High School.

| UI Label | Field Name (code) | Sheet Column | Type | Parameters / Notes |
|---|---|---|---|---|
| Name (Elem) | elementarySchoolName | Elementary School Name | Text | |
| Grades (Elem) | elementaryGrades | Elementary School Grades | Text | e.g. K–5. |
| Rating (Elem) | elementaryRating | Elementary School Rating | Num | 0–10. |
| Distance (Elem) | elementaryDistance | Elementary School Distance | Num | Miles. Decimal allowed. |
| Name (Middle) | middleSchoolName | Middle School Name | Text | |
| Grades (Middle) | middleGrades | Middle School Grades | Text | e.g. 6–8. |
| Rating (Middle) | middleRating | Middle School Rating | Num | 0–10. |
| Distance (Middle) | middleDistance | Middle School Distance | Num | Miles. Decimal allowed. |
| Name (High) | highSchoolName | High School Name | Text | |
| Grades (High) | highGrades | High School Grades | Text | e.g. 9–12. |
| Rating (High) | highRating | High School Rating | Num | 0–10. |
| Distance (High) | highDistance | High School Distance | Num | Miles. Decimal allowed. |

---

## Section 6 — LISTING

| UI Label | Field Name (code) | Sheet Column | Type | Parameters / Notes |
|---|---|---|---|---|
| Listing Site | listingSite | Listing Site | Drop | Zillow, StreetEasy, Apartments.com, Realtor.com, Trulia, Compass, Other. Auto-detect from URL — Build 3.2.14. |
| Listing URL | listingUrl | Listing URL | Text | https://... Tap opens browser (Build 3.2.10). |
| Photo URL | photoUrl | Photo URL | Text | https://... |
| Contact Name | contactName | Contact Name | Text | |
| Contact Phone | contactPhone | Contact Phone | Text | Tap opens dialer (Build 3.2.10). |
| Contact Email | contactEmail | Contact Email | Text | Tap opens mail (Build 3.2.10). |
| Lease Length | leaseLength | Lease Length | Text | e.g. 12 months. |
| No Board Approval | noBoardApproval | Board Approval | Bool | TRUE / FALSE. |
| No Broker Fee | noBrokerFee | Broker Fee | Bool | TRUE / FALSE. |

---

## Section 7 — TIMELINE

| UI Label | Field Name (code) | Sheet Column | Type | Parameters / Notes |
|---|---|---|---|---|
| Date Available | dateAvailable | Date Available | Date | YYYY-MM-DD. Clear button shown when set. |
| Contacted Date | contactedDate | Contacted Date | Date | YYYY-MM-DD. Clear button shown when set. |
| Viewing Date | viewingDate | Viewing Appointment Date | Date | YYYY-MM-DD component of viewingAppointment. |
| Viewing Time | viewingTime | Viewing Appointment Time | Time | AM/PM picker. Combined with viewingDate on save. |
| Applied Date | appliedDate | Applied Date | Date | YYYY-MM-DD. Clear button shown when set. |

---

## Section 8 — NOTES

| UI Label | Field Name (code) | Sheet Column | Type | Parameters / Notes |
|---|---|---|---|---|
| Pros | pros | Pros | Text | Multi-line text area. |
| Cons | cons | Cons | Text | Multi-line text area. |

---

## Section 9 — SYSTEM FIELDS (not shown in UI)

| Field Name (code) | Sheet Column | Type | Parameters / Notes |
|---|---|---|---|
| id | ID | Text | Auto-generated by API on POST. UUID-style short ID. |
| totalMonthly | Total Monthly | Calc | baseRent + petFee + storageRent + amenityFee + adminFee + utilityFee + parkingFee + otherFee. |
| totalUpfront | Total Upfront | Calc | securityDeposit + applicationFee + brokerFee + moveInFee. |

---

## Section 10 — Field Type Key

| Type | Description |
|---|---|
| Text | Plain string. Sent as-is. |
| Num | Integer or decimal. Sent as JS number (not string). Null if empty. |
| Int | Integer only. Sent as JS number. Null if empty. |
| Curr | Same as Num. Currency display. Null if empty. |
| Bool | Sent as `'TRUE'` or `'FALSE'` all-caps string. Never as JS true/false. |
| Drop | Single select from a hard-coded list. Sent as the selected string value. |
| Multi | Multi-select, stored as comma-delimited string in Google Sheet. |
| Date | YYYY-MM-DD string. Null if empty. |
| Time | AM/PM picker value. Combined with Date field on save. |
| Calc | Calculated by API, never sent from mobile. |

---

## Section 11 — Status Flow (10-Status Listing Lifecycle)

| Status | Pill Color | Meaning |
|---|---|---|
| New | Blue | Listing saved. No action taken yet. |
| Contacted | Blue | Reached out to landlord or agent. |
| Scheduled | Blue | Viewing appointment booked. |
| Viewed | Blue | In-person visit completed. |
| Shortlisted | Amber | Strong candidate — under active consideration. |
| Applied | Blue | Application submitted. |
| Approved | Green | Application approved. |
| Signed | Teal | Lease signed. |
| Rejected | Red | Not proceeding — rejected or withdrew. |
| Archived | Grey | Removed from active view. Not deleted. |
