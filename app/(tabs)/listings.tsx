import React, { useMemo, useState } from "react";
import { SafeAreaView, View, Text, Pressable } from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { typography } from "../../styles/typography";
import { TopBar } from "../../components/TopBar";
import { SidePanel } from "../../components/SidePanel";
import { MenuSheet } from "../../components/MenuSheet";
import { ListingCard } from "../../components/ListingCard";
import { mockListings } from "../../lib/mockListings";
import type { Listing } from "../../lib/types";

export default function ListingsTab() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Listing | null>(null);

  // Split into groups, pinned preferred above non-preferred (no crossing boundary)
  const [preferred, setPreferred] = useState<Listing[]>(() => mockListings.filter((l) => l.preferred));
  const [others, setOthers] = useState<Listing[]>(() => mockListings.filter((l) => !l.preferred));

  const data = useMemo(() => [...preferred, ...others], [preferred, others]);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Listing>) => {
    const isPreferredGroup = item.preferred;

    return (
      <Pressable
        onLongPress={drag}
        delayLongPress={220}
        style={{
          opacity: isActive ? 0.9 : 1,
          paddingBottom: spacing.md,
        }}
      >
        <ListingCard
          item={item}
          onPressCompare={() => {}}
          onPressView={() => {
            setSelected(item);
            setDetailOpen(true);
          }}
          onPressEdit={() => {}}
          onPressDelete={() => {}}
        />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar onPressMenu={() => setMenuOpen(true)} />

      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={typography.h2}>Listings</Text>
        <Pressable
          onPress={() => setFilterOpen(true)}
          style={({ pressed }) => ({
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: pressed ? colors.cardHover : colors.card,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
          })}
        >
          <Text style={[typography.muted, { fontWeight: "800", color: colors.textPrimary }]}>Filters</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1, paddingHorizontal: spacing.lg }}>
        {/* Preferred group */}
        <Text style={[typography.muted, { marginBottom: spacing.sm }]}>Preferred</Text>
        <DraggableFlatList
          data={preferred}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => setPreferred(data)}
          renderItem={renderItem}
        />

        <View style={{ height: spacing.lg }} />

        {/* Others group */}
        <Text style={[typography.muted, { marginBottom: spacing.sm }]}>Other</Text>
        <DraggableFlatList
          data={others}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => setOthers(data)}
          renderItem={renderItem}
        />
      </View>

      {/* Left slide-out menu */}
      <SidePanel visible={menuOpen} side="left" onClose={() => setMenuOpen(false)}>
        <MenuSheet
          onGoProfile={() => setMenuOpen(false)}
          onGoSettings={() => setMenuOpen(false)}
          onClose={() => setMenuOpen(false)}
        />
      </SidePanel>

      {/* Left slide-out filters */}
      <SidePanel visible={filterOpen} side="left" onClose={() => setFilterOpen(false)}>
        <FilterPanel onClose={() => setFilterOpen(false)} />
      </SidePanel>

      {/* Right slide-out details */}
      <SidePanel visible={detailOpen} side="right" onClose={() => setDetailOpen(false)}>
        <DetailPanel item={selected} />
      </SidePanel>
    </SafeAreaView>
  );
}

function FilterPanel({ onClose }: { onClose: () => void }) {
  return (
    <View style={{ flex: 1, padding: spacing.lg, gap: 14 }}>
      <Text style={typography.h2}>Filters</Text>
      <Text style={typography.muted}>First pass: UI shell only. Next build wires to Baseline + Categories.</Text>

      <View style={{ flex: 1 }} />

      <Pressable
        onPress={onClose}
        style={({ pressed }) => ({
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: pressed ? colors.cardHover : colors.card,
          borderRadius: 12,
          paddingVertical: 12,
          alignItems: "center",
        })}
      >
        <Text style={[typography.body, { fontWeight: "800" }]}>Close</Text>
      </Pressable>
    </View>
  );
}

function DetailPanel({ item }: { item: Listing | null }) {
  if (!item) {
    return (
      <View style={{ flex: 1, padding: spacing.lg }}>
        <Text style={typography.muted}>No listing selected.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: spacing.lg, gap: 10 }}>
      <Text style={typography.h2}>{item.buildingName}</Text>
      <Text style={typography.muted}>{item.addressLine}</Text>
      <Text style={typography.muted}>{item.unitSummary}</Text>
      <Text style={[typography.body, { fontWeight: "800" }]}>${item.monthlyTotal.toLocaleString()} / mo</Text>
      <Text style={typography.muted}>{item.source}</Text>

      <View style={{ flex: 1 }} />

      <Text style={typography.muted}>First pass: detail panel shell.</Text>
    </View>
  );
}
