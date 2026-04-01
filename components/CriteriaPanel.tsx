// components/CriteriaPanel.tsx — Build 3.2.21
// Changes from 3.2.20.12:
//   Full-width layout: panel now covers full screen width (right: 0, not width: panelW).
//   Overlay backdrop removed — back arrow is the close mechanism.
//   Sub-header: "Criteria" centered with back arrow on left (replaces X close button).
//   Sub-footer: Clear and Save buttons (matching FilterPanel style).
//     Clear: resets all criteria fields to blank, saves blank state, does not close panel.
//     Save: saves current data then closes panel.
//   translateX animation start updated to -screenW for full-width slide-in.
//   Auto-save on data change (via useEffect) is preserved alongside explicit Save.
// No save logic, persistence, or field-key changes.
// Sub-components remain defined outside export function (DRIFT 10).

import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { textStyles } from "../styles/typography";
import {
  loadCriteriaData,
  saveCriteriaData,
  type CriteriaData,
} from "../lib/profileStorage";

type Props = {
  topOffset: number;
  onClose: () => void;
};

export function CriteriaPanel({ topOffset, onClose }: Props) {
  const screenW = Dimensions.get("window").width;
  const translateX = useRef(new Animated.Value(-screenW)).current;

  const [data, setData] = useState<CriteriaData>({
    minSqFt: "",
    maxBaseRent: "",
    maxTotalMonthly: "",
    maxCommuteTime: "",
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadCriteriaData().then((d) => {
      setData(d);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, []);

  // Auto-save whenever data changes (after initial load)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (!loaded) return;
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    saveCriteriaData(data);
  }, [data, loaded]);

  function updateData(field: keyof CriteriaData, value: string) {
    setData((d) => ({ ...d, [field]: value }));
  }

  function handleClear() {
    const blank: CriteriaData = { minSqFt: "", maxBaseRent: "", maxTotalMonthly: "", maxCommuteTime: "" };
    setData(blank);
    saveCriteriaData(blank).catch(() => {});
  }

  function handleSave() {
    saveCriteriaData(data).catch(() => {});
    onClose();
  }

  return (
    <Animated.View style={{
      position: "absolute",
      top: topOffset,
      bottom: 0,
      left: 0,
      right: 0,
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
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
      }}>
        <Pressable
          onPress={onClose}
          style={{ position: "absolute", left: 16, zIndex: 1, padding: 4 }}
        >
          <Ionicons name="chevron-back" size={22} color={colors.accent} />
        </Pressable>
        <Text style={{
          flex: 1,
          textAlign: "center",
          color: colors.textPrimary,
          fontSize: textStyles.subHeader.fontSize,
          fontWeight: textStyles.subHeader.fontWeight,
        }}>
          Criteria
        </Text>
      </View>

      {/* Scrollable body */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 14, gap: 16, paddingBottom: 24 }}
      >
        {/* ── PROPERTY ── */}
        <SectionLabel label="PROPERTY" />
        <NumericField
          label="Min Square Footage"
          value={data.minSqFt}
          onChangeText={(v) => updateData("minSqFt", v)}
          placeholder="e.g. 600"
        />

        {/* ── COSTS ── */}
        <SectionLabel label="COSTS" />
        <NumericField
          label="Max Base Rent"
          value={data.maxBaseRent}
          onChangeText={(v) => updateData("maxBaseRent", v)}
          placeholder="e.g. 3500"
        />
        <NumericField
          label="Max Total Monthly"
          value={data.maxTotalMonthly}
          onChangeText={(v) => updateData("maxTotalMonthly", v)}
          placeholder="e.g. 4200"
        />

        {/* ── TRANSPORTATION ── */}
        <SectionLabel label="TRANSPORTATION" />
        <NumericField
          label="Max Commute Time (mins)"
          value={data.maxCommuteTime}
          onChangeText={(v) => updateData("maxCommuteTime", v)}
          placeholder="e.g. 45"
        />

        {/* ── FEATURES ── */}
        <SectionLabel label="FEATURES" />
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 9,
            paddingHorizontal: 12,
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={textStyles.bodyEmphasis}>Select Features</Text>
          <Text style={{ color: textStyles.micro.color, fontSize: textStyles.micro.fontSize, fontStyle: "italic" }}>
            Coming soon
          </Text>
        </View>
      </ScrollView>

      {/* Sub-footer — Clear and Save */}
      <View style={{
        flexDirection: "row",
        gap: 8,
        padding: 14,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.surface,
      }}>
        <Pressable
          onPress={handleClear}
          style={({ pressed }) => ({
            flex: 1,
            paddingVertical: 11,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: "center",
            backgroundColor: colors.surfacePressed,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={textStyles.button}>Clear</Text>
        </Pressable>
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => ({
            flex: 1,
            paddingVertical: 11,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor: colors.accent,
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Text style={textStyles.button}>Save</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <Text style={{
      color:         textStyles.label.color,
      fontSize:      textStyles.label.fontSize,
      fontWeight:    textStyles.label.fontWeight,
      letterSpacing: textStyles.label.letterSpacing,
    }}>
      {label}
    </Text>
  );
}

function NumericField({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={{ gap: 5 }}>
      <Text style={textStyles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? ""}
        placeholderTextColor={colors.textSecondary}
        keyboardType="number-pad"
        style={{
          backgroundColor: colors.surfacePressed,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 9,
          paddingHorizontal: 10,
          paddingVertical: 8,
          color: colors.textPrimary,
          fontSize: textStyles.bodySmall.fontSize,
        }}
      />
    </View>
  );
}
