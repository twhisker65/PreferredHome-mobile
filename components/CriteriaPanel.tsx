// components/CriteriaPanel.tsx — Build 3.2.06
// Criteria sub-panel. Slides in from the left (translateX animation, 180ms).
// Fields: Min Square Footage, Max Base Rent, Max Total Monthly, Max Commute Time.
// Features row: placeholder "Coming soon" only.
// Auto-saves immediately on every change (fire-and-forget AsyncStorage writes).
// Closing the panel closes everything — no back navigation to the menu.

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
import { headingLabel } from "../styles/typography";
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
            Criteria
          </Text>
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
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              Select Features
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 11,
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

const fieldLabel = {
  color: colors.textSecondary,
  fontSize: 11,
  fontWeight: "700" as const,
  letterSpacing: 0.4,
};

function SectionLabel({ label }: { label: string }) {
  return (
    <Text style={[headingLabel, { fontSize: 10, marginBottom: -4 }]}>
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
      <Text style={fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? ""}
        placeholderTextColor={colors.textSecondary}
        keyboardType="number-pad"
        style={{
          backgroundColor: colors.cardHover,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 9,
          paddingHorizontal: 10,
          paddingVertical: 8,
          color: colors.textPrimary,
          fontSize: 13,
        }}
      />
    </View>
  );
}
