# PreferredHome — Project Architecture
**Version V3 | March 2026**

---

## Screens

| Screen | File | Purpose |
|---|---|---|
| Home | `app/(tabs)/index.tsx` | Stats snapshot, quick view of Preferred listings |
| Listings | `app/(tabs)/listings.tsx` | Full listing list — Preferred and Candidates sections |
| Add | `app/(tabs)/add.tsx` | Add new listing — 8 collapsible sections |
| Calendar | `app/(tabs)/calendar.tsx` | Viewing appointments by month |
| Compare | `app/(tabs)/compare.tsx` | Side-by-side listing comparison — up to 3 |
| Edit | `app/edit.tsx` | Edit existing listing — same 8 sections as Add |

---

## Key Components

| Component | File | Purpose |
|---|---|---|
| TopBar | `components/TopBar.tsx` | Header with hamburger menu |
| MenuPanel | `components/MenuPanel.tsx` | Hamburger dropdown — Profile, Criteria, Settings |
| ProfilePanel | `components/ProfilePanel.tsx` | Lifestyle toggles (Children, Pets, Car) |
| CriteriaPanel | `components/CriteriaPanel.tsx` | Baseline criteria settings |
| SettingsPanel | `components/SettingsPanel.tsx` | App settings |
| ListingCard | `components/ListingCard.tsx` | Card displayed in Listings screen |
| ViewPanel | `components/ViewPanel.tsx` | Slide-out read-only listing detail |
| FilterPanel | `components/FilterPanel.tsx` | Filter dropdown on Listings screen |

---

## Lib / Services

| File | Purpose |
|---|---|
| `lib/api.ts` | All API calls — getListings, postListing, updateListing, deleteListing, lookupZip, detectListingSite |
| `lib/types.ts` | TypeScript type definitions — ListingUI |
| `lib/listingsNormalize.ts` | Normalizes raw API response to ListingUI type |
| `lib/useListings.ts` | Hook — fetches and manages listing state |
| `lib/profileStorage.ts` | AsyncStorage — Profile toggles (Children, Pets, Car) |
| `lib/compareStorage.ts` | AsyncStorage — Compare selection state |
| `lib/config.ts` | API base URL |
| `styles/colors.ts` | Color tokens |
| `styles/typography.ts` | Typography tokens |

---

## API Repo Structure

| File | Purpose |
|---|---|
| `main.py` | FastAPI routes — GET/POST/PUT/DELETE listings, health |
| `preferredhome_api/core/config_constants.py` | All constants — columns, options, field classifications |
| `preferredhome_api/utils/helpers.py` | detect_listing_site, lookup_zip, calculate_total_monthly, clean_row |
| `preferredhome_api/storage/sheets_storage.py` | Google Sheets read/write with backup/restore safety |
| `preferredhome_api/core/models.py` | Pydantic models |

---

## Add / Edit Screen Sections (in order)

Property → Costs → Features → Transportation → Schools (Children-gated) → Listing → Timeline → Notes

All sections open by default on Add. City/State auto-filled from ZIP on Add (read-only display). On Edit, City and State are editable fields appearing before Zip Code.

---

## Profile Toggle Gates

| Toggle | Gates |
|---|---|
| Children | Schools section on Add, Edit, ViewPanel, Compare |
| Pets | Pet Fee (Costs), Pet Amenities (Features) on Add, Edit, ViewPanel, Compare |
| Car | Parking Fee (Costs), Parking Type (Features) on Add, Edit, ViewPanel, Compare |

---

## Storage

| Data | Storage |
|---|---|
| Listings | Google Sheets via API |
| Profile toggles | AsyncStorage via profileStorage.ts |
| Criteria / Baseline | AsyncStorage via criteriaStorage |
| Compare selection | AsyncStorage via compareStorage |
