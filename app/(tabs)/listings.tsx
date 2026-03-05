import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator, RefreshControl, SectionList, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { colors } from "../../styles/colors";
import { headingLabel } from "../../styles/typography";
import { TopBar } from "../../components/TopBar";
import { ListingCard } from "../../components/ListingCard";
import { SidePanel } from "../../components/SidePanel";
import { MenuSheet } from "../../components/MenuSheet";
import { useListings } from "../../lib/useListings";
import { applyOrder } from "../../lib/orderApply";
import { loadOrder } from "../../lib/orderStorage";
import { deleteListing as deleteListingApi } from "../../lib/api";
import type { ListingUI } from "../../lib/types";

type Section = { title: string; data: ListingUI[] };

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 }}>
      <Text style={headingLabel}>{title}</Text>
    </View>
  );
}

export default function ListingsScreen() {
  const { listings, loading, refreshing, error, refresh } = useListings();

  const [preferred, setPreferred] = useState<ListingUI[]>([]);
  const [other, setOther] = useState<ListingUI[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // local-only selections (no persistence in 3.1.05)
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      const saved = await loadOrder();
      const ordered = applyOrder(listings, saved);
      setPreferred(ordered.preferred);
      setOther(ordered.other);
    })();
  }, [listings]);

  const sections: Section[] = useMemo(
    () => [
      { title: "Preferred", data: preferred },
      { title: "Candidates", data: other },
    ],
    [preferred, other]
  );

  function togglePreferred(id: string) {
    const inPreferred = preferred.some((l) => l.id === id);
    const inOther = other.some((l) => l.id === id);

    if (inPreferred) {
      const item = preferred.find((l) => l.id === id);
      if (!item) return;
      const updated = { ...item, preferred: !item.preferred };
      setPreferred((p) => p.filter((l) => l.id !== id));
      setOther((o) => [updated, ...o]);
      return;
    }

    if (inOther) {
      const item = other.find((l) => l.id === id);
      if (!item) return;
      const updated = { ...item, preferred: !item.preferred };
      setOther((o) => o.filter((l) => l.id !== id));
      setPreferred((p) => [updated, ...p]);
      return;
    }
  }

  function toggleCompare(id: string) {
    setCompareIds((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else {
        if (next.size >= 4) return next;
        next.add(id);
      }
      return next;
    });
  }

  function removeLocally(id: string) {
    setPreferred((p) => p.filter((l) => l.id !== id));
    setOther((o) => o.filter((l) => l.id !== id));
    setCompareIds((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
  }

  function deleteListing(id: string) {
    Alert.alert(
      "Delete listing?",
      "This will permanently remove the listing.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // Remove from screen immediately for a fast response
            removeLocally(id);
            try {
              await deleteListingApi(id);
            } catch (err: any) {
              // If the API call fails, restore by refreshing
              Alert.alert(
                "Delete Failed",
                err?.message ?? "The listing was removed from the screen but could not be deleted from the server. Pull to refresh to restore it.",
                [{ text: "OK", onPress: refresh }]
              );
            }
          },
        },
      ]
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="PreferredHome" onPressMenu={() => setMenuOpen(true)} rightIconName="filter" onPressRight={() => setFilterOpen(true)} />

      <SidePanel visible={menuOpen} side="left" onClose={() => setMenuOpen(false)}>
        <MenuSheet
          onGoProfile={() => {
            setMenuOpen(false);
            router.push("/profile");
          }}
          onGoSettings={() => {
            setMenuOpen(false);
            router.push("/settings");
          }}
          onClose={() => setMenuOpen(false)}
        />
      </SidePanel>

      <SidePanel visible={filterOpen} side="right" onClose={() => setFilterOpen(false)}>
        <View style={{ padding: 18, gap: 12 }}>
          <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: "900" }}>Filters</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
            Filter logic is staged for a future build. This panel is the stable UI shell.
          </Text>

          <View style={{ height: 1, backgroundColor: colors.border, marginTop: 6 }} />
          <Text style={{ color: colors.textSecondary, fontSize: 12, letterSpacing: 0.8 }}>PLACEHOLDERS</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>• Status</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>• Max rent</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>• Bedrooms</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>• Neighborhood</Text>
        </View>
      </SidePanel>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ color: colors.textSecondary, marginTop: 10 }}>Loading listings...</Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ color: colors.red, fontSize: 14, marginBottom: 8 }}>Load failed</Text>
          <Text style={{ color: colors.textSecondary }}>{error}</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
              <ListingCard
                listing={item}
                compareSelected={compareIds.has(item.id)}
                onTogglePreferred={() => togglePreferred(item.id)}
                onToggleCompare={() => toggleCompare(item.id)}
                onView={() => Alert.alert("View", "Detail sheet is staged for a future build.")}
                onEdit={() => Alert.alert("Edit", "Edit flow is staged for a future build.")}
                onDelete={() => deleteListing(item.id)}
              />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}
