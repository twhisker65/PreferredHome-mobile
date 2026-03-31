// styles/typography.ts — Build 3.2.20 Closeout Hotfix
// sectionTitle comment updated — strict list removed per Thomas's direction.
// sectionTitle is for any section or group heading at the developer's discretion.
// No token values changed.

import { TextStyle } from "react-native";
import { colors } from "./colors";

// ── Named text tokens ──────────────────────────────────────────────────────────
// Rules:
//   1. Never set fontSize, fontWeight, or color ad hoc in components. Use tokens only.
//   2. White (textPrimary) = information and headings.
//      Grey (textSecondary) = labels, muted content, no-data dash (-).
//      Blue (accent) = links, active, selected, yes-check semantics only.
//   3. sectionTitle is for section and group headings — use at your discretion.
//   4. Do not create near-duplicate tokens to solve a local layout issue.

export const textStyles = {

  // ── Zone 1 — Main Header ────────────────────────────────────────
  mainTitleBlue: {
    fontSize:      20,
    lineHeight:    28,
    fontWeight:    "800",
    color:         colors.accent,
    letterSpacing: 0.2,
  } as TextStyle,

  mainTitleWhite: {
    fontSize:      20,
    lineHeight:    28,
    fontWeight:    "800",
    color:         colors.textPrimary,
    letterSpacing: 0.2,
  } as TextStyle,

  // ── Zone 2 — Sub-Header (panel and page secondary bars) ─────────
  subHeader: {
    fontSize:   18,
    lineHeight: 24,
    fontWeight: "600",
    color:      colors.textPrimary,
  } as TextStyle,

  // ── Zone 3 — Section Title (section and group headings) ─────────
  sectionTitle: {
    fontSize:      15,
    lineHeight:    20,
    fontWeight:    "900",
    color:         colors.textPrimary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  } as TextStyle,

  // ── Zone 3 — Card Titles ────────────────────────────────────────
  cardTitle: {
    fontSize:   16,
    lineHeight: 22,
    fontWeight: "700",
    color:      colors.textPrimary,
  } as TextStyle,

  cardSecondary: {
    fontSize:   14,
    lineHeight: 20,
    fontWeight: "500",
    color:      colors.textSecondary,
  } as TextStyle,

  // ── Zone 3 — Body ───────────────────────────────────────────────
  bodyPrimary: {
    fontSize:   14,
    lineHeight: 20,
    fontWeight: "400",
    color:      colors.textPrimary,
  } as TextStyle,

  bodyEmphasis: {
    fontSize:   14,
    lineHeight: 20,
    fontWeight: "600",
    color:      colors.textPrimary,
  } as TextStyle,

  // ── Zone 3 — Labels and Small Body ──────────────────────────────
  label: {
    fontSize:      12,
    lineHeight:    16,
    fontWeight:    "600",
    color:         colors.textSecondary,
    letterSpacing: 0.2,
  } as TextStyle,

  bodySmall: {
    fontSize:   12,
    lineHeight: 16,
    fontWeight: "400",
    color:      colors.textSecondary,
  } as TextStyle,

  // ── Zone 3 — Interactive / Link ─────────────────────────────────
  linkText: {
    fontSize:   14,
    lineHeight: 20,
    fontWeight: "600",
    color:      colors.accent,
  } as TextStyle,

  // ── Zone 4 — Sub-Footer Buttons ─────────────────────────────────
  button: {
    fontSize:   13,
    lineHeight: 18,
    fontWeight: "700",
    color:      colors.textPrimary,
  } as TextStyle,

  // ── Zone 5 — Bottom Nav (Expo-managed — color not set here) ─────
  navLabel: {
    fontSize:   10,
    lineHeight: 14,
    fontWeight: "400",
  } as TextStyle,

  // ── Micro (version labels, soon badges) ─────────────────────────
  micro: {
    fontSize:   10,
    lineHeight: 14,
    fontWeight: "400",
    color:      colors.textSecondary,
  } as TextStyle,

} as const;
