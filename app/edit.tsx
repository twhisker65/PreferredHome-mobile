// app/edit.tsx — Build 3.2.21
// Changes from 3.2.20.8:
//   Custom bottom nav component added (EditBottomNav) — rendered at bottom of screen.
//   EditBottomNav is defined outside the main export function (DRIFT 10).
//   EditBottomNav is local to this file only — not extracted to a shared component in this build.
//   Mirrors the tab bar: 5 icons, token colors, router.push() on tap, no active-tab state.
//   No route restructuring. edit.tsx remains at app/edit.tsx.
//   Sub-footer (Save Listing) is handled by ListingForm — no change to save logic.
// No logic, payload, or navigation changes beyond adding the bottom nav.

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

// ── Custom bottom nav — local to edit.tsx only (DRIFT 10) ─────────

const NAV_TABS = [
  { name: "Home",     icon: "home-outline"        as const, route: "/(tabs)/" },
  { name: "Listings", icon: "albums-outline"       as const, route: "/(tabs)/listings" },
  { name: "Add",      icon: "add-circle-outline"   as const, route: "/(tabs)/add" },
  { name: "Compare",  icon: "git-compare-outline"  as const, route: "/(tabs)/compare" },
  { name: "Calendar", icon: "calendar-outline"     as const, route: "/(tabs)/calendar" },
];

function EditBottomNav({ bottomInset }: { bottomInset: number }) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: bottomInset,
      }}
    >
      {NAV_TABS.map((tab) => (
        <Pressable
          key={tab.name}
          onPress={() => router.push(tab.route as any)}
          style={{ flex: 1, alignItems: "center", paddingTop: 8, paddingBottom: 4 }}
        >
          <Ionicons name={tab.icon} size={22} color={colors.textSecondary} />
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: textStyles.navLabel.fontSize,
              lineHeight: textStyles.navLabel.lineHeight,
              marginTop: 2,
            }}
          >
            {tab.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// ── Main screen ────────────────────────────────────────────────────

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

        {/* PreferredHome TopBar with hamburger */}
        <TopBar title="PreferredHome" onPressMenu={() => setMenuOpen(true)} />

        {/* Sub-header — back arrow left, title centered */}
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

        {/* Form — flex: 1 — contains scrollable body and sub-footer Save button */}
        <ListingForm
          initialDraft={initialDraft}
          toggles={toggles}
          saving={saving}
          onSave={handleSave}
          insets={{ bottom: 0 }}
        />

        {/* Custom bottom nav — replaces Expo tab bar for this screen */}
        <EditBottomNav bottomInset={insets.bottom} />

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
