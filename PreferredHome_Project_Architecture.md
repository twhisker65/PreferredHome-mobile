# PreferredHome — Project Architecture Master
**Version V6 | March 2026**

Defines how the app functions, UI behaviours, screens, and technical stack. Scope: app functionality only. No data fields or workflow rules — see Data Architecture.

---

## 1. Project Identity

| Property | Value |
|---|---|
| App Name | PreferredHome |
| Purpose | Mobile-first rental listing evaluation tool |
| Mobile Repo | https://github.com/twhisker65/PreferredHome-mobile |
| API Repo | https://github.com/twhisker65/PreferredHome-api |
| API Live | https://preferredhome-api.onrender.com |
| Branch | MAIN only — via GitHub Desktop |

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React Native with Expo Router |
| Cross-platform | Single codebase for iOS and Android |
| Backend (current) | Google Sheets via Render API (Python FastAPI) |
| Backend (future) | FastAPI + PostgreSQL (Phase 4.0) |
| Version Control | GitHub Desktop — MAIN branch only |
| Expo Command | `npx expo start --tunnel --clear` |
| Local Mobile Path | `C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile` |

---

## 3. Design System

| Token | Value |
|---|---|
| Theme | Dark navy — luxury, controlled |
| Background | Dark navy |
| Cards | Slightly lighter navy |
| Accent | Blue — primaryBlue in styles/colors.ts (#2563EB) |
| Typography | Defined in styles/typography.ts |

---

## 4. App Screens (5 Tabs)

| Tab | Screen | Purpose |
|---|---|---|
| 1 | Home | Dashboard — avg/min/max rent stats, Top 3 Preferred listings. |
| 2 | Listings | Full listing cards grouped by Preferred / Candidates. Filter panel. ViewPanel slide-out. |
| 3 | Add | Form to create a new listing — all fields, collapsible sections, all open by default. |
| 4 | Compare | Side-by-side comparison of up to 3 listings. Card and table view. Criteria scoring panel. |
| 5 | Calendar | Month view with viewing appointment dots. Appointment list filtered by current month. |

---

## 5. Global UI Components

| Component | Description |
|---|---|
| TopBar | Present on every screen. Fixed position. App title/logo + hamburger menu + optional right icon. |
| Bottom Nav | Present on every screen. Fixed position. 5 tabs with active tab highlighted. |
| SidePanel | Slides from left (hamburger menu) or right (ViewPanel). Supports side='left' or side='right'. |
| MenuPanel | Hamburger menu contents: Profile, Criteria, Settings sub-panels. |
| ListingCard | Card with status pill, building name, address, rent, action row. |
| StatusPill | Colored pill displaying listing status. 10 statuses with distinct colors. |
| FilterPanel | Drop-down from header. 6 filters: Status, Unit Type, Broker Fee, Preferred, Max Rent, Zip Code. |
| ViewPanel | Slide-out from right (Build 3.2.05). Read-only detail across all 8 sections. Tap-to-contact links active (Build 3.2.10). |
| CompareStorage | lib/compareStorage.ts — manages selected listings for Compare screen via AsyncStorage. |

---

## 6. Add / Edit Screen — Section Structure

Eight collapsible sections. All open by default. All fields always visible. No Unit sub-section — unit fields appear at end of PROPERTY only.

| Section | Fields (summary — see Data Architecture for full list) |
|---|---|
| PROPERTY | status, propertyType, unitType, preferred, buildingName, streetAddress, zipCode, city, state, neighborhood, unitNumber, floorNumber, bedrooms, bathrooms, squareFootage, floors, garage, garageSpaces, yard, basement, basementFinished, topFloor, cornerUnit, furnished |
| COSTS | baseRent, petFee, amenityFee, adminFee, utilityFee, parkingFee, otherFee, securityDeposit, brokerFee, firstMonth, lastMonth, applicationFee |
| FEATURES | utilitiesIncluded, unitFeatures, outdoorSpace, buildingAmenities, petAmenities, closeBy, rooms, acType, laundry, parkingType |
| TRANSPORTATION | commuteTime, walkScore, transitScore, bikeScore |
| SCHOOLS | elementarySchoolName/Grades/Rating/Distance, middleSchoolName/Grades/Rating/Distance, highSchoolName/Grades/Rating/Distance |
| LISTING | listingSite, listingUrl, photoUrl, contactName, contactPhone, contactEmail, leaseLength, noBoardApproval, noBrokerFee |
| TIMELINE | dateAvailable, contactedDate, viewingDate, viewingTime, appliedDate |
| NOTES | pros, cons |

---

## 7. Listing Card Anatomy

| Element | Content / Behaviour |
|---|---|
| Status Pill | status field — short single word, colored by status — below building name |
| Building Name | buildingName — large bold text |
| Address | streetAddress, city, state, zip, unitNumber |
| Unit Info | unitType · bedrooms bd · bathrooms ba · squareFootage sqft |
| Rent | baseRent/mo — shows '+$X fees' if any fee > 0 |
| Action Row | Heart (preferred), Compare, View (→ViewPanel), Edit, Trash (delete with confirmation) |

---

## 8. UI Interaction Patterns

| Pattern | Behaviour |
|---|---|
| Slide Out Left | Side panel slides from left edge (hamburger menu) |
| Slide Out Right | View Panel slides from right edge — 102px left offset |
| Slide Up Modal | Modal slides from bottom for pickers |
| Toggles | On/Off switches for boolean fields |
| Collapsible Sections | Tap header to expand/collapse — all open by default on Add |
| Pull to Refresh | Refresh listing data from API |
| Focus Refresh | Listings, Home, Calendar auto-refresh on tab focus |
| Delete Confirmation | Alert prompt before deleting a listing |
| Save Feedback | Spinner + Saving... text during API call, alert on success/failure |
| Tap to Dial | Phone numbers open dialer — active (Build 3.2.10) |
| Tap to Email | Email addresses open mail app — active (Build 3.2.10) |
| Tap to Maps | Address opens Maps — active (Build 3.2.10) |
| Tap to Browser | Listing URL opens browser — active (Build 3.2.10) |
| Profile Toggles | Children, Pets, Car toggles stored in AsyncStorage. Drive field visibility on Add, Edit, ViewPanel, Compare — active (Build 3.2.09) |

---

## 9. Folder Structure

| Path | Contents |
|---|---|
| app/(tabs)/ | index.tsx, listings.tsx, add.tsx, compare.tsx, calendar.tsx |
| app/ | profile.tsx, settings.tsx, edit.tsx |
| components/ | TopBar, ListingCard, StatusPill, SidePanel, MenuPanel, FilterPanel, ViewPanel |
| lib/ | types.ts, api.ts, config.ts, useListings.ts, listingsNormalize.ts, profileStorage.ts, compareStorage.ts, orderStorage.ts |
| styles/ | colors.ts, typography.ts, spacing.ts |
| assets/ | Icons and images |

---

## 10. API Functions (lib/api.ts)

| Function | Method + Path | Purpose |
|---|---|---|
| getHealth() | GET /health | Check API status — verify after every Render deploy. |
| getListings() | GET /listings | Fetch all listings from Google Sheet. |
| postListing() | POST /listings | Add new listing — API auto-generates id. |
| updateListing() | PUT /listings/:id | Update existing listing. |
| deleteListing() | DELETE /listings/:id | Delete listing by id. |

---

## 11. Testing Protocol

| Test Type | Procedure |
|---|---|
| Device | Physical phone via QR scan in Expo Go with tunnel mode. |
| Smoke Test | No red screen, all tabs render, listing data loads. |
| Regression | Add → Save → listing appears in Listings screen. |
| Delete Test | Trash icon → confirmation prompt → listing removed. |
| API Verify | Check /health endpoint after every Render deploy. |
| Toggle Test | Set each profile toggle → confirm correct fields show/hide on Add, Edit, ViewPanel, Compare. |
| Compare Test | Select 2–3 listings → open Compare → verify card and table views. |

---

## 12. Deployment Roadmap

| Phase | Description |
|---|---|
| 1 (current) | Google Sheets datastore via Render API. |
| 2 | FastAPI backend (REST API) — full rebuild. |
| 3 | PostgreSQL database migration. |
| 4 | Authentication and multi-user support. |
| 5 | Production build via EAS — App Store and Google Play submission (Build 3.2.19 APK, then full submission). |
