// components/ProfilePanel.tsx — Build 3.2.06
// Profile sub-panel. Slides in from the left (translateX animation, 180ms).
// Fields: Name, Email, Search Mode, Work Address, Commute Method,
//         Departure Time, Lifestyle toggles (Children/Pets/Car).
// Auto-saves immediately on every change (fire-and-forget AsyncStorage writes).
// Closing the panel closes everything — no back navigation to the menu.

import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { headingLabel } from "../styles/typography";
import {
  loadProfileData,
  saveProfileData,
  loadProfileToggles,
  saveProfileToggles,
  type ProfileData,
  type ProfileToggles,
} from "../lib/profileStorage";

type Props = {
  topOffset: number;
  onClose: () => void;
};

const COMMUTE_METHODS: Array<ProfileData["commuteMethod"]> = [
  "Walk", "Drive", "Transit", "Bike",
];

export function ProfilePanel({ topOffset, onClose }: Props) {
  const screenW = Dimensions.get("window").width;
  const panelW  = Math.floor(screenW / 2);

  const translateX = useRef(new Animated.Value(-panelW)).current;

  const [data, setData] = useState<ProfileData>({
    name: "",
    email: "",
    searchMode: "Rent",
    workAddress: "",
    commuteMethod: "Transit",
    departureTime: "",
  });

  const [toggles, setToggles] = useState<ProfileToggles>({
    children: false,
    pets: false,
    car: false,
  });

  const [loaded, setLoaded] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    Promise.all([loadProfileData(), loadProfileToggles()]).then(
      ([d, t]) => {
        setData(d);
        setToggles(t);
        setLoaded(true);
      }
    );
  }, []);

  // Slide in when loaded
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, []);

  // Auto-save data whenever it changes (after initial load)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (!loaded) return;
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    saveProfileData(data);
  }, [data, loaded]);

  // Auto-save toggles whenever they change (after initial load)
  const isFirstToggleRender = useRef(true);
  useEffect(() => {
    if (!loaded) return;
    if (isFirstToggleRender.current) { isFirstToggleRender.current = false; return; }
    saveProfileToggles(toggles);
  }, [toggles, loaded]);

  function updateData(field: keyof ProfileData, value: string) {
    setData((d) => ({ ...d, [field]: value }));
  }

  return (
    <>
      {/* Overlay — closes everything on tap */}
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
            Profile
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
          {/* ── IDENTITY ── */}
          <SectionLabel label="IDENTITY" />
          <PanelField
            label="Name"
            value={data.name}
            onChangeText={(v) => updateData("name", v)}
            placeholder="Your name"
          />
          <PanelField
            label="Email"
            value={data.email}
            onChangeText={(v) => updateData("email", v)}
            placeholder="you@email.com"
            keyboardType="email-address"
          />

          {/* ── SEARCH ── */}
          <SectionLabel label="SEARCH" />
          <View style={{ gap: 5 }}>
            <Text style={fieldLabel}>Search Mode</Text>
            <View style={{ flexDirection: "row", gap: 6 }}>
              {(["Buy", "Rent"] as const).map((mode) => (
                <Pressable
                  key={mode}
                  onPress={() => updateData("searchMode", mode)}
                  style={{
                    flex: 1,
                    paddingVertical: 9,
                    borderRadius: 9,
                    borderWidth: 1,
                    alignItems: "center",
                    borderColor:
                      data.searchMode === mode
                        ? colors.primaryBlue
                        : colors.border,
                    backgroundColor:
                      data.searchMode === mode
                        ? `${colors.primaryBlue}18`
                        : colors.cardHover,
                  }}
                >
                  <Text
                    style={{
                      color:
                        data.searchMode === mode
                          ? colors.primaryBlue
                          : colors.textPrimary,
                      fontSize: 13,
                      fontWeight: "700",
                    }}
                  >
                    {mode}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* ── COMMUTE ── */}
          <SectionLabel label="COMMUTE" />
          <PanelField
            label="Work Address"
            value={data.workAddress}
            onChangeText={(v) => updateData("workAddress", v)}
            placeholder="Street, City, State"
          />
          <View style={{ gap: 5 }}>
            <Text style={fieldLabel}>Commute Method</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
              {COMMUTE_METHODS.map((method) => (
                <Pressable
                  key={method}
                  onPress={() => updateData("commuteMethod", method)}
                  style={{
                    paddingVertical: 7,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor:
                      data.commuteMethod === method
                        ? colors.primaryBlue
                        : colors.border,
                    backgroundColor:
                      data.commuteMethod === method
                        ? `${colors.primaryBlue}18`
                        : colors.cardHover,
                  }}
                >
                  <Text
                    style={{
                      color:
                        data.commuteMethod === method
                          ? colors.primaryBlue
                          : colors.textPrimary,
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    {method}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <PanelField
            label="Usual Departure Time"
            value={data.departureTime}
            onChangeText={(v) => updateData("departureTime", v)}
            placeholder="e.g. 8:30 AM"
          />

          {/* ── LIFESTYLE ── */}
          <SectionLabel label="LIFESTYLE" />
          <PanelToggle
            label="Children"
            value={toggles.children}
            onValueChange={(v) => setToggles((t) => ({ ...t, children: v }))}
          />
          <PanelToggle
            label="Pets"
            value={toggles.pets}
            onValueChange={(v) => setToggles((t) => ({ ...t, pets: v }))}
          />
          <PanelToggle
            label="Car"
            value={toggles.car}
            onValueChange={(v) => setToggles((t) => ({ ...t, car: v }))}
          />
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
    <Text
      style={[
        headingLabel,
        { fontSize: 10, marginBottom: -4 },
      ]}
    >
      {label}
    </Text>
  );
}

function PanelField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: any;
}) {
  return (
    <View style={{ gap: 5 }}>
      <Text style={fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? ""}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType ?? "default"}
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

function PanelToggle({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 2,
      }}
    >
      <Text
        style={{
          color: colors.textPrimary,
          fontSize: 13,
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primaryBlue }}
        thumbColor={colors.textPrimary}
      />
    </View>
  );
}
