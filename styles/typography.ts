import { TextStyle } from "react-native";
import { colors } from "./colors";

// HEADING FONT STYLE — used for section headings across all screens.
// Change once here to update everywhere.
export const headingLabel: TextStyle = {
  fontSize: 15,
  fontWeight: "900",
  color: colors.textPrimary,
  letterSpacing: 0.5,
  textTransform: "uppercase",
};

export const typography = {
  h1: { fontSize: 18, fontWeight: "700", color: colors.textPrimary } as TextStyle,
  h2: { fontSize: 16, fontWeight: "700", color: colors.textPrimary } as TextStyle,
  body: { fontSize: 14, fontWeight: "500", color: colors.textPrimary } as TextStyle,
  muted: { fontSize: 12, fontWeight: "500", color: colors.textSecondary } as TextStyle,
} as const;
