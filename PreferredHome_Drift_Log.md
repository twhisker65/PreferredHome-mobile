# PreferredHome — All-Time Drift Log
**March 2026**

---

## Purpose

This log records every confirmed drift, protocol violation, and unauthorized change made by Claude across the life of the PreferredHome project. It is a permanent, cumulative record — entries are never removed. Claude must read this document at session start and explicitly state, before writing any code, which past drift is most relevant to the current build and how it will be avoided.

---

## Active Drift Warnings — Carry Forward Every Session

| ID | Rule |
|---|---|
| DRIFT 1 | No Unit section. Unit fields appear at the end of the PROPERTY section only. Never create a separate Unit sub-section. |
| DRIFT 5 | Apply `boolStr()` to every file that sends a payload to the API. Never apply it to only one file when the same pattern exists in others. |
| DRIFT 6 | No structural changes to any screen without explicit authorisation from Thomas. If in doubt — ask first. |
| DRIFT 7 | Read the original spec before touching any form structure. Never infer the structure from memory. |

---

## Chronological Drift Log

| Build | Category | What Claude Did Wrong | Rule Violated |
|---|---|---|---|
| 3.1.11 / 3.1.12 | Surgical Edit Violation | Rewrote calendar.tsx entirely instead of making targeted changes to only the broken behaviour. | Make surgical edits only. Never rewrite a file section that is not in scope. |
| 3.1.11 | Code-Start Violation | Executed all changes at once without waiting for step-by-step confirmation from Thomas. | Wait for explicit confirmation before writing code. |
| 3.1.14 | Delivery Format | Files delivered not in repository folder order. | All files must be listed in repository folder order in every delivery. |
| 3.1.15.3 / .4 | Deployment Failure | Builds 3.1.15.3 and 3.1.15.4 were delivered but never actually reached the GitHub repo. Claude did not verify commits were pushed. | Always verify deployment via the /health endpoint. Confirm repo state before declaring stable. |
| 3.1.15 | Premature Deliverable | Began producing closing PDF documents before the build was confirmed stable by Thomas. | Closing documents are produced ONLY after Thomas confirms build stability. Never before. |
| 3.1.15 | Delivery Format | Delivered individual code files instead of a correctly structured ZIP. | Every delivery must be a ZIP with correct repository folder structure. No individual files ever. |
| 3.2.01 | Delivery Format | Delivered individual code files instead of a ZIP. | Deliverable is always a ZIP with correct folder structure. |
| 3.2.01 | Premature Deliverable | Began producing closing PDFs before build was confirmed stable. | Closing documents only after Thomas confirms stability. |
| 3.2.02 | Delivery Format | Delivered an invalid ZIP containing patch instructions instead of complete files. Thomas never manually edits code. | Every changed file must be complete and in the ZIP. No patch instructions ever. |
| 3.2.02 | Delivery Format | Put the commit message and Expo restart command inside the README instead of as copyable code blocks in the chat. | Commit message and Expo restart command must always appear as copyable code blocks in the chat AND in the README. |
| 3.2.02 | Unauthorized Change | Invented a separate Unit section in add.tsx that did not exist in the original codebase. | The Freeze Rule. Never invent UI sections. |
| 3.2.02 | Repeat Violation | Continued making structural errors in add.tsx after correction — same violation on multiple attempts. | When corrected, fix the exact issue. Do not repeat the same structural error. |
| 3.2.03 | Unauthorized Change | Invented an unauthorized Unit section again (same as 3.2.02) without instruction. | DRIFT 1. No Unit section. This is a standing rule. |
| 3.2.03 | Unauthorized Change | Reordered fields without authorization. Field order is frozen. | DRIFT 6 and DRIFT 7. Read the spec. Never reorder fields. |
| 3.2.03 | Incomplete Fix | Applied boolean serialization fix (boolStr) to only one file when the same pattern existed in multiple files. | DRIFT 5. Apply boolStr() to every file that sends a payload to the API. |
| 3.2.03 | Incomplete Fix | Fixed a bug in the mobile repo only — did not check or fix the API repo even though the bug spanned both. | When a bug spans both repos, both must be fixed in the same build. |
| 3.2.03 / 3.2.04 | Visual Error | Closing PDFs used near-white text colors copied from the app's dark theme. Text was invisible on white paper. | Closing documents always use black body text on white backgrounds. Never copy color values from the app theme. |
| 3.2.06 | Unauthorized Change | Made unauthorized changes to the Home screen Base Rent Snapshot — added criteriaData and replaced the original four-pill layout without instruction. | The Freeze Rule. Do not touch screens that are not in the build scope. |
| 3.2.06 | Code-Start Violation | Moved ahead with Roadmap V5 PDF generation without waiting for Thomas's explicit approval. | Wait for explicit confirmation before producing any deliverable. |
| 3.2.07 | Code-Start Violation | Wrote and delivered code before confirming understanding with Thomas. Did not perform the Code-Start Gate. | Section 27: Read all in-scope files. State working vs missing. Wait for explicit go-ahead. No exceptions. |
| 3.2.07 | Inaccurate File Read | Read calendar.tsx inaccurately — failed to identify that month navigation and blue circle markers were already working. Changed working code. | Read files carefully enough to distinguish working from missing before stating anything. |
| 3.2.07 | Surgical Edit Violation | Changed month navigation logic and marker logic that were already working correctly and not in scope. | Only touch code that is broken and in scope. Working code is frozen. |
| 3.2.08 / 3.2.09 | Hotfix Numbering | Reused the same hotfix number across multiple deliveries in a session instead of incrementing. | Each hotfix increments the fourth digit. Never reuse a hotfix number. |
| 3.2.09 | Code-Start Violation | Jumped into coding during discussion without waiting for explicit confirmation from Thomas. | Section 27: Never write code during discussion. Wait for Thomas's explicit go-ahead. |
| 3.2.10 | Session Awareness | Had no recollection that Tap-to-Contact (3.2.10) had been completed and treated it as an upcoming build. Thomas had to correct this. | Read the Assistant Briefing at session start. Never treat a completed build as upcoming. |
| 3.2.11B | Protocol Violation — Section 31 | Did not produce the Session Confirmation Checklist widget after the Begin Build Brief. Proceeded directly into layout discussion and then code without the 9-question interactive checklist. | Section 31 is mandatory after every Begin Build Brief without exception. Produce the widget. Wait for Thomas to complete it before writing any code. |
| 3.2.11B | Delivery Format | ZIP delivered with wrong filename format — used `Build_3_2_11B.zip` instead of `PreferredHome_Build_3_2_11B.zip`. Section 6 has now been corrected to enforce underscore-only format. | ZIP name must always be `PreferredHome_Build_X_X_XX.zip`. No dots. Prefix is mandatory. |

---

## How to Use This Log

At the start of every session, Claude must read this document in full. Before touching any file, Claude must state which past drift is most likely to recur in the current build and how it will be specifically avoided. New drifts discovered during a session are added to this log before the session closes.
