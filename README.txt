PreferredHome — Build 3.2.20 Closeout Hotfix
=============================================
Fix: PREFERRED, CANDIDATES, and TOP 3 section headers restored.
Fix: sectionTitle strict list removed from typography.ts comment.
Mobile repo only. No API changes. No Render deploy required.
Generated: March 2026

WHAT HAPPENED
-------------
The Closeout removed headingLabel from typography.ts. Two files —
listings.tsx and index.tsx — still imported and used headingLabel
for their SectionHeader / TOP 3 labels, causing them to lose styling.
This hotfix migrates those two remaining references to textStyles.sectionTitle.

sectionTitle strict list also removed per Thomas's direction —
sectionTitle is now for any section or group heading at developer's discretion.

CHANGED FILES (in folder order)
---------------------------------
app/(tabs)/index.tsx        — TOP 3 label: headingLabel → textStyles.sectionTitle
app/(tabs)/listings.tsx     — SectionHeader: headingLabel → textStyles.sectionTitle
styles/typography.ts        — strict list comment removed from sectionTitle

DEPLOY STEPS
------------
1. Copy all 3 changed files from this ZIP into your local repo,
   overwriting the existing files at the same paths:
     app/(tabs)/index.tsx
     app/(tabs)/listings.tsx
     styles/typography.ts
2. Run Expo restart:

cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear

3. Confirm test checklist below on device.
4. Commit via GitHub Desktop using the commit message below.
5. Push to GitHub.
6. Go to Claude Project -> click Sync now on the GitHub connection.

COMMIT MESSAGE
--------------
Build 3.2.20 Closeout Hotfix - Restore section headers, remove sectionTitle strict list

TEST CHECKLIST
--------------
[ ] App loads with no red screen
[ ] Listings screen: PREFERRED and CANDIDATES headers bold white uppercase
[ ] Home screen: TOP 3 header bold white uppercase
[ ] All other screens unchanged
[ ] No TypeScript errors in Expo terminal
