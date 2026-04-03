// components/SettingsPanel.tsx — Build 3.2.21.1 Hotfix
// Changes from 3.2.21:
//   Section label "DATA": textStyles.label → textStyles.sectionTitle.
//   Section label "APPEARANCE": textStyles.label → textStyles.sectionTitle.
//   Group headings inside body now use the correct hierarchy token.
// No content, behavior, or layout changes. Settings content untouched.
// Sub-components remain defined outside export function (DRIFT 10).

import React, { useEffect, useRef } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { textStyles } from "../styles/typography";

type Props = {
  topOffset: number;
  onClose: () => void;
};

export function SettingsPanel({ topOffset, onClose }: Props) {
  const screenW = Dimensions.get("window").width;
  const translateX = useRef(new Animated.Value(-screenW)).current;

  useEffect(() => {
    Animated.timing(translateX, { toValue: 0, duration: 180, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={{
      position: "absolute",
      top: topOffset, bottom: 0, left: 0, right: 0,
      zIndex: 100,
      backgroundColor: colors.surface,
      transform: [{ translateX }],
      shadowColor: "#000",
      shadowOffset: { width: 3, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 10,
    }}>

      {/* Sub-header */}
      <View style={{
        flexDirection: "row", alignItems: "center",
        paddingHorizontal: 16, paddingVertical: 10,
        borderBottomWidth: 1, borderBottomColor: colors.border,
        backgroundColor: colors.surface,
      }}>
        <Pressable onPress={onClose} style={{ position: "absolute", left: 16, zIndex: 1, padding: 4 }}>
          <Ionicons name="chevron-back" size={22} color={colors.accent} />
        </Pressable>
        <Text style={{
          flex: 1, textAlign: "center",
          color: colors.textPrimary,
          fontSize: textStyles.subHeader.fontSize,
          fontWeight: textStyles.subHeader.fontWeight,
        }}>
          Settings
        </Text>
      </View>

      {/* Scrollable body */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      >
        {/* ── DATA ── */}
        <Text style={[textStyles.sectionTitle, { marginBottom: 10 }]}>DATA</Text>

        <ActionButton
          label="Export All Data"
          icon="download-outline"
          onPress={() => Alert.alert("Coming Soon", "Export will be available in a future build.")}
        />
        <View style={{ height: 8 }} />
        <ActionButton
          label="Import Backup"
          icon="cloud-upload-outline"
          onPress={() => Alert.alert("Coming Soon", "Import will be available in a future build.")}
        />

        {/* ── APPEARANCE ── */}
        <Text style={[textStyles.sectionTitle, { marginTop: 20, marginBottom: 10 }]}>APPEARANCE</Text>

        <FutureRow label="Theme" />
        <View style={{ height: 8 }} />
        <FutureRow label="Notifications" />

        {/* Version label */}
        <Text style={{
          color: colors.textSecondary,
          fontSize: textStyles.micro.fontSize,
          textAlign: "center",
          opacity: 0.5,
          marginTop: 20,
        }}>
          PreferredHome v3.2.21
        </Text>
      </ScrollView>

      {/* Sub-footer — Close */}
      <View style={{
        padding: 14,
        borderTopWidth: 1, borderTopColor: colors.border,
        backgroundColor: colors.surface,
      }}>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => ({
            paddingVertical: 11, borderRadius: 10,
            alignItems: "center",
            backgroundColor: colors.accent,
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Text style={textStyles.button}>Close</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function ActionButton({ label, icon, onPress }: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row", alignItems: "center", gap: 10,
        paddingHorizontal: 12, paddingVertical: 12,
        borderRadius: 10, borderWidth: 1, borderColor: colors.border,
        backgroundColor: pressed ? colors.surfacePressed : colors.background,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Ionicons name={icon} size={17} color={colors.textPrimary} />
      <Text style={[textStyles.button, { flex: 1 }]}>{label}</Text>
    </Pressable>
  );
}

function FutureRow({ label }: { label: string }) {
  return (
    <View style={{
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      paddingHorizontal: 12, paddingVertical: 12,
      borderRadius: 10, borderWidth: 1, borderColor: colors.border,
      backgroundColor: colors.background,
      opacity: 0.45,
    }}>
      <Text style={textStyles.button}>{label}</Text>
      <Text style={{ color: colors.textSecondary, fontSize: textStyles.micro.fontSize, fontStyle: "italic" }}>
        Future build
      </Text>
    </View>
  );
}
