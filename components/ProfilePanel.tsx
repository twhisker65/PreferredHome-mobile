// components/ProfilePanel.tsx — Build 3.2.15.2 Hotfix
// Fix: Departure Time reverted to plain PanelField (TextInput).
// The Modal added in 3.2.15 and the inline ScrollView added in 3.2.15.1
// both break compare table scroll reconciliation in React Native.
// Plain TextInput carries no scroll side effects.
// commuteSnapshot ref and handleClose recalculate-all logic unchanged from 3.2.15.

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
import { recalculateAllCommutes } from "../lib/api";

type Props = {
  topOffset: number;
  onClose: () => void;
};

// ── Constants defined outside component ──────────────────────────

const COMMUTE_METHODS: Array<ProfileData["commuteMethod"]> = [
  "Walk", "Drive", "Transit", "Bike",
];

const SEARCH_MODES: Array<ProfileData["searchMode"]> = ["Rent", "Buy"];

// ── Sub-components defined outside component ──────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <Text style={{ color: colors.textSecondary, fontSize: 10, fontWeight: "800", letterSpacing: 0.8, marginTop: 12, marginBottom: 4 }}>
      {label}
    </Text>
  );
}

function PanelField({ label, value, onChangeText, placeholder, keyboardType }: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: any;
}) {
  return (
    <View style={{ gap: 3, marginBottom: 6 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 10, fontWeight: "700", letterSpacing: 0.4 }}>{label}</Text>
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
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 7,
          color: colors.textPrimary,
          fontSize: 12,
        }}
      />
    </View>
  );
}

// ── Main component ────────────────────────────────────────────────

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

  // Snapshot of commute fields taken when panel opens — used to detect changes on close
  const commuteSnapshot = useRef({
    workAddress: "",
    commuteMethod: "Transit" as ProfileData["commuteMethod"],
    departureTime: "",
  });

  // Load saved data on mount and snapshot commute fields
  useEffect(() => {
    Promise.all([loadProfileData(), loadProfileToggles()]).then(([d, t]) => {
      setData(d);
      setToggles(t);
      setLoaded(true);
      commuteSnapshot.current = {
        workAddress: d.workAddress,
        commuteMethod: d.commuteMethod,
        departureTime: d.departureTime,
      };
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

  // On close: check if any commute field changed — if so fire recalculate-all
  function handleClose() {
    const snap = commuteSnapshot.current;
    const commuteChanged =
      data.workAddress !== snap.workAddress ||
      data.commuteMethod !== snap.commuteMethod ||
      data.departureTime !== snap.departureTime;

    if (commuteChanged && data.workAddress.trim()) {
      recalculateAllCommutes({
        workAddress: data.workAddress,
        commuteMethod: data.commuteMethod,
        departureTime: data.departureTime,
      }).catch(() => {});
    }

    onClose();
  }

  const fieldLabel = { color: colors.textSecondary, fontSize: 10, fontWeight: "700" as const, letterSpacing: 0.4 };

  return (
    <>
      {/* Overlay — closes panel on tap */}
      <Pressable
        onPress={handleClose}
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
          <Text style={{ ...headingLabel, fontSize: 13 }}>PROFILE</Text>
          <Pressable onPress={handleClose} hitSlop={12}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 14, gap: 4, paddingBottom: 40 }}
        >
          {/* ── PERSONAL ── */}
          <SectionLabel label="PERSONAL" />
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
              {SEARCH_MODES.map((mode) => (
                <Pressable
                  key={mode}
                  onPress={() => updateData("searchMode", mode)}
                  style={{
                    flex: 1,
                    paddingVertical: 9,
                    borderRadius: 9,
                    borderWidth: 1,
                    alignItems: "center",
                    borderColor: data.searchMode === mode ? colors.primaryBlue : colors.border,
                    backgroundColor: data.searchMode === mode ? `${colors.primaryBlue}18` : colors.cardHover,
                  }}
                >
                  <Text style={{
                    color: data.searchMode === mode ? colors.primaryBlue : colors.textPrimary,
                    fontSize: 12,
                    fontWeight: "700",
                  }}>
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
                    borderColor: data.commuteMethod === method ? colors.primaryBlue : colors.border,
                    backgroundColor: data.commuteMethod === method ? `${colors.primaryBlue}18` : colors.cardHover,
                  }}
                >
                  <Text style={{
                    color: data.commuteMethod === method ? colors.primaryBlue : colors.textPrimary,
                    fontSize: 12,
                    fontWeight: "700",
                  }}>
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
            placeholder="e.g. 8:00 AM"
          />

          {/* ── LIFESTYLE ── */}
          <SectionLabel label="LIFESTYLE" />

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Text style={{ color: colors.textPrimary, fontSize: 13 }}>Children</Text>
            <Switch
              value={toggles.children}
              onValueChange={(v) => setToggles((t) => ({ ...t, children: v }))}
              trackColor={{ false: colors.border, true: colors.primaryBlue }}
              thumbColor="#fff"
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Text style={{ color: colors.textPrimary, fontSize: 13 }}>Pets</Text>
            <Switch
              value={toggles.pets}
              onValueChange={(v) => setToggles((t) => ({ ...t, pets: v }))}
              trackColor={{ false: colors.border, true: colors.primaryBlue }}
              thumbColor="#fff"
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 13 }}>Car</Text>
            <Switch
              value={toggles.car}
              onValueChange={(v) => setToggles((t) => ({ ...t, car: v }))}
              trackColor={{ false: colors.border, true: colors.primaryBlue }}
              thumbColor="#fff"
            />
          </View>

        </ScrollView>
      </Animated.View>
    </>
  );
}
