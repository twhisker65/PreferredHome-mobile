BUILD 3.2.05 — View Listing Detail Panel
Mobile repo only. No API changes.

════════════════════════════════════════════
FILES CHANGED (2) — in repository folder order
════════════════════════════════════════════

app/(tabs)/listings.tsx
  - Added viewPanelListing state (ListingUI | null)
  - Replaced placeholder Alert on onView with setViewPanelListing(item)
  - ViewPanel rendered at bottom of screen tree with topOffset and onClose
  - All filter logic, section logic, and all other handlers unchanged

components/ViewPanel.tsx  [NEW FILE]
  - Slide-out read-only detail panel triggered by Eye icon on listing card
  - Panel left edge = 102px from screen left (aligns buildingName with listing card text)
  - Panel top = bottom of header bar (topOffset prop)
  - Full-height ScrollView with all listing sections
  - Sections: PROPERTY / COSTS / FEATURES / TRANSPORTATION / SCHOOLS / LISTING / TIMELINE / NOTES
  - Animated slide from right: 180ms, useNativeDriver
  - Dim overlay on left portion closes panel on tap
  - Section headings: headingLabel style (uppercase, bold, with rule beneath)
  - buildingName: fontSize 17, fontWeight 900 (matches listing card)
  - Field labels: fontSize 12, bold, textPrimary
  - Field values: fontSize 12, textSecondary (matches listing card address)
  - Boolean badges (Preferred heart, Top Floor, Corner Unit, Furnished): blue ✓ if TRUE
  - Total Monthly: label left, amount right-aligned in blue
  - Total Startup: securityDeposit + applicationFee, shown in blue
  - Transport scores: blue circles, score only (no /100), label beneath
  - Schools: dark blue circle, score only (no /10), name bold white, Grades/Distance labels bold
  - Sections with no data are omitted (Schools hidden if no school names; Scores hidden if no data; Notes hidden if empty)

════════════════════════════════════════════
DEPLOY STEPS
════════════════════════════════════════════
1. Copy both files from this ZIP into your local mobile repo (overwrite existing)
2. Run Expo restart command below
3. Test on device using checklist below
4. Commit via GitHub Desktop using the commit message below
5. Push to GitHub
6. Sync GitHub in Claude Project — mobile repo only

════════════════════════════════════════════
EXPO RESTART COMMAND
════════════════════════════════════════════

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel

════════════════════════════════════════════
TEST CHECKLIST
════════════════════════════════════════════

View Panel — Open / Close
[ ] Tap Eye icon on any listing card — panel slides in from the right
[ ] Panel left edge aligns with the building name and address text on the card
[ ] Panel top starts at the bottom of the header bar
[ ] Tap anywhere on the dimmed left area — panel closes
[ ] Panel slides back out to the right on close

View Panel — Content
[ ] Building name appears large and bold (matches listing card style)
[ ] Full address shown below building name
[ ] Unit summary line shown (type · beds · baths · sqft · neighborhood)
[ ] Preferred heart is blue if listing is preferred
[ ] Top Floor / Corner Unit / Furnished show blue ✓ if TRUE, — if FALSE
[ ] All 8 cost fields displayed correctly
[ ] Total Startup = Security Deposit + Application Fee
[ ] Total Monthly label is on the left, dollar amount is right-aligned in blue
[ ] Features comma fields wrap correctly
[ ] AC Type / Laundry / Parking shown inline
[ ] Walk / Transit / Bike score circles appear in blue with score only (no /100)
[ ] Score labels appear below each circle
[ ] School rows show: dark blue circle with rating only, bold white name, bold Grades/Distance labels
[ ] Schools section hidden if no school data exists on listing
[ ] Listing section shows site, URL (in blue), contact, phone, email, lease
[ ] No Board Approval / No Broker Fee show blue ✓ or — correctly
[ ] Timeline shows all 4 dates in readable format
[ ] Notes section shows pros and cons with line breaks
[ ] Notes section hidden if both pros and cons are empty

Regression
[ ] Hamburger menu still opens from left
[ ] Filter panel still works and filters correctly
[ ] Edit listing still works
[ ] Add listing still works
[ ] Delete listing still works
[ ] Pull to refresh works

════════════════════════════════════════════
COMMIT MESSAGE
════════════════════════════════════════════

Build 3.2.05 -- View listing detail panel: slide-out from right, full read-only display of all listing fields across 8 sections (Property, Costs, Features, Transportation, Schools, Listing, Timeline, Notes)
