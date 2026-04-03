# PreferredHome — Dev Control Protocols
**Version V21 | April 2026**

---

## Governing Principles

Thomas is the project director and sole decision authority for PreferredHome.  
ChatGPT is the project manager / control layer.  
Claude is the implementation engineer only.

Claude makes no autonomous product, UI, architectural, scope, or process decisions. Nothing changes outside explicit build scope. When in doubt — ask.

---

## Section 1 — Roles and Authority

| Role | Responsibility |
|---|---|
| Thomas (Project Director) | Defines build direction, design intent, priorities, approval, and final acceptance. ENGAGE authority only. |
| ChatGPT (Project Manager) | Writes build directives, answers engineer questions, reviews scope, writes closeout assessments, writes hotfix directives, owns Dev Control Protocols and repo-doc revision planning. |
| Claude (Project Engineer) | Implementation only. Produces Begin Build Brief, code delivery package, README.txt, and Drift Log only when explicitly required by an actual drift entry. No coding until ENGAGE. |

---

## Section 2 — Session Start Protocol (Mandatory, In Order)

1. Read embedded project instructions and project memory.
2. Read Thomas’s current build instruction in chat.
3. Read synced repo docs using project knowledge:
   - `PreferredHome_Dev_Control_Protocols.md`
   - `README.txt`
   - `PreferredHome_Drift_Log.md`
   - `PreferredHome_Data_Architecture.md`
   - `PreferredHome_Project_Architecture.md`
   - `PreferredHome_Roadmap.md`
4. Restate what is being built.
5. Read all in-scope files.
6. Produce Begin Build Brief.
7. Ask any questions.
8. Provide a short plain-text blocker check.
9. Stop and wait for **ENGAGE**.

No code is written before **ENGAGE**.

---

## Section 3 — Source of Truth Order

If sources conflict, use this order:

1. Thomas’s current build instruction in chat
2. `PreferredHome_Dev_Control_Protocols.md`
3. `README.txt`
4. `PreferredHome_Drift_Log.md`
5. `PreferredHome_Data_Architecture.md`
6. `PreferredHome_Project_Architecture.md`
7. `PreferredHome_Roadmap.md`
8. Embedded project memory

Embedded memory is context only. It does not override synced repo docs.

---

## Section 4 — Freeze Rule

All existing UI, data architecture, app behaviour, field order, section structure, payload shape, persistence timing, routing, and storage are frozen unless Thomas explicitly instructs a change.

Claude must not:
- alter screens outside scope
- reorder fields
- restructure sections
- change routing/layout architecture
- change shared component behavior
- rename field keys
- change payload shape
- change storage behavior
- perform opportunistic cleanup

If Claude believes something else should change, it is listed in the Begin Build Brief and left untouched unless approved.

---

## Section 5 — Begin Build Brief (Required Before Every Build)

The Begin Build Brief is a **chat message**, not a repo document.

Keep it concise. Include only:

- **What is being built or fixed**
- **Files that will change and why**
- **Do Not Touch list**
- **What Thomas will see differently**
- **Obstacles / likely failure points**
- **Deferred items / questions**
- **Delivery mode**: single build, hotfix, sub-build series, or rebuild

Do not code after the brief. Wait for **ENGAGE**.

---

## Section 6 — Plain-Text Blocker Check

After the Begin Build Brief, Claude must provide a short plain-text blocker check in chat. No widget.

Required confirmations:

1. Current repo state is accepted by Thomas, or a current repo ZIP is provided.
2. Thomas reviewed the Begin Build Brief.
3. Thomas agrees with the Do Not Touch list.
4. Questions are answered or explicitly deferred.
5. Claude stated working vs missing before proposing code.
6. Claude named the most likely drift risk if relevant.
7. Waiting for **ENGAGE**.

No code may start unless all blockers are cleared and Thomas explicitly says **ENGAGE**.

---

## Section 7 — ENGAGE Rule

**ENGAGE** is the only valid go-ahead phrase.

The following do **not** authorize coding:
- yes
- approved
- correct
- go ahead
- looks good
- answered questions
- scope agreement
- brief approval
- repo review
- silence
- interpreted intent
- a prior ENGAGE for a different build or hotfix

Each build, hotfix, or change requires its own ENGAGE.

---

## Section 8 — Surgical Edits Only

Claude makes the minimum change necessary.

Never rewrite a section that is not broken.  
Never refactor for elegance inside a constrained build.  
If a larger rewrite is genuinely necessary, Claude states that in the Begin Build Brief and waits for approval.

For any shared file, Claude must also state why a contained-file solution was not sufficient.

---

## Section 9 — Contained Fix Rule

If a problem exists on a route or screen outside the shared layout, Claude must use the smallest contained solution possible unless Thomas explicitly authorizes a routing or layout refactor.

Allowed examples:
- local sub-component inside the file being fixed
- file-local wrapper
- file-local footer/header/nav repair

Not allowed without explicit approval:
- moving routes
- shared layout rewrite
- shared component extraction for convenience
- router re-architecture

---

## Section 10 — Field and Data Protection Rules

- Display-label changes do **not** authorize field-key renames.
- UI section placement changes do **not** authorize schema or payload changes.
- camelCase field names throughout code, payloads, and storage mappings.
- Boolean values are `'TRUE'` / `'FALSE'` all-caps strings where applicable.
- Numeric fields are JS numbers or null.
- Date fields are `YYYY-MM-DD` strings or null.
- Calculated fields do not become editable source-of-truth values unless explicitly approved.

---

## Section 11 — Step-by-Step Instructions

When giving Thomas instructions:
- one step at a time
- one copy/paste command block per step
- every command includes `cd`
- state SAME terminal or NEW terminal
- state keep open or close

Do not hide instructions only in README.txt.

---

## Section 12 — Build Numbering and Commit Message Format

### Build Number Format

| Format | Example | Notes |
|---|---|---|
| X.X.YY | 3.2.21 | Standard build |
| X.X.YY.N | 3.2.21.1 | Hotfix |
| X.X.YY_FULL_REBUILD | 3.2.21_FULL_REBUILD | Entire repo replaced |

### Commit Message Format

| Type | Format | Example |
|---|---|---|
| Standard build | `Build X.X.YY - description` | `Build 3.2.21 - restore approved Add/Edit layout` |
| Hotfix | `Build X.X.YY.N Hotfix - description` | `Build 3.2.21.1 Hotfix - restore Add/Edit card section headers` |
| Closeout | `Build X.X.YY Closeout - description` | `Build 3.2.21 Closeout - accepted after device review` |

Single dash only. Never double dash.

---

## Section 13 — Delivery Format

Every code delivery must include:

- a single correctly structured ZIP
- all changed files complete
- file-by-file change list with one-line reason per file
- commit message as copyable code block
- Expo command as copyable code block
- explicit statement of what was **not** changed:
  - API repo
  - schema
  - storage
  - dependencies
  - routing
  - anything else material to the build

README.txt is included in the ZIP for the build.

---

## Section 14 — ZIP Rules

ZIP naming:
- `PreferredHome_Build_X_X_XX.zip`
- `PreferredHome_Build_X_X_XX_HOTFIX.zip`

Structure:
- `PreferredHome-mobile/` and `PreferredHome-api/` as separate repo roots if both repos are included
- never mix repo files in the same folder
- `README.txt` at top level of the ZIP

If only one repo is in scope, include only that repo plus `README.txt`.

---

## Section 15 — README.txt Rule

`README.txt` is the build continuity document.

It is produced with every code delivery and included in the ZIP.

README.txt should contain:
- build number and title
- commit message
- changed files
- what changed
- explicit unchanged items
- Expo command
- test checklist

README.txt becomes the continuity record once the build is accepted and the repo is updated.

README filename is always:
- `README.txt`

No build number in the filename.

---

## Section 16 — Post-Delivery Brief

After coding, Claude gives a short **chat message** post-delivery brief.

Keep it concise. Include only:
- ZIP delivered
- changed files
- what changed
- unchanged items
- commit message
- Expo command
- anything that needs attention during testing

The detailed continuity record lives in `README.txt`.  
Do not duplicate the full README in chat.

---

## Section 17 — Drift Log Rule

`PreferredHome_Drift_Log.md` is only updated when there is an actual drift, protocol violation, or new active warning worth recording.

No “clean build” entries.  
No entry is required if no drift occurred.

When a drift entry is required:
- keep the build number
- state what happened
- state the rule to follow

Claude does **not** update the Drift Log automatically after every build. It is updated only when Thomas or the PM determines that an entry is required.

---

## Section 18 — Repo MD Documents

The active repo-side MD documents are:

- `PreferredHome_Dev_Control_Protocols.md`
- `PreferredHome_Drift_Log.md`
- `PreferredHome_Roadmap.md`
- `PreferredHome_Data_Architecture.md`
- `PreferredHome_Project_Architecture.md`

These are the five repo MD documents.

`README.txt` is separate and is not one of the five MD docs.

---

## Section 19 — Document Ownership

| Document / Output | Owner |
|---|---|
| Dev Control Protocols | ChatGPT (PM) |
| Roadmap updates | ChatGPT (PM) or Claude only when explicitly asked |
| Data Architecture updates | ChatGPT (PM) only when explicitly asked |
| Project Architecture updates | ChatGPT (PM) only when explicitly asked |
| Drift Log updates | Claude only when an actual drift entry is required and requested |
| README.txt | Claude with every code delivery |
| Begin Build Brief | Claude in chat |
| Post-Delivery Brief | Claude in chat |
| Build Assessment / Closeout Assessment | ChatGPT (PM) |
| Hotfix Directive | ChatGPT (PM) |

---

## Section 20 — Roadmap and Architecture Update Rule

Claude does **not** update:
- `PreferredHome_Roadmap.md`
- `PreferredHome_Data_Architecture.md`
- `PreferredHome_Project_Architecture.md`

unless Thomas or the PM explicitly asks for that update.

No autonomous doc maintenance.

---

## Section 21 — Both Repos Rule

When a bug or pattern exists in both repos, both repos must be checked.

If the build truly affects only one repo, Claude must explicitly state that the other repo was not touched.

---

## Section 22 — Dependency Check Rule

Before changing any shared file, Claude must:

1. identify every file that imports from it
2. read each importing file in full
3. list those dependencies if they materially affect the build
4. confirm no existing constant, function, or export name is being silently broken
5. state why a contained-file solution was not sufficient

Highest priority applies to shared helpers, config files, and any file used across screens.

---

## Section 23 — Sub-Component Rule

In React Native files, sub-components are defined outside the main export function.

Never define them inside the main export.  
This rule is permanent.

---

## Section 24 — Pre-Delivery Self-Check

Before delivery, Claude checks internally that:

- every changed file is complete
- ZIP name is correct
- ZIP folder structure is correct
- no out-of-scope file was touched
- booleans are TRUE/FALSE all-caps where applicable
- sub-components are outside the main function
- both repos were checked if relevant
- commit message format is correct
- README.txt contains the test checklist
- unchanged items are stated clearly

---

## Section 25 — Platform and Stack

- Frontend: React Native / Expo Router
- Backend: Python FastAPI on Render
- Current datastore: Google Sheets via gspread
- Testing: Expo Go tunnel mode on physical device
- Repos:
  - `twhisker65/PreferredHome-mobile`
  - `twhisker65/PreferredHome-api`
- MAIN branch only
- Commits via GitHub Desktop
- Expo base command:
  `cd C:\\Users\\twhis\\OneDrive\\Documents\\GitHub\\PreferredHome-mobile && npx expo start --tunnel`

Add `--clear` only when needed.

---

## Section 26 — Render Deployment Rule

For API deploys:
- always use **Deploy latest commit**
- never use Restart
- verify with `/health` after deploy

---

## Section 27 — No Invented UI / No Autonomous Cleanup

Claude never creates:
- new UI sections
- new screens
- new flows
- new toggles
- new behaviors
- new process rules

unless explicitly requested.

Any item phrased as a question, suggestion, possibility, or future idea is automatically deferred until approved.

---

## Section 28 — Closeout / Stability Workflow

After coding:
1. Claude delivers the build package and post-delivery brief.
2. Thomas updates the repo and tests on device.
3. Thomas gives review notes to the PM.
4. PM writes the build assessment.
5. PM writes hotfix instructions if needed.
6. If the build is accepted as stable, README.txt remains as the continuity record.
7. Drift Log is updated only if an actual drift entry is required.

---

## Section 29 — README / Drift / Protocol Continuity Model

Continuity is carried by:
- `README.txt` for build-to-build state
- `PreferredHome_Drift_Log.md` for cumulative mistakes and warnings
- `PreferredHome_Dev_Control_Protocols.md` for governance
- architecture docs only when explicitly revised
- roadmap only when explicitly revised

There is no `Next Steps` document.

---

## Section 30 — Format Rule for Repo Docs

The five active repo governing/reference docs are **MD only**.  
No PDF is required for those repo docs.

Reference PDFs may exist in project files for design/history, but the active repo docs are Markdown.

---

## Section 31 — Final Readiness State

After all questions are answered and before coding begins, Claude must issue a final readiness statement containing:

1. blockers cleared / blockers remaining
2. final scope restatement
3. waiting for **ENGAGE**

Claude stops after that statement.

---

## Protocol Version History

| Version | Key Changes |
|---|---|
| V1–V20 | Prior protocol evolution through ENGAGE rule, repo ZIP source-of-truth rule, and blocker-check simplification. |
| V21 | Aligned protocols to new three-role workflow. Removed Next Steps / Assistant Briefing from active process. README.txt made the build continuity document. Repo governing docs reduced to five MD docs plus README.txt. Drift Log changed to actual-drift-only updates. Roadmap and architecture docs now explicit-update only. PM owns protocols and doc revision planning. MD-only rule applied to active repo docs. |
