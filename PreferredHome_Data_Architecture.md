# PreferredHome — Data Architecture
**Version V5 | March 2026**

Single source of truth for all fields, sections, types, and Google Sheet structure.

---

## Section 1 — PROPERTY

All fields in one PROPERTY collapsible section on Add and Edit screens. No sub-sections.

| UI Label | Field Name (code) | Sheet Column | Type | Parameters / Notes |
|---|---|---|---|---|
| Status | status | Status | Drop | New, Contacted, Scheduled, Viewed, Shortlisted, Applied, Approved, Signed, Rejected, Archived. |
| Property Type | propertyType | Property Type | Drop | Apartment, House, Townhouse, Duplex, Condo. Default: Apartment. Drives field visibility — Build 3.2.12. |
| Unit Type | unitType | Unit Type | Drop | Rental, Condo, Co-op. Default: Rental. |
| Preferred | preferred | Preferred | Bool | TRUE / FALSE. Drives Preferred grouping in Listings. Default: FALSE. |
| Building Name | buildingName | Building Name | Text | Primary display name on listing card. Required to save. |
| Street Address | streetAddress | Street Address | Text | Street only — no city/state/zip here. |
| Zip Code | zipCode | Zip Code | Text | TEXT type — not numeric. Triggers city/state auto-fill (Build 3.2.14). |
| City | city | City | Text | Add: read-only, auto-filled from ZIP. Edit: editable. |
| State | state | State | Text | Add: read-only, auto-filled from ZIP. Edit: editable. |
| Neighborhood | neighborhood | Neighborhood | Text | |
| Apartment / Unit # | unitNumber | Unit # | Text | |
| Floor Number | floorNumber | Floor Number | Int | |
| Bedrooms | bedrooms | Bedrooms | Num | Integer. |
| Bathrooms | bathrooms | Bathrooms | Num | Decimal allowed (e.g. 1.5). |
| Square Footage | squareFootage | Square Footage | Num | If empty — dash on listing card. |
| Floors (House) | floors | Floors | Num | Integer. House/Townhouse/Duplex only — Build 3.2.11. |
| Garage | garage | Garage | Bool | TRUE / FALSE. House/Townhouse/Duplex/Condo — Build 3.2.11. |
| Garage Spaces | garageSpaces | Garage Spaces | Num | Integer. Shown when Garage = TRUE — Build 3.2.11. |
| Yard | yard | Yard | Bool | TRUE / FALSE. House/Townhouse/Duplex only — Build 3.2.11. |
| Basement | basement | Basement | Bool | TRUE / FALSE. House/Townhouse/Duplex only — Build 3.2.11. |
| Basement Finished | basementFinished | Basement Finished | Bool | TRUE / FALSE. Shown when Basement = TRUE — Build 3.2.11. |
| Top Floor | topFloor | Top Floor | Bool | TRUE / FALSE. Apartment/Condo/Co-op only. |
| Corner Unit | cornerUnit | Corner Unit | Bool | TRUE / FALSE. Apartment/Condo/Co-op only. |
| Furnished | furnished | Furnished | Bool | TRUE / FALSE. |

---

## Section 2 — COSTS

| UI Label | Field Name (code) | Sheet Column | Type | Parameters / Notes |
|---|---|---|---|---|
| Monthly Rent | baseRent | Monthly Rent | Curr | Core stat — shown on listing card. |
| Pet Fee | petFee | Pet Fee | Curr | Monthly pet fee. Pets profile toggle gated — Build 3.2.11. |
| Amenity Fee | amenityFee | Amenity Fee | Curr | |
| Admin Fee | adminFee | Admin Fee | Curr | |
| Utility Fee | utilityFee | Utility Fee | Curr | |
| Parking Fee | parkingFee | Parking Fee | Curr | Car profile toggle gated. |
| Other Fee | otherFee | Other Fee | Curr | |
| Total Monthly | totalMonthly | Total Monthly | Calc | baseRent + petFee + amenityFee + adminFee + utilityFee + parkingFee + otherFee. API calculated. |
| Security Deposit | securityDeposit | Security Deposit | Curr | |
| Broker Fee | brokerFee | Broker Fee | Curr | Build 3.2.11. |
| First Month | firstMonth | First Month | Curr | Build 3.2.11. |
| Last Month | lastMonth | Last Month | Curr | Build 3.2.11. |
| Application Fee | applicationFee | Application Fee | Curr | |
| Total One-Time Upfront | totalUpfront | Total Upfront | Calc | securityDeposit + brokerFee + firstMonth + lastMonth + applicationFee. Build 3.2.13. |

---

## Section 3 — FEATURES

Multi-select fields store comma-delimited arrays in Google Sheets.

| UI Label | Field Name (code) | Sheet Column | Type | Parameters / Notes |
|---|---|---|---|---|
| Utilities Included | utilitiesIncluded | Utilities Included | Multi | Gas, Electric, Internet, Water, Sewage, Trash, Parking. |
| Unit Features | unitFeatures | Unit Features | Multi | Hardwood Floors, Air Conditioning, Dishwasher, Microwave, Balcony/Terrace. |
| Outdoor Space | outdoorSpace | Outdoor Space | Multi | Patio, Deck, Balcony, Porch, Yard. Build 3.2.11. |
| Building Amenities | buildingAmenities | Building Amenities | Multi | Extra Storage, Rooftop Space, Common Lounge, Barbecue Area, Firepits, Gym, Pool. |
| Pet Amenities | petAmenities | Pet Amenities | Multi | Pet Washing, Dog Park. Pets profile toggle gated. |
| Close By | closeBy | Close By | Multi | Subway, Bus Stop, Grocery Store, Park, Restaurants, Pharmacy, Coffee Shop, Gym, School. |
| Rooms | rooms | Rooms | Multi | Living Room, Dining Room, Office, Bonus Room. Build 3.2.11. |
| AC Type | acType | AC Type | Drop | None, Central, Window, Split, Other. |
| Laundry | laundry | Laundry | Drop | None, In-Unit, On Floor, In Building. |
| Parking Type | parkingType | Parking Type | Drop | None, Covered, Uncovered, Street, Garage. Car profile toggle gated. |

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

Children profile toggle gated. Three sub-groups: Elementary, Middle, High School.

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
| Listing Site | listingSite | Listing Site | Drop | Zillow, StreetEasy, Apartments.com, Realtor.com, Trulia, Compass, Other. |
| Listing URL | listingUrl | Listing URL | Text | https://... |
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

| UI Label | Field Name (code) | Sheet Column | Type | Parameters / Notes |
|---|---|---|---|---|
| ID | id | ID | Text | Auto-generated by API on POST. UUID-style short ID. |
| Total Monthly | totalMonthly | Total Monthly | Calc | baseRent + petFee + amenityFee + adminFee + utilityFee + parkingFee + otherFee. |
| Total Upfront | totalUpfront | Total Upfront | Calc | securityDeposit + brokerFee + firstMonth + lastMonth + applicationFee. |

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

| Status | Pill Color | Meaning | Exit / Side Path |
|---|---|---|---|
| New | #FFFFFF | Listing saved. No action taken yet. | Not interested → Rejected |
| Contacted | #EAB308 | Reached out to landlord/agent. | No response → Rejected |
| Scheduled | #F97316 | Viewing appointment confirmed. | Cancelled / pass → Rejected |
| Viewed | #7C3AED | In-person or virtual viewing done. | Did not like → Rejected |
| Shortlisted | #2563EB | Liked after viewing. Under active consideration. | Decided against → Rejected |
| Applied | #0D9488 | Application submitted. | Rejected by landlord → Rejected |
| Approved | #10B981 | Application approved by landlord. | Changed mind → Rejected |
| Signed | #D97706 | Lease signed. This listing is chosen. | — |
| Rejected | #EF4444 | Not moving forward for any reason. | Can move to Archived |
| Archived | #475569 | Removed from active view. Historical record. | Terminal state. |

**Flow:** New → Contacted → Scheduled → Viewed → Shortlisted → Applied → Approved → Signed (main forward path). Any status → Rejected at any point. Rejected → Archived to clean up.

**Terminology:** Candidates = all active listings. Preferred = heart-flagged boolean subset. Shortlisted = post-viewing liked status.
