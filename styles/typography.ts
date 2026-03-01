import { TextStyle } from "react-native";
import { colors } from "./colors";

export const typography = {
  h1: { fontSize: 18, fontWeight: "700", color: colors.textPrimary } as TextStyle,
  h2: { fontSize: 16, fontWeight: "700", color: colors.textPrimary } as TextStyle,
  body: { fontSize: 14, fontWeight: "500", color: colors.textPrimary } as TextStyle,
  muted: { fontSize: 12, fontWeight: "500", color: colors.textSecondary } as TextStyle,
} as const;
