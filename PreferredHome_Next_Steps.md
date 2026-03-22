# PreferredHome — Next Steps
**Closing Out Build 3.2.12.3 | March 2026**

---

## Build 3.2.12.3 — Confirmed Stable

Build 3.2.12.3 is confirmed stable. All 11 test items passed.

---

## This Session — What Was Done

| Item | Detail |
|---|---|
| Build 3.2.12.3 delivered | app/(tabs)/add.tsx only |
| Change 1 | 8 option arrays restored to exact 3.2.11B values — identical to fix applied in edit.tsx (3.2.12.2) |
| Change 2 | Costs section field order restored to exact 3.2.11B sequence — identical to fix applied in edit.tsx (3.2.12.2) |

---

## Session Close Steps

1. Drop the following files into the repo root (overwrite previous versions):
   - `PreferredHome_Assistant_Briefing.md`
   - `PreferredHome_Next_Steps.md`
2. Commit in GitHub Desktop using the commit message below.
3. Push to GitHub.
4. Sync the Claude Project.

---

## Commit Message

```
Closing out Build 3.2.12.3 -- add.tsx stable, closing docs updated
```

---

## Immediate Next Step — Build 3.2.12.4

**Scope:** `app/(tabs)/compare.tsx` only.

**Three changes:**
1. Restore Clear button — right side of the mode-toggle row. Card/table icons centered, Clear button on the right. Tapping it deselects all listings.
2. Add 7 missing rows to CARD_ROWS — Utilities Included, Unit Features, Rooms, Outdoor Space, Storage, Building Amenities, Close By. These are already in TABLE_ROWS. Follow TABLE_ROWS order for placement.
3. Fix label truncation — increase `LABEL_W` from `100` to `120` so long labels fit without wrapping.

**Test checklist (pre-written):**
- [ ] 1. Open Compare screen — Clear button visible on the right of the header row.
- [ ] 2. Tap Clear — all listings deselected, empty state shown.
- [ ] 3. Re-add listings. Open Card view — each card shows: Utilities Included, Unit Features, Rooms, Outdoor Space, Storage, Building Amenities, Close By.
- [ ] 4. Switch to Table view — label column text is not cut off on any row including "Building Amenities".
- [ ] 5. Mode toggle (card/table icons) still works — no regression.
- [ ] 6. Pet Amenities row hidden unless pets toggle is on — no regression.

---

## Open Issues — Carried Forward

| ID | Issue | Target |
|---|---|---|
| ISSUE 2 | API `totalMonthly` omits fees for some listings. Compare screen uses local calculation as workaround. | Build 3.2.13 |
