// components/ProfilePanel.tsx — Build 3.2.21.1 Hotfix
// Changes from 3.2.21:
//   SectionLabel: textStyles.label properties → textStyles.sectionTitle.
//     Section/group headings inside body now use the correct hierarchy token.
//   PanelField input value fontSize: textStyles.bodySmall.fontSize → textStyles.bodyPrimary.fontSize.
//     Field values are now visually primary (white, 14) vs labels (grey, 12).
// No structural, behavioral, save-logic, or layout changes.
// Full-page layout, sub-header, sub-footer, Clear/Save behavior all preserved from 3.2.21.
// All sub-components defined outside export function (DRIFT 10).

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
import { textStyles } from "../styles/typography";
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

// ── Sub-components defined outside component (DRIFT 10) ───────────

// sectionTitle token for group headings inside the panel body.
function SectionLabel({ label }: { label: string }) {
  return (
    <Text style={[textStyles.sectionTitle, { marginTop: 16, marginBottom: 6 }]}>
      {label}
    </Text>
  );
}

function PanelField({ label, value, onChangeText, placeholder, keyboardType }: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder?: string; keyboardType?: any;
}) {
  return (
    <View style={{ gap: 3, marginBottom: 8 }}>
      <Text style={textStyles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder ?? ""}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType ?? "default"}
        style={{
          backgroundColor: colors.surfacePressed,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 7,
          color: colors.textPrimary,
          fontSize: textStyles.bodyPrimary.fontSize,
        }}
      />
    </View>
  );
}

// ── Main component ────────────────────────────────────────────────

export function ProfilePanel({ topOffset, onClose }: Props) {
  const screenW = Dimensions.get("window").width;
  const translateX = useRef(new Animated.Value(-screenW)).current;

  const [data, setData] = useState<ProfileData>({
    name: "", email: "", searchMode: "Rent",
    workAddress: "", commuteMethod: "Transit", departureTime: "",
  });
  const [toggles, setToggles] = useState<ProfileToggles>({ children: false, pets: false, car: false });
  const [loaded, setLoaded] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const commuteSnapshot = useRef({ workAddress: "", commuteMethod: "", departureTime: "" });

  useEffect(() => {
    Promise.all([loadProfileData(), loadProfileToggles()]).then(([d, t]) => {
      setData(d);
      setToggles(t);
      commuteSnapshot.current = {
        workAddress:   d.workAddress,
        commuteMethod: d.commuteMethod,
        departureTime: d.departureTime,
      };
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    Animated.timing(translateX, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [loaded]);

  function updateData<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setData((d) => {
      const next = { ...d, [key]: value };
      saveProfileData(next).catch(() => {});
      return next;
    });
  }

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

  function handleClear() {
    const blank: ProfileData = {
      name: "", email: "", searchMode: "Rent",
      workAddress: "", commuteMethod: "Transit", departureTime: "",
    };
    setData(blank);
    saveProfileData(blank).catch(() => {});
    commuteSnapshot.current = { workAddress: "", commuteMethod: "Transit", departureTime: "" };
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
      shadowOffset: { width: 4, height: 0 },
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
        <Pressable onPress={handleClose} style={{ position: "absolute", left: 16, zIndex: 1, padding: 4 }}>
          <Ionicons name="chevron-back" size={22} color={colors.accent} />
        </Pressable>
        <Text style={{
          flex: 1, textAlign: "center",
          color: colors.textPrimary,
          fontSize: textStyles.subHeader.fontSize,
          fontWeight: textStyles.subHeader.fontWeight,
        }}>
          Profile
        </Text>
      </View>

      {/* Scrollable body */}
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── PERSONAL ── */}
        <SectionLabel label="PERSONAL" />
        <PanelField label="Name" value={data.name} onChangeText={(v) => updateData("name", v)} placeholder="Your name" />
        <PanelField label="Email" value={data.email} onChangeText={(v) => updateData("email", v)} placeholder="your@email.com" keyboardType="email-address" />

        {/* ── SEARCH MODE ── */}
        <SectionLabel label="SEARCH MODE" />
        <View style={{ flexDirection: "row", gap: 6, marginBottom: 8 }}>
          {(["Rent", "Buy"] as Array<ProfileData["searchMode"]>).map((mode) => (
            <Pressable
              key={mode}
              onPress={() => updateData("searchMode", mode)}
              style={{
                flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1, alignItems: "center",
                borderColor: data.searchMode === mode ? colors.accent : colors.border,
                backgroundColor: data.searchMode === mode ? `${colors.accent}18` : colors.surfacePressed,
              }}
            >
              <Text style={{ color: data.searchMode === mode ? colors.accent : colors.textPrimary, fontSize: textStyles.bodyPrimary.fontSize, fontWeight: "700" }}>{mode}</Text>
            </Pressable>
          ))}
        </View>

        {/* ── COMMUTE ── */}
        <SectionLabel label="COMMUTE" />
        <PanelField label="Work Address" value={data.workAddress} onChangeText={(v) => updateData("workAddress", v)} placeholder="Street, City, State" />

        <View style={{ gap: 6, marginBottom: 8 }}>
          <Text style={textStyles.label}>Commute Method</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {COMMUTE_METHODS.map((method) => (
              <Pressable
                key={method}
                onPress={() => updateData("commuteMethod", method)}
                style={{
                  paddingVertical: 7, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1,
                  borderColor: data.commuteMethod === method ? colors.accent : colors.border,
                  backgroundColor: data.commuteMethod === method ? `${colors.accent}18` : colors.surfacePressed,
                }}
              >
                <Text style={{ color: data.commuteMethod === method ? colors.accent : colors.textPrimary, fontSize: textStyles.bodyPrimary.fontSize, fontWeight: "700" }}>{method}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 8 }}>
          <Text style={textStyles.label}>Departure Time</Text>
          <Pressable
            onPress={() => setPickerVisible(true)}
            style={{
              marginTop: 4,
              backgroundColor: colors.surfacePressed,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 9,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: data.departureTime ? colors.textPrimary : colors.textSecondary, fontSize: textStyles.bodyPrimary.fontSize }}>
              {data.departureTime || "Select time"}
            </Text>
            {data.departureTime ? (
              <Pressable onPress={() => updateData("departureTime", "")}>
                <Text style={{ color: colors.textSecondary, fontSize: textStyles.micro.fontSize }}>Clear</Text>
              </Pressable>
            ) : (
              <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
            )}
          </Pressable>
        </View>

        {/* ── LIFESTYLE ── */}
        <SectionLabel label="LIFESTYLE" />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text style={{ color: colors.textPrimary, fontSize: textStyles.bodyPrimary.fontSize }}>Children</Text>
          <Switch value={toggles.children} onValueChange={(v) => {
            const next = { ...toggles, children: v };
            setToggles(next);
            saveProfileToggles(next).catch(() => {});
          }} trackColor={{ false: colors.border, true: colors.accent }} thumbColor="#fff" />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text style={{ color: colors.textPrimary, fontSize: textStyles.bodyPrimary.fontSize }}>Pets</Text>
          <Switch value={toggles.pets} onValueChange={(v) => {
            const next = { ...toggles, pets: v };
            setToggles(next);
            saveProfileToggles(next).catch(() => {});
          }} trackColor={{ false: colors.border, true: colors.accent }} thumbColor="#fff" />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 }}>
          <Text style={{ color: colors.textPrimary, fontSize: textStyles.bodyPrimary.fontSize }}>Car</Text>
          <Switch value={toggles.car} onValueChange={(v) => {
            const next = { ...toggles, car: v };
            setToggles(next);
            saveProfileToggles(next).catch(() => {});
          }} trackColor={{ false: colors.border, true: colors.accent }} thumbColor="#fff" />
        </View>
      </ScrollView>

      {/* Sub-footer — Clear and Save */}
      <View style={{
        flexDirection: "row", gap: 8, padding: 14,
        borderTopWidth: 1, borderTopColor: colors.border,
        backgroundColor: colors.surface,
      }}>
        <Pressable
          onPress={handleClear}
          style={({ pressed }) => ({
            flex: 1, paddingVertical: 11, borderRadius: 10,
            borderWidth: 1, borderColor: colors.border,
            alignItems: "center",
            backgroundColor: colors.surfacePressed,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text style={textStyles.button}>Clear</Text>
        </Pressable>
        <Pressable
          onPress={handleClose}
          style={({ pressed }) => ({
            flex: 1, paddingVertical: 11, borderRadius: 10,
            alignItems: "center",
            backgroundColor: colors.accent,
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Text style={textStyles.button}>Save</Text>
        </Pressable>
      </View>

      {/* Departure Time Picker Modal */}
      <Modal visible={pickerVisible} transparent animationType="slide">
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} onPress={() => setPickerVisible(false)} />
        <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: 400 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Text style={{ color: textStyles.bodyEmphasis.color, fontSize: textStyles.bodyEmphasis.fontSize, fontWeight: textStyles.bodyEmphasis.fontWeight }}>Departure Time</Text>
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
                <Text style={{ color: data.departureTime === opt ? colors.accent : colors.textPrimary, fontSize: textStyles.bodyPrimary.fontSize }}>{opt}</Text>
                {data.departureTime === opt && <Ionicons name="checkmark" size={16} color={colors.accent} />}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </Animated.View>
  );
}
