# PreferredHome — Data Architecture
**Version V7 | April 2026**

Single source of truth for all approved fields, sections, types, visibility rules, and current storage naming. This document reflects the current accepted app state before V4 canonical-model work. V4 will intentionally replace parts of this document when the canonical data model is approved.

---

## Operating Note

This document describes the **current accepted implementation state** after the 3.2.x line.  
It does **not** yet apply the full V4 rename of `buildingName` → `propertyName`.

For current implementation:
- underlying field key remains `buildingName`
- approved display label may read **Property Name**
- full canonical rename belongs to V4

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

| Field | Apartment / Condo / Co-op | Townhouse / House |
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

All fields in one PROPERTY collapsible section on Add and Edit screens. Unit fields appear at the end of the PROPERTY section only — no Unit sub-section ever.

| UI Label | Field Name (code) | Current Storage Name | Type | Parameters / Notes |
|---|---|---|---|---|
| Status | status | status | Drop | New, Contacted, Scheduled, Viewed, Shortlisted, Applied, Approved, Signed, Rejected, Archived |
| Property Type | propertyType | propertyType | Drop | Apartment, Condo, Co-op, Townhouse, House. Position 2 — drives field visibility per listing |
| Preferred | preferred | preferred | Bool | TRUE / FALSE |
| Property Name *(display label)* | buildingName | buildingName | Text | Underlying field key remains `buildingName` until V4 canonical rename |
| Street Address | streetAddress | streetAddress | Text | Street only — no city/state/zip here |
| Zip Code | zipCode | zipCode | Text | TEXT type — not numeric |
| City | city | city | Text | Add: read-only auto-fill from ZIP. Edit: editable |
| State | state | state | Text | Add: read-only auto-fill from ZIP. Edit: editable |
| Neighborhood | neighborhood | neighborhood | Text | |
| Apartment / Unit # | unitNumber | unitNumber | Text | Apartment / Condo / Co-op only |
| Floor Number | floorNumber | floorNumber | Int | Apartment / Condo / Co-op only |
| Number of Floors | numberOfFloors | numberOfFloors | Num | Shown for all property types |
| Bedrooms | bedrooms | bedrooms | Num | Integer |
| Bathrooms | bathrooms | bathrooms | Num | Decimal allowed |
| Square Footage | squareFootage | squareFootage | Num | |
| Top Floor | topFloor | topFloor | Bool | Apartment / Condo / Co-op only |
| Corner Unit | cornerUnit | cornerUnit | Bool | Apartment / Condo / Co-op only |
| Furnished | furnished | furnished | Bool | |

---

## Section 2 — COSTS

Split into two visual sub-groups: MONTHLY and UPFRONT. These are display-only sub-groups, not sections.

### MONTHLY

| UI Label | Field Name (code) | Current Storage Name | Type | Parameters / Notes |
|---|---|---|---|---|
| Monthly Rent | baseRent | baseRent | Curr | Core stat — shown on listing card |
| Pet Fee | petFee | petFee | Curr | Pets lifestyle toggle gated |
| Storage Rent | storageRent | storageRent | Curr | Always visible |
| Amenity Fee | amenityFee | amenityFee | Curr | |
| Admin Fee | adminFee | adminFee | Curr | |
| Utility Fee | utilityFee | utilityFee | Curr | |
| Parking Fee | parkingFee | parkingFee | Curr | Car lifestyle toggle gated |
| Other Fee | otherFee | otherFee | Curr | |
| Total Monthly | totalMonthly | totalMonthly | Calc | Derived from raw fee fields |

### UPFRONT

| UI Label | Field Name (code) | Current Storage Name | Type | Parameters / Notes |
|---|---|---|---|---|
| Security Deposit | securityDeposit | securityDeposit | Curr | |
| Application Fee | applicationFee | applicationFee | Curr | |
| Broker Fee | brokerFee | brokerFee | Curr | |
| Move-in Fee | moveInFee | moveInFee | Curr | |
| Total One-Time Upfront | totalUpfront | totalUpfront | Calc | Derived from raw upfront fields |

---

## Section 3 — FEATURES

Multi-select fields are currently stored as comma-delimited values in the Google Sheets phase. This is a current-state rule only and will be replaced by the V4 canonical model.

| UI Label | Field Name (code) | Current Storage Name | Type | Parameters / Notes |
|---|---|---|---|---|
| Utilities Included | utilitiesIncluded | utilitiesIncluded | Multi | |
| Unit Features | unitFeatures | unitFeatures | Multi | |
| Private Outdoor Space | privateOutdoorSpaceTypes | privateOutdoorSpaceTypes | Multi | |
| Building Amenities | buildingAmenities | buildingAmenities | Multi | |
| Pet Amenities | petAmenities | petAmenities | Multi | Pets lifestyle toggle gated |
| Close By | closeBy | closeBy | Multi | |
| Room Types | roomTypes | roomTypes | Multi | |
| Storage Types | storageTypes | storageTypes | Multi | |
| Cooling Type | coolingType | coolingType | Drop | |
| Heating Type | heatingType | heatingType | Drop | |
| Laundry | laundry | laundry | Drop | |
| Parking Type | parkingType | parkingType | Drop | Car lifestyle toggle gated |

---

## Section 4 — TRANSPORTATION

| UI Label | Field Name (code) | Current Storage Name | Type | Parameters / Notes |
|---|---|---|---|---|
| Commute Time (mins) | commuteTime | commuteTime | Num | Integer minutes. External calculated value |
| Walk Score | walkScore | walkScore | Num | 0–100 |
| Transit Score | transitScore | transitScore | Num | 0–100 |
| Bike Score | bikeScore | bikeScore | Num | 0–100 |

---

## Section 5 — SCHOOLS

Children lifestyle toggle gated — entire section hidden when Children is OFF.

| UI Label | Field Name (code) | Current Storage Name | Type |
|---|---|---|---|
| Name (Elem) | elementarySchoolName | elementarySchoolName | Text |
| Grades (Elem) | elementaryGrades | elementaryGrades | Text |
| Rating (Elem) | elementaryRating | elementaryRating | Num |
| Distance (Elem) | elementaryDistance | elementaryDistance | Num |
| Name (Middle) | middleSchoolName | middleSchoolName | Text |
| Grades (Middle) | middleGrades | middleGrades | Text |
| Rating (Middle) | middleRating | middleRating | Num |
| Distance (Middle) | middleDistance | middleDistance | Num |
| Name (High) | highSchoolName | highSchoolName | Text |
| Grades (High) | highGrades | highGrades | Text |
| Rating (High) | highRating | highRating | Num |
| Distance (High) | highDistance | highDistance | Num |

---

## Section 6 — LISTING

This section reflects the current accepted UI grouping after the 3.2.21 line.

| UI Label | Field Name (code) | Current Storage Name | Type | Parameters / Notes |
|---|---|---|---|---|
| Listing Site | listingSite | listingSite | Drop | Zillow, StreetEasy, Apartments.com, Realtor.com, Trulia, Compass, Other |
| Listing URL | listingUrl | listingUrl | Text | Tap opens browser |
| Photo URL | photoUrl | photoUrl | Text | |
| Contact Name | contactName | contactName | Text | |
| Contact Phone | contactPhone | contactPhone | Text | Tap opens dialer |
| Contact Email | contactEmail | contactEmail | Text | Tap opens mail |
| Lease Length | leaseLength | leaseLength | Text | |
| Short Term Available | shortTermAvailable | shortTermAvailable | Bool | Current accepted UI grouping is LISTING |
| No Renters Insurance Required *(display inversion)* | rentersInsuranceRequired | rentersInsuranceRequired | Bool | Underlying stored field remains rentersInsuranceRequired. Display inversion is UI-only |
| No Board Approval | noBoardApproval | noBoardApproval | Bool | |
| No Broker Fee | noBrokerFee | noBrokerFee | Bool | |

---

## Section 7 — TIMELINE

| UI Label | Field Name (code) | Current Storage Name | Type |
|---|---|---|---|
| Date Available | dateAvailable | dateAvailable | Date |
| Contacted Date | contactedDate | contactedDate | Date |
| Viewing Date | viewingDate | viewingDate | Date |
| Viewing Time | viewingTime | viewingTime | Time |
| Applied Date | appliedDate | appliedDate | Date |

---

## Section 8 — NOTES

| UI Label | Field Name (code) | Current Storage Name | Type |
|---|---|---|---|
| Pros | pros | pros | Text |
| Cons | cons | cons | Text |

---

## Section 9 — SYSTEM FIELDS (not shown in UI)

| Field Name (code) | Current Storage Name | Type | Parameters / Notes |
|---|---|---|---|
| id | id | Text | Auto-generated by API on POST |
| totalMonthly | totalMonthly | Calc | Current implementation may store it, but it is treated as derived |
| totalUpfront | totalUpfront | Calc | Current implementation may store it, but it is treated as derived |

---

## Section 10 — Current Type Rules

| Type | Current Rule |
|---|---|
| Text | Plain string |
| Num | Integer or decimal number, null if empty |
| Int | Integer only, null if empty |
| Curr | Numeric currency value, null if empty |
| Bool | `'TRUE'` / `'FALSE'` all-caps strings |
| Drop | Selected string value |
| Multi | Current Google Sheets phase stores comma-delimited values |
| Date | `YYYY-MM-DD` string or null |
| Time | AM/PM value paired with date on save |
| Calc | Derived value, not user-entered source of truth |

---

## Section 11 — Current UI / Data Boundary Rules

- Display-label changes do not authorize field-key renames.
- UI section placement changes do not authorize schema or payload changes.
- Current accepted UI grouping places `shortTermAvailable` and `rentersInsuranceRequired` in the LISTING section.
- Current accepted implementation still uses `buildingName` as the field key under the display label **Property Name**.
- V4 will intentionally replace this current-state model with a canonical model.

---

## Section 12 — Status Flow (Current Accepted State)

| Status | Meaning |
|---|---|
| New | Listing saved. No action taken yet |
| Contacted | Reached out to landlord or agent |
| Scheduled | Viewing appointment booked |
| Viewed | Viewing completed |
| Shortlisted | Strong candidate under active consideration |
| Applied | Application submitted |
| Approved | Application approved |
| Signed | Lease signed |
| Rejected | Not proceeding |
| Archived | Historical record, removed from active view |
