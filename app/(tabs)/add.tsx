// app/(tabs)/add.tsx — Build 3.2.16
// Refactored to use shared ListingForm component.
// All form logic, option arrays, and sub-components live in components/ListingForm.tsx.
// This screen handles: profile/toggle loading, postListing API call,
// commute calculation fire-and-forget, and post-save navigation.

import React, { useCallback, useRef, useState } from "react";
import { Alert, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../styles/colors";
import { TopBar } from "../../components/TopBar";
import { MenuPanel, type SubPanelKey } from "../../components/MenuPanel";
import { ProfilePanel } from "../../components/ProfilePanel";
import { CriteriaPanel } from "../../components/CriteriaPanel";
import { SettingsPanel } from "../../components/SettingsPanel";
import { postListing, calculateCommute } from "../../lib/api";
import { loadProfileToggles, loadProfileData, type ProfileToggles, type ProfileData } from "../../lib/profileStorage";
import ListingForm, { BLANK_DRAFT, type Draft } from "../../components/ListingForm";

export default function AddScreen() {
  const insets = useSafeAreaInsets();
  const topBarHeight = insets.top + 53;
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubPanel, setActiveSubPanel] = useState<SubPanelKey | null>(null);
  const [toggles, setToggles] = useState<ProfileToggles>({ children: false, pets: false, car: false });
  const profileRef = useRef<ProfileData | null>(null);
  // formKey increments after each successful save to remount ListingForm with a blank draft
  const [formKey, setFormKey] = useState(0);

  useFocusEffect(useCallback(() => {
    loadProfileToggles().then(setToggles);
    loadProfileData().then(p => { profileRef.current = p; });
  }, []));

  async function handleSave(payload: any, draft: Draft) {
    setSaving(true);
    try {
      const saved = await postListing(payload);
      // Fire commute calculation as a separate call after save — fire-and-forget.
      const workAddress = profileRef.current?.workAddress ?? "";
      if (workAddress.trim() && saved?.id && draft.streetAddress.trim()) {
        calculateCommute(saved.id, {
          workAddress,
          commuteMethod: profileRef.current?.commuteMethod ?? "Transit",
          departureTime: profileRef.current?.departureTime ?? "",
        }).catch(() => {});
      }
      setFormKey((k) => k + 1);
      Alert.alert("Saved", "Listing added successfully.", [{ text: "OK", onPress: () => router.push("/(tabs)/listings") }]);
    } catch (err: any) {
      Alert.alert("Save Failed", err?.message ?? "Something went wrong. Please try again.");
    } finally { setSaving(false); }
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="PreferredHome" onPressMenu={() => setMenuOpen(true)} />

      <ListingForm
        key={formKey}
        initialDraft={BLANK_DRAFT}
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
  );
}
