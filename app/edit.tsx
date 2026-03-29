// app/edit.tsx — Build 3.2.16
// Refactored to use shared ListingForm component.
// All form logic, option arrays, and sub-components live in components/ListingForm.tsx.
// This screen handles: listing fetch, profile/toggle loading, updateListing API call,
// commute calculation fire-and-forget, and post-save navigation.

import React, { useEffect, useRef, useState } from "react";
import { Alert, View, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { TopBar } from "../components/TopBar";
import { MenuPanel, type SubPanelKey } from "../components/MenuPanel";
import { ProfilePanel } from "../components/ProfilePanel";
import { CriteriaPanel } from "../components/CriteriaPanel";
import { SettingsPanel } from "../components/SettingsPanel";
import { getListings, updateListing, calculateCommute } from "../lib/api";
import { loadProfileToggles, loadProfileData, type ProfileToggles, type ProfileData } from "../lib/profileStorage";
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
      // Fire commute calculation as a separate call after save — fire-and-forget.
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

  // Show spinner while listing is loading
  if (!initialDraft) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={colors.primaryBlue} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="Edit Listing" onPressMenu={() => setMenuOpen(true)} />

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
  );
}
