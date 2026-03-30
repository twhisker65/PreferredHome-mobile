// app/edit.tsx — Build 3.2.20.8
// Change: font and color token references applied.
//   ActivityIndicator color: colors.primaryBlue → colors.accent
//   Back chevron color: colors.primaryBlue → colors.accent
//   Subtitle bar title fontSize: 16 / fontWeight: "700"
//     → textStyles.subHeader.fontSize / textStyles.subHeader.fontWeight
// No logic, layout, or structural changes.

import React, { useEffect, useRef, useState } from "react";
import { Alert, View, ActivityIndicator, Pressable, Text } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { textStyles } from "../styles/typography";
import { TopBar } from "../components/TopBar";
import { MenuPanel, type SubPanelKey } from "../components/MenuPanel";
import { ProfilePanel } from "../components/ProfilePanel";
import { CriteriaPanel } from "../components/CriteriaPanel";
import { SettingsPanel } from "../components/SettingsPanel";
import { getListings, updateListing, calculateCommute } from "../lib/api";
import { loadProfileToggles, loadProfileData, type ProfileToggles, type ProfileData } from "../lib/profileStorage";
import { confirmDiscard } from "../lib/unsavedChanges";
import ListingForm, { rawToDraft, type Draft } from "../components/ListingForm";

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const topBarHeight = insets.top + 53;
  const [initialDraft, setInitialDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubPanel, setActiveSubPanel] = useState<SubPanelKey | null>(null);
  const [toggles, setToggles] = useState<ProfileToggles>({ children: false, pets: false, car: false });
  const profileRef = useRef<ProfileData | null>(null);

  useEffect(() => {
    loadProfileToggles().then(setToggles);
    loadProfileData().then(p => { profileRef.current = p; });
    if (id) {
      getListings().then((all) => {
        const raw = all.find((r: any) => String(r.id) === String(id));
        if (raw) setInitialDraft(rawToDraft(raw));
        else Alert.alert("Error", "Could not load listing.");
      }).catch(() => Alert.alert("Error", "Could not load listing."));
    }
  }, [id]);

  async function handleSave(payload: any, draft: Draft) {
    setSaving(true);
    try {
      await updateListing(id!, payload);
      const workAddress = profileRef.current?.workAddress ?? "";
      if (workAddress.trim() && id && draft.streetAddress.trim()) {
        calculateCommute(id, {
          workAddress,
          commuteMethod: profileRef.current?.commuteMethod ?? "Transit",
          departureTime: profileRef.current?.departureTime ?? "",
        }).catch(() => {});
      }
      Alert.alert("Saved", "Listing updated successfully.", [{ text: "OK", onPress: () => router.back() }]);
    } catch (err: any) {
      Alert.alert("Save Failed", err?.message ?? "Something went wrong. Please try again.");
    } finally { setSaving(false); }
  }

  if (!initialDraft) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={colors.accent} />
        </View>
      </>
    );
  }

  return (
    <>
      {/* Suppress native Expo Router stack header */}
      <Stack.Screen options={{ headerShown: false }} />

      <View style={{ flex: 1, backgroundColor: colors.background }}>

        {/* PreferredHome TopBar with hamburger — same as all screens */}
        <TopBar title="PreferredHome" onPressMenu={() => setMenuOpen(true)} />

        {/* Page subtitle bar — back arrow left, title centered */}
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        }}>
          <Pressable
            onPress={() => confirmDiscard(() => router.back())}
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
            Edit Listing
          </Text>
        </View>

        <ListingForm
          initialDraft={initialDraft}
          toggles={toggles}
          saving={saving}
          onSave={handleSave}
          insets={insets}
        />

        {/* Menu dropdown */}
        {menuOpen && (
          <MenuPanel
            topOffset={topBarHeight}
            onSelectPanel={(p) => { setMenuOpen(false); setActiveSubPanel(p); }}
            onClose={() => setMenuOpen(false)}
          />
        )}

        {/* Sub-panels */}
        {activeSubPanel === "profile" && (
          <ProfilePanel
            topOffset={topBarHeight}
            onClose={() => {
              loadProfileToggles().then(setToggles);
              loadProfileData().then(p => { profileRef.current = p; });
              setActiveSubPanel(null);
            }}
          />
        )}
        {activeSubPanel === "criteria" && (
          <CriteriaPanel topOffset={topBarHeight} onClose={() => setActiveSubPanel(null)} />
        )}
        {activeSubPanel === "settings" && (
          <SettingsPanel topOffset={topBarHeight} onClose={() => setActiveSubPanel(null)} />
        )}

      </View>
    </>
  );
}
