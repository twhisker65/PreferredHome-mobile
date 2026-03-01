import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, Pressable } from "react-native";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { typography } from "../../styles/typography";
import { TopBar } from "../../components/TopBar";
import { SidePanel } from "../../components/SidePanel";
import { MenuSheet } from "../../components/MenuSheet";

export default function AddTab() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar onPressMenu={() => setMenuOpen(true)} />

      <View style={{ padding: spacing.lg, gap: 12 }}>
        <Text style={typography.h2}>Add Listing</Text>

        <Accordion title="Core">
          <Field label="Listing URL" placeholder="https://..." />
          <Field label="Building Name" placeholder="e.g., The Rowan" />
          <Field label="Address + Unit" placeholder="Full address + unit" />
        </Accordion>

        <Accordion title="Unit">
          <Field label="Unit Type" placeholder="Apartment / Condo / ..." />
          <Field label="Beds" placeholder="2" keyboardType="numeric" />
          <Field label="Baths" placeholder="2" keyboardType="numeric" />
          <Field label="Sqft" placeholder="1120" keyboardType="numeric" />
        </Accordion>

        <Accordion title="Pricing">
          <Field label="Rent" placeholder="3500" keyboardType="numeric" />
          <Field label="Fees" placeholder="350" keyboardType="numeric" />
        </Accordion>

        <Pressable
          onPress={() => {}}
          style={({ pressed }) => ({
            marginTop: spacing.md,
            backgroundColor: pressed ? colors.accentBlue : colors.primaryBlue,
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: "center",
          })}
        >
          <Text style={[typography.body, { fontWeight: "900" }]}>Save (placeholder)</Text>
        </Pressable>

        <Text style={[typography.muted, { marginTop: spacing.sm }]}>
          First pass: UI scaffold only. Next build wires to POST /listings.
        </Text>
      </View>

      <SidePanel visible={menuOpen} side="left" onClose={() => setMenuOpen(false)}>
        <MenuSheet onGoProfile={() => setMenuOpen(false)} onGoSettings={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)} />
      </SidePanel>
    </SafeAreaView>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <View style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, borderRadius: 14, overflow: "hidden" }}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={({ pressed }) => ({
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          backgroundColor: pressed ? colors.cardHover : colors.card,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        })}
      >
        <Text style={[typography.body, { fontWeight: "900" }]}>{title}</Text>
        <Text style={[typography.body, { fontWeight: "900", color: colors.textSecondary }]}>{open ? "−" : "+"}</Text>
      </Pressable>

      {open ? <View style={{ padding: spacing.lg, gap: 10 }}>{children}</View> : null}
    </View>
  );
}

function Field({
  label,
  placeholder,
  keyboardType,
}: {
  label: string;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={[typography.muted, { fontWeight: "800" }]}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType ?? "default"}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.background,
          color: colors.textPrimary,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 12,
        }}
      />
    </View>
  );
}
