// components/SettingsPanel.tsx — Build 3.2.06
// Settings sub-panel. Slides in from the left (translateX animation, 180ms).
// DATA section: Export All Data + Import Backup (placeholder buttons — Alert on press).
// APPEARANCE section: Theme + Notifications — labeled "Future build".
// Version label at the bottom.
// Closing the panel closes everything.

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
import { headingLabel } from "../styles/typography";

type Props = {
  topOffset: number;
  onClose: () => void;
};

export function SettingsPanel({ topOffset, onClose }: Props) {
  const screenW = Dimensions.get("window").width;
  const panelW  = Math.floor(screenW / 2);

  const translateX = useRef(new Animated.Value(-panelW)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <>
      {/* Overlay */}
      <Pressable
        onPress={onClose}
        style={{
          position: "absolute",
          top: 0, bottom: 0, left: 0, right: 0,
          zIndex: 90,
          backgroundColor: "rgba(0,0,0,0.35)",
        }}
      />

      {/* Panel */}
      <Animated.View
        style={{
          position: "absolute",
          top: topOffset,
          bottom: 0,
          left: 0,
          width: panelW,
          zIndex: 100,
          transform: [{ translateX }],
          backgroundColor: colors.card,
          borderRightWidth: 1,
          borderRightColor: colors.border,
          shadowColor: "#000",
          shadowOffset: { width: 3, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 15,
              fontWeight: "900",
              letterSpacing: 0.3,
            }}
          >
            Settings
          </Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 14, gap: 16, paddingBottom: 40 }}
        >
          {/* ── DATA ── */}
          <Text style={[headingLabel, { fontSize: 10 }]}>DATA</Text>

          <ActionButton
            label="Export All Data"
            icon="download-outline"
            onPress={() =>
              Alert.alert("Coming Soon", "Export will be available in a future build.")
            }
          />
          <ActionButton
            label="Import Backup"
            icon="cloud-upload-outline"
            onPress={() =>
              Alert.alert("Coming Soon", "Import will be available in a future build.")
            }
          />

          {/* ── APPEARANCE ── */}
          <Text style={[headingLabel, { fontSize: 10, marginTop: 4 }]}>
            APPEARANCE
          </Text>

          <FutureRow label="Theme" />
          <FutureRow label="Notifications" />
        </ScrollView>

        {/* Version label */}
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 10,
            textAlign: "center",
            opacity: 0.5,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          PreferredHome v3.2.06
        </Text>
      </Animated.View>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function ActionButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: pressed ? colors.cardHover : colors.background,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Ionicons name={icon} size={17} color={colors.textPrimary} />
      <Text
        style={{
          color: colors.textPrimary,
          fontSize: 13,
          fontWeight: "700",
          flex: 1,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function FutureRow({ label }: { label: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
        opacity: 0.45,
      }}
    >
      <Text
        style={{
          color: colors.textPrimary,
          fontSize: 13,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 11,
          fontStyle: "italic",
        }}
      >
        Future build
      </Text>
    </View>
  );
}
