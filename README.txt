PreferredHome — README
Build 3.2.22 | April 2026

=============================================================
CURRENT STABLE BUILD
=============================================================
Build 3.2.22 — Android APK Build Configuration

=============================================================
WHAT CHANGED IN THIS BUILD
=============================================================
eas.json
  - Added "android": { "buildType": "apk" } to the preview profile.
  - Without this, EAS defaults to AAB on Android, which cannot be
    sideloaded to a physical device for local testing.
  - No other profiles were modified.

=============================================================
WHAT WAS NOT CHANGED
=============================================================
- No UI changes.
- No screen, component, token, or shared file changes.
- No routing, schema, storage, or data architecture changes.
- No API repo changes.
- app.json was not changed — all required Android config was already present.
- package.json was not changed.

=============================================================
EAS BUILD COMMAND
=============================================================
Run this from the PreferredHome-mobile repo root:

  eas build -p android --profile preview

After the build completes (typically 10–20 min), download the .apk
from the Expo dashboard link or the CLI output URL. Install directly
on your Android device by sideloading.

=============================================================
PRE-BUILD CHECKLIST
=============================================================
1. Confirm you are logged in to EAS:
     eas login
2. Confirm you are on the main branch with Build 3.2.22 committed.
3. Run the build command above.

=============================================================
TEST CHECKLIST
=============================================================
1. EAS CLI confirms profile "preview" is found and build type is APK.
2. Build completes on Expo servers — no errors.
3. APK downloads successfully from the dashboard or CLI link.
4. APK installs on Android device via sideload.
5. App launches and all screens behave identically to the
   last stable Expo Go tunnel session (Build 3.2.21).

=============================================================
REPO STATE
=============================================================
Mobile repo:  twhisker65/PreferredHome-mobile — main branch
API repo:     twhisker65/PreferredHome-api — unchanged, not touched

=============================================================
UP NEXT
=============================================================
Build 3.2.22 APK testing on physical device.
V4 — Canonical Data Model (first step: schema rename buildingName → propertyName,
pending explicit approval).
