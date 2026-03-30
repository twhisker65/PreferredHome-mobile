// components/CriteriaPanel.tsx — Build 3.2.20.12
// Change: font and color token references applied.
//   colors.card → colors.surface (panel background)
//   Panel header title: fontSize 15/fontWeight "900"/letterSpacing 0.3
//     → textStyles.subHeader (18/600/textPrimary)
//   SectionLabel: [headingLabel, { fontSize:10 }] → textStyles.label properties
//   fieldLabel const: fontSize 11/fontWeight "700"/letterSpacing 0.4 → textStyles.label
//   NumericField input background: colors.cardHover → colors.surfacePressed
//   NumericField input value fontSize: 13 → textStyles.bodySmall.fontSize
//   "Select Features" text: fontSize 13/fontWeight "600" → textStyles.bodyEmphasis
//   "Coming soon" text: fontSize 11/italic → textStyles.micro.fontSize + fontStyle italic
// No logic, state, auto-save, animation, or structural changes.
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
  const panelW  = Math.floor(screenW / 2);

  const translateX = useRef(new Animated.Value(-panelW)).current;

  const [data, setData] = useState<CriteriaData>({
    minSqFt: "",
    maxBaseRent: "",
    maxTotalMonthly: "",
    maxCommuteTime: "",
  });

  const [loaded, setLoaded] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    loadCriteriaData().then((d) => {
      setData(d);
      setLoaded(true);
    });
  }, []);

  // Slide in
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
          backgroundColor: colors.surface,
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
          <Text style={textStyles.subHeader}>Criteria</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 14, gap: 16, paddingBottom: 40 }}
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
            <Text style={textStyles.bodyEmphasis}>
              Select Features
            </Text>
            <Text
              style={{
                color:     textStyles.micro.color,
                fontSize:  textStyles.micro.fontSize,
                fontStyle: "italic",
              }}
            >
              Coming soon
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </>
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
