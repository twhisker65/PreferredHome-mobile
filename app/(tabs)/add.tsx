import React, { useRef, useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { colors } from "../../styles/colors";
import { TopBar } from "../../components/TopBar";
import { SidePanel } from "../../components/SidePanel";
import { MenuSheet } from "../../components/MenuSheet";

type SectionKey = "property" | "costs" | "features" | "contact";

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 18, marginBottom: 12 }}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [
          { paddingHorizontal: 14, paddingVertical: 14, flexDirection: "row", justifyContent: "space-between" },
          pressed && { opacity: 0.85 },
        ]}
      >
        <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "900" }}>{title}</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 18, fontWeight: "900" }}>{open ? "–" : "+"}</Text>
      </Pressable>

      {open ? <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>{children}</View> : null}
    </View>
  );
}

function Field({
  label,
  inputRef,
  onSubmitEditing,
  placeholder,
  keyboardType,
}: {
  label: string;
  inputRef?: any;
  onSubmitEditing?: () => void;
  placeholder?: string;
  keyboardType?: any;
}) {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 6 }}>{label}</Text>
      <TextInput
        ref={inputRef}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 14,
          paddingHorizontal: 12,
          paddingVertical: 12,
          color: colors.textPrimary,
        }}
        keyboardType={keyboardType}
        returnKeyType={onSubmitEditing ? "next" : "done"}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 6 }}>{label}</Text>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => ({
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 14,
          paddingVertical: 12,
          paddingHorizontal: 12,
          backgroundColor: pressed ? colors.cardHover : "transparent",
          flexDirection: "row",
          justifyContent: "space-between",
        })}
      >
        <Text style={{ color: colors.textPrimary, fontWeight: "800" }}>{value ? "Yes" : "No"}</Text>
        <Text style={{ color: colors.textSecondary, fontWeight: "800" }}>Tap to toggle</Text>
      </Pressable>
    </View>
  );
}

function Segmented({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{ color: colors.textSecondary, fontSize: 12, marginBottom: 6 }}>{label}</Text>
      <View style={{ flexDirection: "row", borderWidth: 1, borderColor: colors.border, borderRadius: 14, overflow: "hidden" }}>
        {options.map((opt) => {
          const active = opt === value;
          return (
            <Pressable
              key={opt}
              onPress={() => onChange(opt)}
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 12,
                alignItems: "center",
                backgroundColor: active ? colors.cardHover : pressed ? "rgba(255,255,255,0.04)" : "transparent",
              })}
            >
              <Text style={{ color: active ? colors.textPrimary : colors.textSecondary, fontWeight: "900", fontSize: 12 }}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function AddScreen() {
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    property: true,
    costs: true,
    features: false,
    contact: true,
  });

  const [menuOpen, setMenuOpen] = useState(false);

  // local-only UI state (backend save is staged)
  const [unitType, setUnitType] = useState("Apartment");
  const [isTopFloor, setIsTopFloor] = useState(false);
  const [isCorner, setIsCorner] = useState(false);
  const [isFurnished, setIsFurnished] = useState(false);

  const refs = useRef<TextInput[]>([]);
  const focus = (i: number) => refs.current[i]?.focus();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="PreferredHome" onPressMenu={() => setMenuOpen(true)} />

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

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ color: colors.textPrimary, fontSize: 26, fontWeight: "900" }}>Add Listing</Text>
          <Text style={{ color: colors.textSecondary, marginTop: 6, fontSize: 13 }}>
            Manual entry (save wiring is staged).
          </Text>

          <View style={{ marginTop: 14 }}>
            <Section title="Property" open={open.property} onToggle={() => setOpen((s) => ({ ...s, property: !s.property }))}>
              <Field label="Listing URL" placeholder="https://..." inputRef={(r: any) => (refs.current[0] = r)} onSubmitEditing={() => focus(1)} />
              <Field label="Building Name" placeholder="e.g., The Monroe" inputRef={(r: any) => (refs.current[1] = r)} onSubmitEditing={() => focus(2)} />

              {/* Address split (UI shell; zip lookup staged) */}
              <Field label="Street Address" placeholder="42 Barker Ave" inputRef={(r: any) => (refs.current[2] = r)} onSubmitEditing={() => focus(3)} />
              <Field label="Unit / Apt" placeholder="6D" inputRef={(r: any) => (refs.current[3] = r)} onSubmitEditing={() => focus(4)} />
              <Field label="ZIP" placeholder="10601" keyboardType="number-pad" inputRef={(r: any) => (refs.current[4] = r)} onSubmitEditing={() => focus(5)} />

              <Field label="Neighborhood" placeholder="Optional" inputRef={(r: any) => (refs.current[5] = r)} onSubmitEditing={() => focus(6)} />

              <Segmented label="Unit Type" value={unitType} options={["Apartment", "Condo", "Co-op"]} onChange={setUnitType} />

              <Field label="Beds" placeholder="1" keyboardType="number-pad" inputRef={(r: any) => (refs.current[6] = r)} onSubmitEditing={() => focus(7)} />
              <Field label="Baths" placeholder="1" keyboardType="number-pad" inputRef={(r: any) => (refs.current[7] = r)} onSubmitEditing={() => focus(8)} />
              <Field label="SqFt" placeholder="850" keyboardType="number-pad" inputRef={(r: any) => (refs.current[8] = r)} onSubmitEditing={() => focus(9)} />

              <Field label="Floor" placeholder="6" keyboardType="number-pad" inputRef={(r: any) => (refs.current[9] = r)} onSubmitEditing={() => focus(10)} />
              <ToggleRow label="Top Floor" value={isTopFloor} onToggle={() => setIsTopFloor((v) => !v)} />
              <ToggleRow label="Corner Unit" value={isCorner} onToggle={() => setIsCorner((v) => !v)} />
              <ToggleRow label="Furnished" value={isFurnished} onToggle={() => setIsFurnished((v) => !v)} />
            </Section>

            <Section title="Costs" open={open.costs} onToggle={() => setOpen((s) => ({ ...s, costs: !s.costs }))}>
              <Field label="Base Rent" placeholder="2600" keyboardType="number-pad" inputRef={(r: any) => (refs.current[10] = r)} onSubmitEditing={() => focus(11)} />
              <Field label="Fees (if any)" placeholder="e.g., HOA, amenities" inputRef={(r: any) => (refs.current[11] = r)} onSubmitEditing={() => focus(12)} />
              <Field label="Utilities notes" placeholder="Included? electric?" inputRef={(r: any) => (refs.current[12] = r)} onSubmitEditing={() => focus(13)} />
            </Section>

            <Section
              title="Features & Amenities & Transportation"
              open={open.features}
              onToggle={() => setOpen((s) => ({ ...s, features: !s.features }))}
            >
              <Field label="Notes" placeholder="Laundry, parking, gym, commute..." inputRef={(r: any) => (refs.current[13] = r)} onSubmitEditing={() => focus(14)} />
            </Section>

            <Section title="Contact (includes dates)" open={open.contact} onToggle={() => setOpen((s) => ({ ...s, contact: !s.contact }))}>
              <Field label="Contact name" placeholder="Leasing / Agent" inputRef={(r: any) => (refs.current[14] = r)} onSubmitEditing={() => focus(15)} />
              <Field label="Phone" placeholder="+1 ..." keyboardType="phone-pad" inputRef={(r: any) => (refs.current[15] = r)} onSubmitEditing={() => focus(16)} />
              <Field label="Email" placeholder="name@example.com" inputRef={(r: any) => (refs.current[16] = r)} />
            </Section>
          </View>

          <Pressable
            onPress={() => {}}
            style={({ pressed }) => [
              {
                marginTop: 6,
                backgroundColor: colors.primaryBlue,
                paddingVertical: 14,
                borderRadius: 16,
                alignItems: "center",
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "900" }}>Save</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
