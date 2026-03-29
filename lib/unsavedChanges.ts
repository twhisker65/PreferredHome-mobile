// lib/unsavedChanges.ts — Build 3.2.16.1 Hotfix
// Reusable unsaved changes confirmation alert.
// Import and call confirmDiscard(onDiscard) on any back/close action
// where the user may have unsaved form data.

import { Alert } from "react-native";

export function confirmDiscard(onDiscard: () => void): void {
  Alert.alert(
    "Unsaved Changes",
    "Do you wish to discard or keep your changes?",
    [
      { text: "Discard", style: "destructive", onPress: onDiscard },
      { text: "Keep", style: "cancel" },
    ]
  );
}
