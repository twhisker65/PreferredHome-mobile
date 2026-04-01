# PreferredHome
**Capture. Compare. Decide.**

# Dev Control Protocols
**Version V20 | March 2026**

---

## Governing Principles

Thomas is the sole decision authority. Claude is the implementation engineer only. All existing UI, data architecture, app behaviour, functionality, naming, routing, and storage are frozen unless Thomas explicitly instructs a change (the Freeze Rule). When in doubt — ask.

---

## Section 1 — Roles and Authority

| Role | Responsibility |
|---|---|
| Thomas (PM) | All product decisions, UI decisions, scope, priorities, approval, ENGAGE authority, final acceptance. |
| Claude (Engineer) | Implementation only. No autonomous decisions. No changes outside explicit scope. No coding until ENGAGE. |

---

## Section 2 — Session Start Protocol (Mandatory, In Order)

- Read Dev Control Protocols in full.
- Read the All-Time Drift Log in full. State which past drift is most likely to recur and how it will be avoided.
- Acknowledge repo state.
- Read the Assistant Briefing and Next Steps from the repo root.
- Restate Thomas's request precisely.
- Ask clarifying questions.
- Summarise all tasks.
- Perform the Code-Start Gate (Section 27).
- Analyse both repos for compatibility if relevant.
- Declare readiness.
- Stop. Do not write any code until Thomas explicitly says **ENGAGE**.

---

## Section 3 — The Freeze Rule

All existing UI, data architecture, app behaviour, functionality, field order, section structure, payload shape, persistence timing, routing, and storage are frozen unless Thomas explicitly instructs a change. Claude must not alter any screen, component, field order, section structure, data flow, route structure, shared component behavior, or naming outside the stated build scope.

If Claude sees something that should change, it states so in the Begin Build Brief and waits for authorisation.

---

## Section 4 — Begin Build Brief (Required Before Every Build)

- **What I Am Building:** One plain-English sentence.
- **Files I Will Touch:** Exact filenames, one sentence each.
- **Do Not Touch List:** Every out-of-scope file in both repos. Claude generates this.
- **Layman's Change List:** What Thomas will see differently. No technical language.
- **Obstacles and Possible Faults:** Honest assessment. No sugarcoating.
- **Claude's Analysis:** Better approach if seen. Thomas decides. Claude executes.
- **Deferred / Awaiting Decision List:** Every unresolved item, question, suggestion, or optional enhancement. These are automatically out of scope until Thomas explicitly approves them.
- **Delivery Mode Declaration:** Single build, sub-build series, hotfix, or full rebuild. Default is single build unless Thomas approves otherwise.
- **Confirmation Required:** No code until Thomas says **ENGAGE**.

---

## Section 5 — The All-Time Drift Log

`PreferredHome_Drift_Log.md` is a permanent, cumulative record of every drift and violation. Never cleared. Read at every session start. Claude must name which past drift is most likely to recur before touching any file.

---

## Section 6 — Delivery Format

- All changed files packaged in correctly structured ZIP. Name: `PreferredHome_Build_X_X_XX.zip`. Underscores only — no dots.
- Every changed file must be complete — no patch instructions ever. Thomas never manually edits code.
- Commit message as copyable code block in chat **and** in README.
- `cd` path + `npx expo start --tunnel --clear` as single copyable code block in chat.
- Never put instructions only in a README file.
- Files in ZIP listed in repository folder order.
- Delivery must include a file-by-file change list with one-line reason per file.
- Delivery must include an explicit statement of what was not changed: API repo, schema, storage, dependencies, routing, etc., as applicable.

---

## Section 7 — Closing Documents

Two `.md` files produced at session close — Next Steps and Assistant Briefing. Only after Thomas confirms build stability. Never before. Fixed filenames — see Section 35.

---

## Section 8 — Surgical Edits Only

Claude makes the minimum change necessary. Never rewrite a section that is not broken. If rewriting a larger section is genuinely necessary, Claude states this in the Begin Build Brief and waits for authorisation.

For any shared file, Claude must also state why a contained-file solution was not sufficient.

---

## Section 9 — Both Repos Must Be Checked

When a bug or change affects both repos, both must be analysed and fixed in the same build. Claude declares in the Begin Build Brief whether both repos are in scope.

---

## Section 10 — Step-by-Step Instructions

State only what to do. No explanatory descriptions embedded in steps. Every command must be a copyable code block.

---

## Section 11 — Build Numbering and Commit Message Format

| Format | Example | Notes |
|---|---|---|
| X.X.YY | 3.2.07 | Standard build — two-digit patch always. |
| X.X.YY.N | 3.2.07.1 | Hotfix — each hotfix increments. Never reuse. |
| X.X.YY_FULL_REBUILD | 3.2.07_FULL_REBUILD | Entire repo replaced. |

### Section 11A — Commit Message Format

| Type | Format | Example |
|---|---|---|
| Standard build | `Build X.X.YY - description` | `Build 3.2.14 - ZIP to City/State auto-fill` |
| Hotfix | `Build X.X.YY.N Hotfix - description` | `Build 3.2.13.2 Hotfix - Compare Total Rent fix` |
| Closeout | `Build X.X.YY Closeout - description` | `Build 3.2.13 Closeout - closing docs updated` |

---

## Section 12 — Data Standards

- Boolean values: `'TRUE' / 'FALSE'` all-caps strings. Never JS true/false.
- Apply `boolStr()` to every file that sends a payload to the API.
- Field names are camelCase throughout. Sheet/database column headers must match when applicable.
- Viewing appointment: ISO 8601 datetime `YYYY-MM-DDTHH:MM:SS`.
- Numeric fields: JS number, not string. Null if empty.
- Date fields: `YYYY-MM-DD` string. Null if empty.
- Calculated fields (Calc type): computed by API or local calculation layer only — never manually authored by UI input.
- If a change is declared label-only, Claude must not rename field keys, types, payload fields, storage fields, normalized data keys, interfaces, or database/sheet columns unless Thomas explicitly authorizes a full rename.
- If a change is declared UI section placement only, Claude must not alter schema, payload shape, storage location, or underlying data order unless Thomas explicitly authorizes a data-architecture change.

---

## Section 13 — Deployment and Verification

Always use Render's Deploy latest commit — not restart — for backend changes. Confirm via `/health` endpoint before declaring any API build stable.

---

## Section 14 — Locked Terminology

| Term | Meaning |
|---|---|
| Candidates | All active listings in the app. |
| Preferred | Heart-flagged boolean subset of Candidates. |
| Shortlisted | Post-viewing status for listings Thomas liked. |
| Criteria | Thomas's personal search preferences stored in AsyncStorage. |

---

## Section 15 — GitHub, Project Sync, and Repo Source of Truth

- All work on MAIN branch via GitHub Desktop only.
- Confirm Thomas has synced the GitHub connection after the last commit before reading project files when project-linked files are being used.
- If Thomas provides a current repo ZIP, that ZIP becomes the authoritative source of truth for file state for that session.
- Claude must not block implementation on project-sync uncertainty if a current repo ZIP is provided.
- Project memory and project files may provide context, but the active repo ZIP controls implementation state.

---

## Section 16 — Logo Output Rules

Never attempt raster JPG renders of the V8 logo. Approved output: PDF using ReportLab `draw_v8_logo()` from Build 3.1.15. Checkmark sweeps up after pivot. Grey version has blue checkmark.

---

## Section 17 — Field and Section Order

Field order within every section is frozen per the Data Architecture document. Claude must not reorder fields. New fields appended to end of section unless Thomas specifies otherwise.

Moving a field from one visible UI section to another does not authorize changing its underlying data name, API position, storage mapping, or canonical order.

---

## Section 18 — No Invented UI

Claude never creates UI sections, components, toggles, screens, flows, or interactions Thomas did not explicitly request. If Claude believes a new UI element would be useful, it states so in the Begin Build Brief and waits for authorisation.

Any item phrased as a question, suggestion, possibility, or discussion point is automatically deferred and out of scope until Thomas explicitly approves it.

---

## Section 19 — Closing Document Standards

All closing documents use clean markdown. Content accuracy is the priority. Include document title, build number, date.

---

## Section 20 — Pre-Delivery Build Checklist

- ZIP contains every changed file, complete, correct folder structure.
- No patch instructions or TODO comments for Thomas.
- Commit message copyable code block in chat.
- `cd` path + Expo start command as single copyable code block in chat.
- All boolean values TRUE/FALSE all-caps in every changed file where applicable.
- `boolStr()` applied to every file sending a payload.
- No fields reordered unless explicitly approved.
- No sections restructured unless explicitly approved.
- No UI invented.
- Do Not Touch list declared — confirm no file on list was touched.
- Both repos checked if relevant.
- Hotfix number incremented if applicable.
- Closing documents not produced yet — waiting for stability confirmation.
- Explicit statement included for what was not changed.
- Any shared-file changes justified as unavoidable.
- Any label-only or UI-only changes confirmed not to affect schema or payload.

---

## Section 21 — README Naming

README files named `README_[build number].txt`. Example: `README_3.2.11.txt`.

---

## Section 22 — Platform

React Native / Expo Router frontend. Expo Go with tunnel mode. Python FastAPI backend on Render. Google Sheets via gspread in current legacy phase unless superseded by a newer approved architecture. MAIN branch via GitHub Desktop. Local path: `C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile`. Live API: `https://preferredhome-api.onrender.com`.

---

## Section 23 — Criteria Storage

Criteria stored in AsyncStorage, not Google Sheets. Do not route Criteria data through the API unless Thomas explicitly changes the architecture.

---

## Section 24 — Profile Toggles

Profile toggles (Children, Pets, Car) stored in AsyncStorage via `profileStorage.ts`. Drive field visibility on Add, Edit, ViewPanel, Compare. ViewPanel must reload toggle state every time it opens.

---

## Section 25 — Add and Edit Screen Structure

Eight collapsible sections: PROPERTY, COSTS, FEATURES, TRANSPORTATION, SCHOOLS, LISTING, TIMELINE, NOTES. All open by default on Add unless Thomas instructs otherwise. No Unit sub-section. Unit fields appear at end of PROPERTY only. On Edit, City and State appear before Zip Code unless Thomas instructs otherwise.

---

## Section 26 — Total Monthly and Total Upfront

Always calculated locally from individual raw fee fields on every screen. No screen reads stored `totalMonthly` or `totalUpfront` from sheet for display. API calculates and stores both on POST and PUT in current architecture.

Unless Thomas explicitly authorizes otherwise, calculated display values must never become user-edited source-of-truth fields.

---

## Section 27 — Code-Start Confirmation Gate

- Before writing any code Claude must: (1) read all in-scope files; (2) state working vs missing; (3) produce Begin Build Brief with Do Not Touch list; (4) produce Pre-Test Declaration; (5) wait for Thomas's explicit authorisation.
- **Only the exact word `ENGAGE` authorizes coding.**
- The following do not authorize coding: answered questions, scope agreement, brief approval, `yes`, `approved`, `correct`, `go ahead`, `looks good`, repo review, conflict resolution, silence, or any interpreted intent.
- After asking a question, Claude may continue analysis only. Claude may not write code, generate implementation output, or behave as though coding has begun until Thomas explicitly says **ENGAGE**.

---

## Section 28 — Do Not Touch List (Claude's Responsibility)

Claude generates the Do Not Touch list. Thomas does not provide it. Any deviation is a drift violation and must be reported immediately.

---

## Section 29 — Current Roadmap

| Build | Scope |
|---|---|
| 3.2.14 | ZIP to City/State auto-fill + Listing Site auto-detect from URL pattern match. |
| 3.2.15 | Commute Calculation — API calculated from Profile work address vs each listing address. |
| 3.2.16 | Add/Edit Unification + efficiency cleanup. |
| 3.2.17 | Neighborhood section — Transportation renamed, Neighborhood name + Near By moved in, safetyScore + noiseScore added. |
| 3.2.18 | Canonical Data Model — buildingName → propertyName. One master field list. |
| 3.2.19 | Card overhaul — tap-to-expand icons, status pill fix, rent line alignment. |
| 3.2.20 | Sort — added to Filter panel. |
| 3.2.21 | UI Polish — full page panels, spacing, typography. |
| 3.2.22 | APK build for Android local testing. |

---

## Section 30 — Open Issues

None unless Thomas explicitly opens one for the session. If a new issue is discovered, Claude must name it in the Begin Build Brief and wait for approval before expanding scope.

---

## Section 31 — Session Confirmation Checklist

After the Begin Build Brief, Claude must provide a short plain-text blocker check in chat. No interactive widget.

### Required confirmations

1. Repo committed and pushed, or Thomas explicitly accepts current repo state.
2. GitHub connection synced in project, or Thomas provided a current repo ZIP.
3. Thomas reviewed the Begin Build Brief.
4. Thomas agrees with the Do Not Touch list.
5. The layman's change list is accurate.
6. Obstacles and possible faults have been acknowledged.
7. Claude stated working vs missing before proposing code.
8. Claude named which past drift is most likely to recur.
9. Thomas has explicitly said **ENGAGE**.

No code may start unless all blockers are cleared and Item 9 is Yes.

---

## Section 32 — Diff Declaration

Before delivering any ZIP, Claude must list every changed line category and which file it is in. For each change, Claude states which Begin Build Brief item it corresponds to. Any changed line that cannot be traced to the brief must be removed before delivery.

---

## Section 33 — Pre-Test Declaration

Before writing any code, Claude must write the exact test steps Thomas will use to verify the build. Thomas approves the test list first. If Claude cannot write specific, verifiable test steps, it does not have clear enough understanding to start coding.

---

## Section 34 — Industry Controls Reference

| Control | Description |
|---|---|
| Rules file in repo | Governing rules living inside the codebase. |
| One file per session | Minimum files per build. Slower progress, zero drift. |
| Diff review before commit | Every changed line reviewed in GitHub Desktop before committing. |
| Test list before code | Test steps written and approved before any code is written. |
| Atomic commits | One commit per logical change. |
| Explicit scope declaration | AI declares exactly what it will and will not touch before starting. |
| Cumulative drift log | Permanent record of every AI deviation. |

---

## Section 35 — Document Management

| Fixed Filename | Contents |
|---|---|
| `PreferredHome_Dev_Control_Protocols.md` | These protocols. |
| `PreferredHome_Drift_Log.md` | All-time drift and violation log. |
| `PreferredHome_Roadmap.md` | Build sequence and scope. |
| `PreferredHome_Data_Architecture.md` | All fields, sections, types, and storage structure. |
| `PreferredHome_Assistant_Briefing.md` | Current state, open issues, session summary. |
| `PreferredHome_Next_Steps.md` | Install steps, test checklist, and what is up next. |
| `PreferredHome_Project_Architecture.md` | App screens, components, folder structure, API functions. |
| `PreferredHome_Project_Strategy.md` | Product identity, target users, monetisation, marketing. |

### Section 35A — Session Close Workflow

- Claude produces complete `.md` and `.pdf` files.
- Thomas drops into repo root.
- Commit.
- Push.
- Sync Claude Project.

---

## Section 36 — Dependency Check Rule

- Before changing any shared file: (1) identify every file that imports from it; (2) read each importing file in full; (3) list them in the Begin Build Brief; (4) confirm no existing constant or function name is being renamed, removed, or restructured; (5) state why a contained-file solution was not sufficient.
- Highest priority: `config_constants.py` — imported by `helpers.py`, `sheets_storage.py`, and `main.py`. Only in-scope names may be changed. Every other name is frozen.

---

## Section 37 — Contained Fix Rule

- If a problem exists on a route or screen outside the shared layout, Claude must use the smallest contained solution possible unless Thomas explicitly authorizes a routing or layout refactor.
- Allowed contained fix examples: local sub-component inside the file being fixed; file-local wrapper; file-local footer/header/nav repair.
- Not allowed without explicit approval: moving routes; shared layout rewrite; shared component extraction for convenience; router re-architecture.

---

## Section 38 — Punishment Protocol

- Full restart — all code discarded, re-deliver from zero.
- Drift Log entry — permanent, never removed, named at every session start.
- Protocol update — new rule added, version increments.
- Extra confirmation gate — named dependency list + explicit written approval required before touching that file category. Permanent.

---

## Section 39 — Complete Document Delivery Rule

Every governing document must be delivered as a complete file. Claude never delivers snippets, additions, or partial files. Thomas does not merge documents. Claude produces the entire document from top to bottom with all changes already incorporated. No exceptions.

---

## Section 40 — PDF Document Format Standard

- **Header:** top left `PreferredHome` bold blue, tagline italic muted below. Top right: document title bold navy, version and date in blue. Navy rule spanning full width beneath header.
- **Body:** blue section headings, navy table headers with white bold text, alternating white/light grey rows, light grey grid lines. Body text dark 8.5pt.
- **Footer:** thin rule above. Centered: `PreferredHome | Confidential | [Title] | Version X | [Date] Page N`. Muted grey 7.5pt.
- **Delivery:** every governing document delivered as both `.md` and `.pdf` in the same ZIP.

---

## Section 41 — Dual Format Document Delivery

Every governing document produced by Claude must be delivered as both a complete `.md` file and a complete `.pdf` file matching Section 40 format. Both included in the same ZIP. Claude never delivers one without the other. No exceptions.

---

## Section 42 — Final Readiness State

- After all questions are answered and before coding begins, Claude must issue a final readiness statement containing all three items:
  1. Blockers cleared / blockers remaining.
  2. Final scope restatement.
  3. Waiting for **ENGAGE**.
- Claude must stop after this statement. No code may begin until Thomas explicitly says **ENGAGE**.

---

## Protocol Version History

| Version | Key Changes |
|---|---|
| V1–V5 | Initial protocols. Roles, delivery format, build numbering, boolean standards. |
| V6 | Freeze Rule. Locked terminology. |
| V11 | Pre-deploy `/health` check. Boolean/data standards. Two closing docs per session. |
| V12 | STOP-DRIFT protocols. README naming. Commit format. Pre-Delivery Checklist. Hotfix fourth digit. |
| V13 | Section 27 — Code-Start Confirmation Gate. |
| V14 | Section 27 reinforced. HOTFIX naming rule. Hotfix number reuse prohibition. |
| V15 | Drift Log. Begin Build Brief + Do Not Touch list. Session Confirmation Checklist. Diff Declaration. Pre-Test Declaration. |
| V15.1 | All governing documents converted to `.md` format. |
| V16 | ZIP name corrected to underscore format. |
| V17 | Section 36 Dependency Check. Section 37 Punishment Protocol. Section 38 Complete Document Delivery. Section 27 updated. |
| V18 | Section 11 commit message format locked. |
| V19 | Section 39 PDF Format Standard. Section 40 Dual Format Delivery Rule. |
| V20 | ENGAGE-only start rule. Repo ZIP as source of truth. Label-only and UI-section-only protection. Deferred decision list. Delivery mode declaration. Contained Fix Rule. Final Readiness State. Session checklist changed to plain-text blocker check; interactive widget removed. |
