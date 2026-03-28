// components/ProfilePanel.tsx — Build 3.2.15
// Added: Departure Time converted from free-text to TIME_OPTIONS SelectRow.
//        commuteSnapshot ref — captures workAddress/commuteMethod/departureTime on open.
//        handleClose — if any commute field changed and workAddress not blank,
//        fires recalculateAllCommutes (fire-and-forget) before calling onClose.
//        Picker modal for Departure Time selection.

import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
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

const COMMUTE_METHODS: Array<ProfileData["commuteMethod"]> = [
  "Walk", "Drive", "Transit", "Bike",
];

const TIME_OPTIONS = [
  "6:00 AM","6:30 AM","7:00 AM","7:30 AM","8:00 AM","8:30 AM","9:00 AM","9:30 AM",
  "10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM",
  "2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM",
  "6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM",
];

// ── Sub-components defined outside component ──────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <Text style={{ color: colors.textSecondary, fontSize: 10, fontWeight: "800", letterSpacing: 0.8, marginTop: 12, marginBottom: 4 }}>
      {label}
    </Text>
  );
}

function PanelField({ label, value, onChangeText, placeholder, keyboardType }: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder?: string; keyboardType?: any;
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
          backgroundColor: colors.cardHover, borderWidth: 1, borderColor: colors.border,
          borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7,
          color: colors.textPrimary, fontSize: 12,
        }}
      />
    </View>
  );
}

function PanelSelectRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <View style={{ gap: 3, marginBottom: 6 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 10, fontWeight: "700", letterSpacing: 0.4 }}>{label}</Text>
      <Pressable
        onPress={onPress}
        style={{
          backgroundColor: colors.cardHover, borderWidth: 1, borderColor: colors.border,
          borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7,
          flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <Text style={{ color: value ? colors.textPrimary : colors.textSecondary, fontSize: 12 }}>
          {value || "Select"}
        </Text>
        <Ionicons name="chevron-down" size={12} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

// ── Main component ────────────────────────────────────────────────

export function ProfilePanel({ topOffset, onClose }: Props) {
  const screenW = Dimensions.get("window").width;
  const panelW  = Math.floor(screenW / 2);
  const translateX = useRef(new Animated.Value(-panelW)).current;

  const [data, setData] = useState<ProfileData>({
    name: "", email: "", searchMode: "Rent",
    workAddress: "", commuteMethod: "Transit", departureTime: "",
  });
  const [toggles, setToggles] = useState<ProfileToggles>({ children: false, pets: false, car: false });
  const [loaded, setLoaded] = useState(false);

  // Picker state for Departure Time
  const [pickerVisible, setPickerVisible] = useState(false);

  // Snapshot of commute fields captured on open — used to detect changes on close.
  const commuteSnapshot = useRef({ workAddress: "", commuteMethod: "", departureTime: "" });

  useEffect(() => {
    Promise.all([loadProfileData(), loadProfileToggles()]).then(([d, t]) => {
      setData(d);
      setToggles(t);
      // Capture snapshot when data first loads so we can diff on close.
      commuteSnapshot.current = {
        workAddress:   d.workAddress,
        commuteMethod: d.commuteMethod,
        departureTime: d.departureTime,
      };
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    Animated.timing(translateX, { toValue: 0, duration: 180, useNativeDriver: true }).start();
  }, []);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (!loaded) return;
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    saveProfileData(data);
  }, [data, loaded]);

  useEffect(() => {
    if (!loaded) return;
    saveProfileToggles(toggles);
  }, [toggles, loaded]);

  function updateData(field: keyof ProfileData, value: string) {
    setData((d) => ({ ...d, [field]: value }));
  }

  // handleClose: check if any commute field changed; if so fire recalculate-all.
  // The recalculate call is fire-and-forget — close happens immediately regardless.
  function handleClose() {
    const snap = commuteSnapshot.current;
    const commuteChanged =
      data.workAddress   !== snap.workAddress   ||
      data.commuteMethod !== snap.commuteMethod ||
      data.departureTime !== snap.departureTime;

    if (commuteChanged && data.workAddress.trim()) {
      recalculateAllCommutes({
        workAddress:   data.workAddress,
        commuteMethod: data.commuteMethod,
        departureTime: data.departureTime,
      }).catch(() => {});
    }

    onClose();
  }

  const fieldLabel = { color: colors.textSecondary, fontSize: 10, fontWeight: "700" as const, letterSpacing: 0.4, marginBottom: 4 };

  return (
    <>
      {/* Overlay */}
      <Pressable
        onPress={handleClose}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.4)" }}
      />

      {/* Panel */}
      <Animated.View style={{
        position: "absolute", top: 0, bottom: 0, left: 0,
        width: panelW,
        backgroundColor: colors.card,
        transform: [{ translateX }],
        shadowColor: "#000", shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.3, shadowRadius: 8,
        elevation: 10,
      }}>
        {/* Header */}
        <View style={{ paddingTop: topOffset + 12, paddingHorizontal: 14, paddingBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text style={headingLabel}>PROFILE</Text>
          <Pressable onPress={handleClose}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">

          {/* ── PERSONAL ── */}
          <SectionLabel label="PERSONAL" />
          <PanelField label="Name" value={data.name} onChangeText={(v) => updateData("name", v)} placeholder="Your name" />
          <PanelField label="Email" value={data.email} onChangeText={(v) => updateData("email", v)} placeholder="your@email.com" keyboardType="email-address" />

          {/* ── SEARCH MODE ── */}
          <SectionLabel label="SEARCH MODE" />
          <View style={{ flexDirection: "row", gap: 6, marginBottom: 6 }}>
            {(["Rent", "Buy"] as Array<ProfileData["searchMode"]>).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => updateData("searchMode", mode)}
                style={{ flex: 1, paddingVertical: 7, borderRadius: 8, borderWidth: 1, alignItems: "center", borderColor: data.searchMode === mode ? colors.primaryBlue : colors.border, backgroundColor: data.searchMode === mode ? `${colors.primaryBlue}18` : colors.cardHover }}
              >
                <Text style={{ color: data.searchMode === mode ? colors.primaryBlue : colors.textPrimary, fontSize: 12, fontWeight: "700" }}>{mode}</Text>
              </Pressable>
            ))}
          </View>

          {/* ── COMMUTE ── */}
          <SectionLabel label="COMMUTE" />
          <PanelField label="Work Address" value={data.workAddress} onChangeText={(v) => updateData("workAddress", v)} placeholder="Street, City, State" />

          <View style={{ gap: 5 }}>
            <Text style={fieldLabel}>Commute Method</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
              {COMMUTE_METHODS.map((method) => (
                <Pressable
                  key={method}
                  onPress={() => updateData("commuteMethod", method)}
                  style={{ paddingVertical: 7, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: data.commuteMethod === method ? colors.primaryBlue : colors.border, backgroundColor: data.commuteMethod === method ? `${colors.primaryBlue}18` : colors.cardHover }}
                >
                  <Text style={{ color: data.commuteMethod === method ? colors.primaryBlue : colors.textPrimary, fontSize: 12, fontWeight: "700" }}>{method}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={{ marginTop: 6 }}>
            <PanelSelectRow
              label="Usual Departure Time"
              value={data.departureTime}
              onPress={() => setPickerVisible(true)}
            />
            {data.departureTime ? (
              <Pressable onPress={() => updateData("departureTime", "")} style={{ alignSelf: "flex-start", marginTop: 2 }}>
                <Text style={{ color: colors.textSecondary, fontSize: 10 }}>Clear</Text>
              </Pressable>
            ) : null}
          </View>

          {/* ── LIFESTYLE ── */}
          <SectionLabel label="LIFESTYLE" />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Text style={{ color: colors.textPrimary, fontSize: 13 }}>Children</Text>
            <Switch value={toggles.children} onValueChange={(v) => setToggles((t) => ({ ...t, children: v }))} trackColor={{ false: colors.border, true: colors.primaryBlue }} thumbColor="#fff" />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Text style={{ color: colors.textPrimary, fontSize: 13 }}>Pets</Text>
            <Switch value={toggles.pets} onValueChange={(v) => setToggles((t) => ({ ...t, pets: v }))} trackColor={{ false: colors.border, true: colors.primaryBlue }} thumbColor="#fff" />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 }}>
            <Text style={{ color: colors.textPrimary, fontSize: 13 }}>Car</Text>
            <Switch value={toggles.car} onValueChange={(v) => setToggles((t) => ({ ...t, car: v }))} trackColor={{ false: colors.border, true: colors.primaryBlue }} thumbColor="#fff" />
          </View>

        </ScrollView>
      </Animated.View>

      {/* Departure Time Picker Modal */}
      <Modal visible={pickerVisible} transparent animationType="slide">
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} onPress={() => setPickerVisible(false)} />
        <View style={{ backgroundColor: colors.card, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: 400 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: "700" }}>Departure Time</Text>
            <Pressable onPress={() => setPickerVisible(false)}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
          <ScrollView>
            {TIME_OPTIONS.map((opt) => (
              <Pressable
                key={opt}
                onPress={() => { updateData("departureTime", opt); setPickerVisible(false); }}
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 13, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}
              >
                <Text style={{ color: data.departureTime === opt ? colors.primaryBlue : colors.textPrimary, fontSize: 14 }}>{opt}</Text>
                {data.departureTime === opt && <Ionicons name="checkmark" size={16} color={colors.primaryBlue} />}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
