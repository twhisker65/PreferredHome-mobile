# PreferredHome — Build README
**Build 3.2.14.1 Hotfix | March 2026**

---

## Changed Files

**Mobile repo:**
- `app/(tabs)/add.tsx` — sub-components moved outside main function
- `app/edit.tsx` — sub-components moved outside main function

**API repo:** None.

---

## What Changed

Sub-components (Section, Field, SelectRow, Toggle, MultiRow, DateRow) were defined inside the main export function in both add.tsx and edit.tsx. Every keystroke triggered a re-render, React saw new function references, unmounted and remounted the components, and the keyboard dismissed. Moving the definitions outside the main function gives React stable references and keyboard focus is maintained correctly.

---

## Deploy Steps

1. Copy files from `PreferredHome-mobile/` into your mobile repo (overwrite existing)
2. Commit in GitHub Desktop
3. Push to GitHub
4. Restart Expo

**No API changes. No Render deploy required.**

---

## Commit Message

```
Build 3.2.14.1 Hotfix - Fix keyboard dismissing after each keystroke on Add and Edit screens
```

---

## Expo Restart

```
cd C:\Users\twhis\OneDrive\Documents\GitHub\PreferredHome-mobile && npx expo start --tunnel --clear
```

---

## Test Checklist

| # | Test | Result |
|---|---|---|
| T1 | Open Add screen. Type multiple characters into Building Name without re-tapping. Keyboard stays open. | |
| T2 | Open Add screen. Type into multiple fields in sequence using Next key. Focus moves correctly. | |
| T3 | Open Edit on any listing. Type multiple characters. Keyboard stays open. | |
| T4 | Listing Site auto-detects correctly when URL is typed on Add screen. | |
| T5 | Listing Site auto-detects correctly when URL is changed on Edit screen. | |
