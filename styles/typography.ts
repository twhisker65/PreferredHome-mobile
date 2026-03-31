// styles/typography.ts — Build 3.2.20 Closeout
// Legacy exports (headingLabel, typography) removed.
// All components now import from textStyles only.

import { TextStyle } from "react-native";
import { colors } from "./colors";

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

  // ── Zone 3 — Section Title (group anchors — strict list only) ───
  // Permitted: PROPERTY, COSTS, FEATURES, NEIGHBORHOOD, SCHOOLS,
  //            LISTING, TIMELINE, NOTES, FILTER, SORT,
  //            APPOINTMENTS, PREFERRED, CANDIDATES
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
