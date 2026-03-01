import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ActivityIndicator, RefreshControl, SectionList, Pressable } from "react-native";
import { colors } from "../../styles/colors";
import { TopBar } from "../../components/TopBar";
import { ListingCard } from "../../components/ListingCard";
import { useListings } from "../../lib/useListings";
import { applyOrder } from "../../lib/orderApply";
import { loadOrder } from "../../lib/orderStorage";
import type { ListingUI } from "../../lib/types";

type Section = { title: string; data: ListingUI[] };

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 12, letterSpacing: 0.8 }}>
        {title.toUpperCase()}
      </Text>
    </View>
  );
}

export default function ListingsScreen() {
  const { listings, loading, refreshing, error, refresh } = useListings();
  const [preferred, setPreferred] = useState<ListingUI[]>([]);
  const [other, setOther] = useState<ListingUI[]>([]);

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
      { title: "Other", data: other },
    ],
    [preferred, other]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="PreferredHome" />
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
              <ListingCard listing={item} />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={
            <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ color: colors.text, fontSize: 22, fontWeight: "800" }}>Listings</Text>

                <Pressable
                  onPress={() => {}}
                  style={({ pressed }) => [
                    {
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: colors.border,
                      backgroundColor: pressed ? "rgba(255,255,255,0.04)" : "transparent",
                    },
                  ]}
                >
                  <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: "700" }}>Filter</Text>
                </Pressable>
              </View>

              <Text style={{ color: colors.textSecondary, marginTop: 6, fontSize: 13 }}>
                Drag-sort is temporarily disabled while we stabilize scrolling and layout.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
