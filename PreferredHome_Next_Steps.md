# PreferredHome — Next Steps
**Closing Out Build 3.2.12.2 | March 2026**

---

## Build 3.2.12.2 — Confirmed Stable

Build 3.2.12.2 is confirmed stable. All test steps passed. Co-op casing confirmed correct and data corrected in Google Sheets.

---

## This Session — What Was Done

| Item | Detail |
|---|---|
| Build 3.2.12 delivered | Property type show/hide, new fields in ViewPanel and Compare, field move to Listing section |
| Build 3.2.12 folder error | ZIP used app/tabs/ instead of app/(tabs)/ — routing conflict caused Edit crash |
| Build 3.2.12.1 delivered | Folder structure corrected. Four files replaced. |
| Build 3.2.12.1 remaining issues | Edit crash persisted (fetchListing), option arrays wrong, Compare Clear button missing, new rows absent from cards |
| Build 3.2.12.2 delivered | edit.tsx only. fetchListing replaced. Option arrays restored. Costs order restored. |
| Drift Log updated | 6 new entries added for violations across the 3.2.12 series |
| Co-op casing confirmed | Correct casing is Co-op. Data in Google Sheets corrected by Thomas. |

---

## Session Close Steps

1. Drop the following files into the repo root (overwrite previous versions):
   - `PreferredHome_Assistant_Briefing.md`
   - `PreferredHome_Next_Steps.md`
   - `PreferredHome_Drift_Log.md`
2. Commit in GitHub Desktop using the commit message below
3. Push to GitHub
4. Sync the Claude Project

---

## Commit Message

```
Closing out Build 3.2.12.2 -- edit.tsx stable, closing docs updated, drift log updated
```

---

## Immediate Next Step — Build 3.2.12.3

**Scope:** `app/(tabs)/add.tsx` only.

**What changes:**
- Restore 8 option arrays to exact 3.2.11B values — same arrays just fixed in edit.tsx
- Restore Costs section field order to exact 3.2.11B sequence — same order just fixed in edit.tsx

**Pattern:** Exact same fixes just applied to edit.tsx. Arrays and field order are identical between the two files.

**Test checklist:**
- [ ] 1. Open Add screen — no crash
- [ ] 2. Open any multi-select picker (Rooms, Storage, Utilities, Unit Features, Building Amenities, Private Outdoor Space, Close By) — full option lists present
- [ ] 3. Costs field order: Base Rent → Utility Fee → Amenity Fee → Storage Rent → Admin Fee → Other Fee → Security Deposit → Application Fee → Broker Fee → Move-in Fee
- [ ] 4. Property Type show/hide still working correctly on Add

---

## Build 3.2.12.4 — After 3.2.12.3 is Stable

**Scope:** `app/(tabs)/compare.tsx` only.

**What changes:**
- Restore the Compare Clear button
- Add new field rows (Rooms, Outdoor Space, Storage, Heating Type, etc.) to CARD_ROWS — they are already in TABLE_ROWS
- Fix label truncation in the Compare table (label text wrapping)

---

## Open Issues — Carried Forward

| ID | Issue | Target |
|---|---|---|
| ISSUE 2 | API `totalMonthly` omits fees for some listings. Compare screen uses local calculation as workaround. | Build 3.2.13 |
