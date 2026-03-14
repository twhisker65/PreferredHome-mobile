BUILD 3.2.07 — Calendar Fix

FILES CHANGED (1)
- app/(tabs)/calendar.tsx

CHANGES

app/(tabs)/calendar.tsx
- Added currentMonth state (year + month), defaults to today's month.
- Wired onMonthChange on Calendar component: updates currentMonth when user
  taps the previous or next month arrows.
- Appointment list below calendar filtered to show only appointments in the
  currently displayed month. Navigate to March — see March. Navigate to
  February — see February.
- markedDates logic completely unchanged from Build 3.2.06.
- Empty state message: "No appointments for this month."
- All other logic, layout, and menu system unchanged.

COMMIT MESSAGE
Build 3.2.07 -- Calendar fix: appointment list filtered by displayed month

EXPO RESTART COMMAND
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear
