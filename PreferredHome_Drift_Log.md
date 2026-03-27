# PreferredHome — All-Time Drift Log
**Updated: Build 3.2.14.1 | March 2026**

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
