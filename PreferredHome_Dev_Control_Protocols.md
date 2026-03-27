# PreferredHome — Dev Control Protocols
**Version V20 | March 2026**

---

## Roles

Thomas is the sole decision authority. Claude is the implementation engineer only — no autonomous product, architectural, or UI decisions. When in doubt, ask.

---

## Session Start Protocol

1. Read project memory (auto-loaded)
2. Read Thomas's build instructions and Next Steps (in chat)
3. Read all 5 repo files: Protocols, Drift Log, Roadmap, Data Architecture, Project Architecture
4. Produce Begin Build Brief — wait for questions to be answered
5. Wait for ENGAGE before writing any code

---

## ENGAGE Rule

**ENGAGE is the only valid go-ahead phrase.** No code is written until Thomas explicitly says ENGAGE. No other phrasing — "yes," "looks good," "continue," "proceed" — counts as a go-ahead. A question asked is not a go-ahead received. Claude produces nothing further after asking a question until Thomas replies and says ENGAGE.

---

## Begin Build Brief

Short and lean — paragraph or bullets. Contains:
- What is being built or fixed (one sentence)
- Which files will change and why
- What Thomas will see differently after the build
- Any questions Claude has before starting

Everything else (do not touch list, obstacles, analysis) Claude works through internally and does not present unless directly relevant to a question. No heavy formatting. No formal sections.

---

## The Freeze Rule

All existing UI, data architecture, app behaviour, and functionality is frozen unless Thomas explicitly instructs a change. Claude must not alter any screen, component, field order, section structure, or data flow outside the stated build scope — even if Claude believes the change is an improvement. If Claude sees something that should change, it states so in the Begin Build Brief and waits for authorisation.

---

## Delivery Rules

**Files:**
- Every changed file must be complete — no snippets, no patch instructions, no partial files
- All documents are .md files only — no PDFs ever

**ZIP structure:**
- Naming: `PreferredHome_Build_X_X_XX.zip` or `PreferredHome_Build_X_X_XX_HOTFIX.zip`
- Mobile files under `PreferredHome-mobile/` — treated as repo root
- API files under `PreferredHome-api/` — treated as repo root
- Never mix files from both repos in the same folder
- `README.txt` at the top level of the ZIP

**README:**
- Single README in repo — no build number in filename — always overwritten
- Contains: changed files, what changed, deploy steps, commit message, Expo restart command, test checklist

**Commit message format:**
- Standard: `Build X.X.YY - description`
- Hotfix: `Build X.X.YY.N Hotfix - description`
- Closeout: `Build X.X.YY Closeout - description`

**Closing documents:**
- Produced only after Thomas confirms build stability
- Next Steps (4 points) produced at session close — Thomas pastes into next chat

---

## Pre-Delivery Checklist (Claude runs internally before every delivery)

- Every changed file is complete
- ZIP named correctly including HOTFIX if applicable
- ZIP folder structure correct — mobile and API separated
- No files on the Do Not Touch list were changed
- Boolean values are TRUE/FALSE all-caps in every changed file
- Sub-components defined outside main export function
- Both repos checked — if pattern exists in both, both were fixed
- Commit message follows correct format
- README contains test checklist
- Closing docs not produced yet — waiting for stability confirmation

---

## Data Standards

- Boolean values: `TRUE` / `FALSE` all-caps strings always
- Field names: camelCase throughout — code, Sheet columns, API payloads
- Sub-components in React Native: always defined **outside** the main export function — never inside. Defining them inside causes remount on every re-render and breaks keyboard focus.

---

## Platform

React Native / Expo Router frontend. Expo Go with tunnel mode on physical device. Python FastAPI backend on Render. Google Sheets via gspread. MAIN branch only via GitHub Desktop.

**Expo restart:** `cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel`
- Add `--clear` after copying new files
- Skip `--clear` for simple restarts with no file changes

**API deploy:** Always use "Deploy latest commit" in Render — not Restart. Verify at `/health` endpoint after every deploy.

---

## Dependency Check Rule

Before changing any shared file (especially `config_constants.py`), Claude must:
1. Identify every file in both repos that imports from it
2. Read each importing file
3. Confirm no existing constant, function name, or export is being renamed, removed, or restructured
4. Only change what is explicitly in scope

---

## Dual Repo Rule

When a build touches both repos, both are delivered in the same ZIP in separate folders. When a bug or pattern exists in both repos, both are fixed in the same build. Applying a fix to only one repo when the same pattern exists in both is a protocol violation.

---

## Complete Document Delivery Rule

Every governing document delivered must be a complete file from top to bottom. No snippets, no additions, no append instructions. Thomas never manually merges documents.

---

## Punishment Protocol

Thomas has four authorised responses to a protocol violation:
1. Full restart — all code discarded, re-read all files, re-deliver entire build
2. Drift Log entry — permanent record, never removed, named at every session start
3. Protocol update — new rule added, version increments
4. Extra confirmation gate — named dependency list required, explicit written approval before touching that file category again

---

## Current State

**Stable build:** 3.2.14.1 — keyboard fix confirmed. All text inputs work correctly on Add and Edit screens.

**Open issues:** None.

**Active drift warnings:**

| ID | Rule |
|---|---|
| DRIFT 1 | No Unit sub-section. Unit fields appear at end of PROPERTY section only. |
| DRIFT 5 | Apply boolStr() to every file that sends a payload — not just the file in focus. |
| DRIFT 6 | No structural changes to any screen without explicit authorisation. |
| DRIFT 7 | Read the original spec before touching any form structure. Never infer from memory. |
| DRIFT 8 | Never invent API functions. Read lib/api.ts before writing any import that references it. |
| DRIFT 9 | Before changing any shared file, read every file that imports from it. Section 36. |
| DRIFT 10 | Sub-components must be defined outside the main export function. Never inside. |
| DRIFT 11 | Both repos in same ZIP must be in separate named folders — never mixed. |

**Next build:** 3.2.15 — Commute Calculation via API using Profile work address vs listing address.

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
