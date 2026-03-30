PreferredHome — Build 3.2.19
============================
Card overhaul — tap-to-expand icon row, status pill letter spacing, rent aligned to pill.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

CHANGED FILES (in folder order)
---------------------------------
components/StatusPill.tsx     — status pill text letter spacing tightened
components/ListingCard.tsx    — tap-to-expand icon row; rent+fees moved under status pill
app/(tabs)/listings.tsx       — expandedId state; collapse on tab blur; expanded/onCardPress wired

WHAT CHANGED IN THIS BUILD
----------------------------

1. components/StatusPill.tsx
   - Added letterSpacing: 0.8 to pill Text style.
   - Tightens character spacing so "Shortlisted" fits within the current pill width.
   - No other changes. All colors, sizes, and weights unchanged.

2. components/ListingCard.tsx
   - Added expanded (boolean) and onCardPress (function) props.
   - hideActions prop retained — Home screen behavior unchanged.
   - Card content row wrapped in Pressable. Tapping calls onCardPress (no-op if hideActions).
   - Icon row renders only when !hideActions AND expanded === true.
   - priceSummary (rent + fees) moved from right text column to left column, directly
     below the StatusPill, with textAlign: "center" to align with the pill.
   - No font sizes, weights, or other layout changed.

3. app/(tabs)/listings.tsx
   - Added expandedId state (string | null), default null (all cards collapsed).
   - useFocusEffect cleanup now resets expandedId to null when tab loses focus.
   - Each ListingCard receives expanded={expandedId === item.id} and
     onCardPress that toggles: tapping an expanded card collapses it;
     tapping a collapsed card expands it and implicitly collapses all others.

NO CHANGES TO:
   - app/(tabs)/index.tsx (Home cards keep hideActions={true} — icons permanently hidden)
   - PreferredHome-api (no backend changes)

DEPLOY STEPS
------------
Mobile repo only. No API or Render changes needed.

1. Copy the 3 changed files from this ZIP into your local repo:
     components/StatusPill.tsx
     components/ListingCard.tsx
     app/(tabs)/listings.tsx
2. Open terminal and run:
     cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

COMMIT MESSAGE
--------------
Build 3.2.19 - Tap-to-expand icon row on listing cards, status pill letter spacing, rent aligned to pill

TEST CHECKLIST
--------------
[ ] Listings screen — all cards open collapsed (no icon row visible)
[ ] Tap a card — icon row drops down below the card
[ ] Tap a different card — first card collapses, new card expands
[ ] Tap the same expanded card again — it collapses
[ ] All five icons (Heart, Compare, View, Edit, Trash) work correctly when expanded
[ ] Navigate to another tab and return to Listings — all cards are collapsed
[ ] Home screen — cards unchanged, icons remain hidden, no tap behavior
[ ] Status pill text is visibly tighter on all statuses
[ ] "Shortlisted" fits cleanly within the pill with no overflow
[ ] Rent + fees text appears below the status pill, centered, on every card
[ ] No red screen, all tabs render, listing data loads
