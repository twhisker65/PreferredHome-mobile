BUILD_3.2.2.1_HOTFIX_README
===========================
PreferredHome Mobile — Hotfix Build 3.2.2.1
Generated: March 2026
Repo: PreferredHome-mobile (MAIN branch)

CHANGED FILES (in folder order)
---------------------------------
components/MenuSheet.tsx

WHAT CHANGED
------------
components/MenuSheet.tsx:
  - Version label at the bottom of the hamburger menu updated
    from "PreferredHome v3.2.2" to "PreferredHome v3.2.2.1".
  - No other changes to layout, buttons, or behaviour.

DEPLOY STEPS
------------
1. Copy components/MenuSheet.tsx from this ZIP into your local
   PreferredHome-mobile repo at:
   components/MenuSheet.tsx
   (overwrite existing file)
2. Run the Expo restart command below.
3. Test on your physical phone.
4. Confirm the version label at the bottom of the hamburger menu
   reads "PreferredHome v3.2.2.1".
5. Commit via GitHub Desktop using the commit message below.
6. Push to GitHub.
7. Sync the GitHub connection in your Claude Project
   (Claude Project → GitHub connection → Sync now).

EXPO RESTART COMMAND
--------------------
```
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel
```

TEST CHECKLIST
--------------
[ ] 1. Open hamburger menu — label reads "PreferredHome v3.2.2.1"
[ ] 2. Listings screen loads without error
[ ] 3. Home screen loads without error
[ ] 4. Calendar screen loads without error

COMMIT MESSAGE
--------------
```
Build 3.2.2.1 — Hotfix: wrap listings_get in try/except to fix HTTP 500 on all load screens
```

NOTE: The API repo must be deployed first (PreferredHome-api_Build_3.2.2.1_HOTFIX.zip)
before this mobile change will resolve the load errors. Deploy order:
  1. API ZIP → commit → push → Render deploy → verify /health
  2. Mobile ZIP → Expo restart → test on device → commit → push
