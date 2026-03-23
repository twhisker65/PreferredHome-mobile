# PreferredHome — All-Time Drift Log
**Updated: Build 3.2.13.1 | March 2026**

---

## How to Use This Log

At the start of every session, Claude must read this document in full. Before touching any file, Claude must state which past drift is most likely to recur in the current build and how it will be specifically avoided. New drifts discovered during a session are added to this log before the session closes.

---

## Drift Log

| Build | Type | What Happened | Rule to Follow |
|---|---|---|---|
| 3.2.02 / 3.2.03 | Unauthorized UI | Created a separate Unit sub-section that Thomas never requested. | The Freeze Rule. No Unit section. Unit fields appear at the end of the PROPERTY section only. |
| 3.2.05 | Freeze Rule | Changed screens that were not in build scope. | The Freeze Rule. Do not touch screens that are not in the build scope. |
| 3.2.06 | Code-Start Violation | Moved ahead with Roadmap V5 PDF generation without waiting for Thomas's explicit approval. | Wait for explicit confirmation before producing any deliverable. |
| 3.2.07 | Code-Start Violation | Wrote and delivered code before confirming understanding with Thomas. Did not perform the Code-Start Gate. | Section 27: Read all in-scope files. State working vs missing. Wait for explicit go-ahead. No exceptions. |
| 3.2.07 | Inaccurate File Read | Read calendar.tsx inaccurately — failed to identify that month navigation and blue circle markers were already working. Changed working code. | Read files carefully enough to distinguish working from missing before stating anything. |
| 3.2.07 | Surgical Edit Violation | Changed month navigation logic and marker logic that were already working correctly and not in scope. | Only touch code that is broken and in scope. Working code is frozen. |
| 3.2.08 / 3.2.09 | Hotfix Numbering | Reused the same hotfix number across multiple deliveries in a session instead of incrementing. | Each hotfix increments the fourth digit. Never reuse a hotfix number. |
| 3.2.09 | Code-Start Violation | Jumped into coding during discussion without waiting for explicit confirmation from Thomas. | Section 27: Never write code during discussion. Wait for Thomas's explicit go-ahead. |
| 3.2.10 | Session Awareness | Had no recollection that Tap-to-Contact (3.2.10) had been completed and treated it as an upcoming build. Thomas had to correct this. | Read the Assistant Briefing at session start. Never treat a completed build as upcoming. |
| 3.2.11B | Protocol Violation — Section 31 | Did not produce the Session Confirmation Checklist widget after the Begin Build Brief. Proceeded directly into layout discussion and then code without the 9-question interactive checklist. | Section 31 is mandatory after every Begin Build Brief without exception. Produce the widget. Wait for Thomas to complete it before writing any code. |
| 3.2.11B | Delivery Format | ZIP delivered with wrong filename format — used `Build_3_2_11B.zip` instead of `PreferredHome_Build_3_2_11B.zip`. | ZIP name must always be `PreferredHome_Build_X_X_XX.zip`. No dots. Prefix is mandatory. |
| Pre-3.2.12 | Document Sync Gap | Data Architecture V5 was not updated to reflect changes made during Build 3.2.11. Specifically: `unitType` renamed to `propertyType`; `acType` renamed to `coolingType`; Unit Type field removed entirely; Duplex removed from Property Type options; First Month and Last Month removed (folded into Security Deposit); Storage Rent and Move-in Fee added; property type field visibility rules not documented; lifestyle toggle visibility rules not documented. Data Architecture corrected to V6 during planning session for Build 3.2.12. | Governing documents must be updated to reflect the live codebase before the next build begins. Never let spec and code diverge across builds. |
| 3.2.12 | Delivery Format — Folder Structure | ZIP packaged files at `app/tabs/` instead of `app/(tabs)/`. Parentheses were dropped. This created a routing conflict that crashed the Edit screen. | Always verify folder names in ZIP output before delivery. Parentheses in folder names must be preserved exactly. |
| 3.2.12 | Invented API Function | Imported and called `fetchListing` in edit.tsx — a function that does not exist in `lib/api.ts`. This caused a Render Error crash on every Edit screen open. | Read `lib/api.ts` before writing any import that references it. Never invent function names. |
| 3.2.12 | Option Array Rewrite | Rewrote 8 option arrays (UTILITIES, UNIT_FEATURES, BUILDING_AMENITIES, PRIVATE_OUTDOOR_SPACE, STORAGE_TYPES, ROOM_TYPES, CLOSE_BY, PET_AMENITIES) with different values than the authorized 3.2.11B arrays. This was never instructed. | Read the current file's constants before touching them. Never change option arrays unless explicitly instructed. Arrays are frozen under the Freeze Rule. |
| 3.2.12 | Costs Field Order Changed | Changed the Costs section field order in add.tsx and edit.tsx without authorization. | Read the current file's section layout before touching it. Never reorder fields unless explicitly instructed. |
| 3.2.12 | Removed Compare Clear Button | Rewrote compare.tsx header section entirely instead of making surgical edits. The Clear button was part of the existing header and was removed by the rewrite. | Surgical edits only. Never rewrite a section that contains working UI that is not in scope. |
| 3.2.12.1 | Protocol Violation — Begin Build Brief | Produced and delivered hotfix 3.2.12.1 code immediately upon identifying the folder structure error — without producing a Begin Build Brief, Session Confirmation Checklist, or waiting for Thomas's go-ahead. | Begin Build Brief and Session Confirmation Checklist are mandatory before every delivery — builds and hotfixes without exception. |
| 3.2.12.1 | Protocol Violation — Screenshots | Thomas stated he was sending screenshots. Claude acknowledged it would wait, then in the same response began pre-empting the review by listing planned actions. | When waiting for information from Thomas, produce nothing further until the information arrives and has been reviewed together. |
| 3.2.13 | Code-Start Violation — Section 27 | After asking Thomas for go-ahead to write the hotfix, Claude immediately started writing code in the same response without waiting for Thomas's answer. Thomas had not said proceed. | Section 27 is absolute. After asking a question, Claude produces nothing further until Thomas explicitly replies. A question is not a go-ahead. |
| 3.2.13 | Out-of-Scope Constant Rename | Claude renamed `PARKING_OPTIONS` to `PARKING_TYPE_OPTIONS` in `config_constants.py` without any instruction to do so. This broke `helpers.py` which imports `PARKING_OPTIONS` by name, crashing the API immediately on Render. Claude had not read `helpers.py` before rewriting `config_constants.py`. | Section 36: Before changing any shared file, read every file that imports from it. List those files. Never rename, remove, or restructure any constant that was not broken and not in scope. |
| 3.2.13 | Incomplete Document Delivery | After Thomas instructed Claude to deliver complete updated Drift Log and Protocols documents, Claude delivered snippet additions instead of complete files. Thomas never manually merges documents. | Every governing document delivered must be a complete file. No snippets. No append instructions. No partial files. Ever. |
