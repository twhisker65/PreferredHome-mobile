BUILD 3.2.04 — Filter Panel (Listings Screen)
Mobile repo only. No API changes.

════════════════════════════════════════════
FILES CHANGED (3) — in repository folder order
════════════════════════════════════════════

app/(tabs)/listings.tsx
  - Replaced filter SidePanel placeholder shell with FilterPanel component
  - Added FilterState type and appliedFilters state
  - applyFilters() function filters both Preferred and Candidates sections
  - Filter icon in TopBar turns blue when any filter is active
  - FILTERS ACTIVE blue banner rendered below header when active
  - FilterPanel conditionally mounted on filterOpen; unmounts on close
  - useSafeAreaInsets added to calculate exact topOffset for panel position

components/TopBar.tsx
  - Added optional rightIconColor prop (string)
  - Right icon now uses rightIconColor if provided, else defaults to textPrimary
  - No other changes

components/FilterPanel.tsx  [NEW FILE]
  - Drop-down panel: slides down from below TopBar, right-aligned
  - Width = half screen width
  - Height = auto (grows with content, capped at 85% screen height)
  - Animated open: opacity 0→1 + translateY -14→0 over 180ms
  - Backdrop: full-screen transparent Pressable behind panel to close on tap outside
  - Manages own draft state; only commits to parent on Apply

  Filters included:
    STATUS       — multi-select chips; Select All / Clear convenience buttons
    UNIT TYPE    — multi-select chips (Rental, Condo, Co-op, Townhouse, House)
    BROKER FEE   — single-select row: Both / No Fee / With Fee (default: Both)
    PREFERRED    — single-select row: Both / Yes (default: Both)
    MAX RENT     — numeric text input (shows all listings at or under amount)
    ZIP CODE     — multi-select chips from unique zip codes in current listings data
                   (section hidden if no zip data exists in listings)

  Buttons:
    Clear  — resets all filters to defaults, closes panel
    Apply  — commits draft filters to listings screen, closes panel (blue fill)

  isFiltersActive logic:
    - Status: active only if some (not all, not none) statuses are selected
    - Unit Type: active only if some (not all, not none) types are selected
    - Broker Fee: active if not "both"
    - Preferred: active if not "both"
    - Max Rent: active if field is not empty
    - Zip Code: active if any zip codes are selected

════════════════════════════════════════════
FILES CONFIRMED UNCHANGED
════════════════════════════════════════════
components/SidePanel.tsx
components/MenuSheet.tsx
app/(tabs)/add.tsx
app/(tabs)/index.tsx
app/(tabs)/calendar.tsx
app/edit.tsx
All API repo files

════════════════════════════════════════════
COMMIT MESSAGE
════════════════════════════════════════════

Build 3.2.04 — Filter panel: drop-down from header, Status/UnitType/BrokerFee/Preferred/MaxRent/ZipCode filters, Apply + Clear buttons, active filter banner and blue icon indicator

════════════════════════════════════════════
EXPO RESTART COMMAND
════════════════════════════════════════════

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel
