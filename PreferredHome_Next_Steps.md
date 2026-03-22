# PreferredHome — Next Steps
**Closing Out Build 3.2.11B | March 2026**

---

## Build 3.2.11B — Confirmed Stable

Build 3.2.11B is confirmed stable. All test steps passed. This session was a planning and document correction session only — no code was written.

---

## This Session — What Was Done

| Item | Detail |
|---|---|
| Data Architecture updated to V6 | Unit Type removed, Duplex removed, First/Last Month removed, Storage Rent and Move-in Fee confirmed, field renames documented, property type and lifestyle visibility rules fully documented, COSTS restructured into MONTHLY / UPFRONT |
| Drift Log updated | New entry added for the Data Architecture V5 sync gap — all discrepancies between spec and live code documented |
| Assistant Briefing updated | Reflects all V6 changes and confirmed Build 3.2.12 scope |
| Build 3.2.12 scope confirmed | Property Type visibility rules — same pattern as Lifestyle Toggles already built in 3.2.09 |

---

## Session Close Steps

1. Drop the following four files into the repo root (overwrite previous versions):
   - `PreferredHome_Data_Architecture.md`
   - `PreferredHome_Drift_Log.md`
   - `PreferredHome_Assistant_Briefing.md`
   - `PreferredHome_Next_Steps.md`
2. Commit in GitHub Desktop using the commit message below
3. Push to GitHub
4. Sync the Claude Project

---

## Commit Message

```
Closing out Build 3.2.11B — Data Architecture V6, Drift Log updated, Build 3.2.12 scope confirmed
```

---

## Immediate Next Step — Build 3.2.12

**Scope:** Three tasks, all in the same files.

1. Property Type visibility rules on Add, Edit, ViewPanel, Compare
2. Display all new 3.2.11 fields on ViewPanel
3. Display all new 3.2.11 fields on Compare

**Property Type visibility rules to implement:**

| Field | Apartment / Condo / Co-op | House / Townhouse |
|---|---|---|
| Apartment / Unit # | Show | Hide |
| Floor Number | Show | Hide |
| Top Floor | Show | Hide |
| Corner Unit | Show | Hide |
| Number of Floors | Show | Show |

**Pattern:** Same conditional logic already used for Lifestyle Toggles in Build 3.2.09. Read `propertyType` from draft state (Add/Edit) and from raw listing data (ViewPanel/Compare) and show/hide fields accordingly.

**New 3.2.11 fields to add to ViewPanel and Compare:**

| Field | Section |
|---|---|
| `numberOfFloors` | PROPERTY |
| `shortTermAvailable` | PROPERTY |
| `rentersInsuranceRequired` | PROPERTY |
| `heatingType` | FEATURES |
| `storageRent` | COSTS — Monthly |
| `brokerFee` | COSTS — Upfront |
| `moveInFee` | COSTS — Upfront |
| `roomTypes` | FEATURES |
| `privateOutdoorSpaceTypes` | FEATURES |
| `storageTypes` | FEATURES |

**Files in scope:** `app/(tabs)/add.tsx`, `app/edit.tsx`, `components/ViewPanel.tsx`, `app/(tabs)/compare.tsx`

---

## Open Issues — Carried Forward

| ID | Issue | Target |
|---|---|---|
| ISSUE 2 | API `totalMonthly` omits fees for some listings. Compare screen uses local calculation as workaround. | Build 3.2.13 |

---

## Deferred Items — Carried Forward

| Item | Target |
|---|---|
| `components/ViewPanel.tsx` — display all new fields from 3.2.11 | To be scheduled |
| `app/(tabs)/compare.tsx` — display new fields from 3.2.11 | To be scheduled |
