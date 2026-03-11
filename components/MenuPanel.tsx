// components/MenuPanel.tsx — Build 3.2.06
// Dropdown menu panel that appears below the TopBar, left-aligned, half-screen wide.
// Opens with opacity + translateY fade-down animation (same pattern as FilterPanel).
// Four rows: Profile, Criteria, Settings, Help (placeholder).
// Version label at the bottom.
// Pressing a row fires onSelectPanel and closes this panel.
// Pressing the overlay closes this panel without opening a sub-panel.

import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";

export type SubPanelKey = "profile" | "criteria" | "settings";

type Props = {
  topOffset: number;
  onSelectPanel: (panel: SubPanelKey) => void;
  onClose: () => void;
};

type MenuRow = {
  key: SubPanelKey | "help";
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  placeholder?: boolean;
};

const ROWS: MenuRow[] = [
  { key: "profile",  label: "Profile",  icon: "person-outline" },
  { key: "criteria", label: "Criteria", icon: "options-outline" },
  { key: "settings", label: "Settings", icon: "settings-outline" },
  { key: "help",     label: "Help",     icon: "help-circle-outline", placeholder: true },
];

export function MenuPanel({ topOffset, onSelectPanel, onClose }: Props) {
  const screenW = Dimensions.get("window").width;
  const panelW  = Math.floor(screenW / 2);

  const opacity  = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <>
      {/* Overlay — closes panel on tap */}
      <Pressable
        onPress={onClose}
        style={{
          position: "absolute",
          top: 0, bottom: 0, left: 0, right: 0,
          zIndex: 90,
        }}
      />

      {/* Panel */}
      <Animated.View
        style={{
          position: "absolute",
          top: topOffset,
          left: 0,
          width: panelW,
          zIndex: 100,
          opacity,
          transform: [{ translateY }],
          backgroundColor: colors.card,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderColor: colors.border,
          borderBottomRightRadius: 14,
          shadowColor: "#000",
          shadowOffset: { width: 3, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 10,
        }}
      >
        {/* Menu rows */}
        {ROWS.map((row, i) => (
          <Pressable
            key={row.key}
            onPress={() => {
              if (row.placeholder) return;
              onSelectPanel(row.key as SubPanelKey);
            }}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingHorizontal: 14,
              paddingVertical: 14,
              borderTopWidth: i === 0 ? 0 : 1,
              borderTopColor: colors.border,
              backgroundColor: pressed && !row.placeholder
                ? colors.cardHover
                : "transparent",
              opacity: row.placeholder ? 0.4 : 1,
            })}
          >
            <Ionicons
              name={row.icon}
              size={18}
              color={colors.textPrimary}
            />
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 14,
                fontWeight: "700",
                flex: 1,
              }}
            >
              {row.label}
            </Text>
            {row.placeholder ? (
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 10,
                  fontStyle: "italic",
                }}
              >
                soon
              </Text>
            ) : (
              <Ionicons
                name="chevron-forward"
                size={14}
                color={colors.textSecondary}
              />
            )}
          </Pressable>
        ))}

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
