# PreferredHome — All-Time Drift Log
**Updated: Build 3.2.15 Revert | March 2026**

---

## How to Use This Log

At the start of every session, Claude reads this document. Before touching any file, Claude states which past drift is most likely to recur in the current build and how it will be avoided.

---

## Drift Log

| Build | Type | What Happened | Rule to Follow |
|---|---|---|---|
| 3.2.02 / 3.2.03 | Unauthorized UI | Created a separate Unit sub-section Thomas never requested. | Freeze Rule. No Unit section. Unit fields appear at end of PROPERTY section only. |
| 3.2.05 | Freeze Rule | Changed screens not in build scope. | Freeze Rule. Do not touch screens not in scope. |
| 3.2.06 | Code-Start Violation | Moved ahead with deliverable without waiting for explicit approval. | Wait for ENGAGE before producing any deliverable. |
| 3.2.07 | Code-Start Violation | Wrote and delivered code before confirming understanding. Did not perform gate. | Read all in-scope files. State working vs missing. Wait for ENGAGE. |
| 3.2.07 | Inaccurate File Read | Read calendar.tsx inaccurately — failed to identify working code. Changed working code. | Read files carefully enough to distinguish working from missing before stating anything. |
| 3.2.07 | Surgical Edit Violation | Changed month navigation and marker logic that were working and not in scope. | Only touch code that is broken and in scope. Working code is frozen. |
| 3.2.08 / 3.2.09 | Hotfix Numbering | Reused same hotfix number across multiple deliveries. | Each hotfix increments the fourth digit. Never reuse a hotfix number. |
| 3.2.09 | Code-Start Violation | Jumped into coding during discussion without waiting for ENGAGE. | Never write code during discussion. Wait for ENGAGE. |
| 3.2.10 | Session Awareness | Treated a completed build as upcoming. Thomas had to correct this. | Read current state at session start. Never treat a completed build as upcoming. |
| 3.2.11B | Protocol Violation | Did not produce Session Confirmation Checklist after Begin Build Brief. | All mandatory gates must be completed before writing code. |
| 3.2.11B | Delivery Format | ZIP delivered with wrong filename format. | Follow exact ZIP naming convention including HOTFIX where applicable. |
| 3.2.12 | Option Arrays Changed | Changed option arrays (UTILITIES, UNIT_FEATURES etc.) without instruction. | Option arrays are frozen under the Freeze Rule. |
| 3.2.12 | Costs Field Order Changed | Changed Costs section field order without authorisation. | Read current file layout before touching it. Never reorder fields unless explicitly instructed. |
| 3.2.12 | Removed Compare Clear Button | Rewrote compare.tsx header entirely instead of surgical edit. Clear button removed. | Surgical edits only. Never rewrite a section containing working UI not in scope. |
| 3.2.12.1 | Protocol Violation | Delivered hotfix code immediately without Begin Build Brief or waiting for go-ahead. | Begin Build Brief and go-ahead required before every delivery — builds and hotfixes. |
| 3.2.12.1 | Protocol Violation | Acknowledged waiting for screenshots then immediately began pre-empting the review. | When waiting for information, produce nothing further until it arrives. |
| 3.2.13 | Code-Start Violation | After asking for go-ahead, immediately started writing code in same response. Thomas had not said proceed. | ENGAGE is the only go-ahead. After asking a question, produce nothing further until Thomas replies and says ENGAGE. |
| 3.2.13 | Out-of-Scope Constant Rename | Renamed PARKING_OPTIONS without instruction. Broke helpers.py. API crashed on Render. | Before changing any shared file, read every file that imports from it. Never rename constants not in scope. |
| 3.2.13 | Incomplete Document Delivery | Delivered snippet additions instead of complete files. | Every governing document must be a complete file. No snippets. No append instructions. |
| 3.2.14 | Sub-Components Inside Main Function | Defined Section, Field, SelectRow, Toggle, MultiRow, DateRow inside the main export function. Caused keyboard to dismiss after every keystroke. | Sub-components must always be defined outside the main export function. |
| 3.2.14 | Dual-Repo ZIP Structure | Mobile and API files delivered in same folder inside ZIP instead of separate named folders. | ZIP must contain PreferredHome-mobile/ and PreferredHome-api/ as separate folders. Never mixed. |
| 3.2.14 | Missing HOTFIX in ZIP name | Hotfix ZIP delivered without HOTFIX in the filename. | ZIP naming: PreferredHome_Build_X_X_XX_HOTFIX.zip for all hotfixes without exception. |
| 3.2.15 | Session Incomplete / Stalled on Restart | Previous session ran out of usage mid-delivery without completing the build. On restart, read excessively and stalled — Thomas had to prompt ENGAGE directly to unblock. | If context from a prior session is available (transcript or summary), read it efficiently and move directly to delivery. Do not re-read everything from scratch. Do not stall. |
| 3.2.15 | Missing Closing Items | Delivered ZIP without commit message, Expo restart command, or Render health check link. Thomas had to request them separately. | Every delivery includes commit message, Expo restart command, and Render health check link in the same response as the ZIP. No exceptions. |
| 3.2.15 | Freeze Rule — Option Arrays | Rewrote PROPERTY_TYPES, COOLING_TYPES, and PARKING arrays from scratch instead of copying from source. Three arrays broken. | Option arrays are frozen. Copy them exactly from the prior build. Never rewrite from memory. |
| 3.2.15 | **DATA CORRUPTION — Google Sheet** | recalculate-all called update_listing() per listing in a loop. Each update_listing() does a full ws.clear() then ws.append_rows(). Multiple concurrent writes caused the entire sheet to be appended to itself repeatedly — all listing data duplicated. Thomas had to manually delete the corrupted rows. Session usage went from ~2% to ~48% due to the full failure cascade. | NEVER call any Sheets write function in a loop. Any multi-row operation must: (1) load the sheet once, (2) mutate all rows in memory, (3) write the entire DataFrame once. Before writing any endpoint that touches Sheets more than once, stop and re-examine the write pattern. |
| 3.2.15.1 | Unauthorized Scope Expansion | Diagnosed compare scroll as caused by ProfilePanel Modal. Changed ProfilePanel without instruction to fix a screen never in scope. This introduced a new break and cascaded into further hotfixes. | Never diagnose problems in out-of-scope screens. Never change a file to fix a screen that was not broken before the build started. The only permitted fix is the one Thomas specifies. |
| 3.2.15.1 | Invented Root Cause | Told Thomas the Modal in ProfilePanel was causing the compare scroll bug. This was wrong. The actual cause was the Sheets data corruption from the same build. Invented diagnosis led to unauthorized file changes and two additional broken hotfixes. | Do not diagnose root causes in out-of-scope components. If a screen breaks after a build, the cause is in the files that were changed — look there first. |
| 3.2.15.2 | Cascading Hotfix Failure | After 3.2.15.1 introduced new breaks via unauthorized ProfilePanel changes, 3.2.15.2 attempted to fix those — creating a third consecutive broken delivery. The entire 3.2.15 line had to be fully reverted. | When a hotfix introduces new breaks, stop immediately. Do not attempt another hotfix. Revert to last stable state and start over correctly. |

---

## Active Drift Warnings

| ID | Rule |
|---|---|
| DRIFT 1 | No Unit sub-section. Unit fields appear at end of PROPERTY section only. |
| DRIFT 5 | Apply boolStr() to every file that sends a payload — not just the file in focus. |
| DRIFT 6 | No structural changes to any screen without explicit authorisation. |
| DRIFT 7 | Read the original spec before touching any form structure. Never infer from memory. |
| DRIFT 8 | Never invent API functions. Read lib/api.ts before writing any import that references it. |
| DRIFT 9 | Before changing any shared file, read every file that imports from it. |
| DRIFT 10 | Sub-components must be defined outside the main export function. Never inside. |
| DRIFT 11 | Both repos in same ZIP must be in separate named folders — never mixed. |
| DRIFT 12 | Every delivery must include commit message, Expo restart command, and Render health check link in the same response as the ZIP. |
| DRIFT 13 | Option arrays are frozen. Copy them exactly from the prior build. Never rewrite from memory. |
| DRIFT 14 | NEVER call any Sheets write function in a loop. Load once, mutate in memory, write once. This is non-negotiable — violation causes data corruption. |
| DRIFT 15 | Never change an out-of-scope file to fix a screen that was not broken before the build. If a screen breaks, the cause is in the files that were changed — look there only. |
| DRIFT 16 | When a hotfix introduces new breaks, stop. Do not hotfix the hotfix. Revert to last stable state. |

---

## Protocol Version History

| Version | Key Changes |
|---|---|
| V1–V10 | Initial protocols. Roles, delivery, build numbering, boolean standards, freeze rule. |
| V11 | Pre-deploy /health check. Boolean standards. Two closing docs per session. |
| V12 | STOP-DRIFT protocols. README naming. Commit format. Pre-Delivery Checklist. Hotfix fourth digit. |
| V13 | Code-Start Confirmation Gate. |
| V14 | Code-Start Gate reinforced. HOTFIX naming rule. Hotfix number reuse prohibition. |
| V15 | Drift Log. Begin Build Brief + Do Not Touch list. Session Confirmation Checklist. Diff Declaration. Pre-Test Declaration. |
| V15.1 | All documents converted to .md format. |
| V16 | ZIP name format corrected. |
| V17 | Dependency Check Rule. Punishment Protocol. Complete Document Delivery Rule. |
| V18 | Commit message format locked. |
| V19 | PDF format standard. Dual format delivery rule. |
| V20 | Full consolidation. ENGAGE rule. Lean Begin Build Brief. Session Confirmation Checklist eliminated. Assistant Briefing eliminated — folded into Current State section. Next Steps simplified to 4 points. PDFs eliminated — MD only. ZIP dual-repo folder structure rule. Sub-component definition rule. README overwrites — no build number in filename. Project Strategy moved out of active repo sync. |

---

## Current State

**Stable build:** 3.2.14.1 — reverted from 3.2.15 cascade. All screens confirmed working.

**Google Sheet:** Duplicated rows caused by 3.2.15 data corruption were manually deleted by Thomas.

**Open issues:** None.

**Next build:** 3.2.15 — Commute Calculation. To be rebuilt correctly from scratch next session.
