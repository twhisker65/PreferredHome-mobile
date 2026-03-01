import React, { useMemo, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { router } from "expo-router";
import { CalendarList } from "react-native-calendars";
import { colors } from "../../styles/colors";
import { TopBar } from "../../components/TopBar";
import { SidePanel } from "../../components/SidePanel";
import { MenuSheet } from "../../components/MenuSheet";

type Appt = {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string;
  building?: string;
  address?: string;
  contact?: string;
};

const MOCK: Appt[] = [
  { id: "a1", date: "2026-03-03", time: "11:00", building: "Royal View", address: "42 Barker Ave 6D", contact: "Leasing" },
  { id: "a2", date: "2026-03-08", time: "14:30", building: "Brentwood Condominiums", address: "300 Main St 3J", contact: "Agent" },
];

export default function CalendarScreen() {
  const [menuOpen, setMenuOpen] = useState(false);

  const markedDates = useMemo(() => {
    const m: Record<string, any> = {};
    for (const a of MOCK) {
      m[a.date] = { ...(m[a.date] ?? {}), marked: true, dotColor: colors.primaryBlue };
    }
    return m;
  }, []);

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

      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 22, fontWeight: "900" }}>Calendar</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 6, fontSize: 13 }}>
          Month view + your scheduled tours (mock data for now).
        </Text>
      </View>

      <CalendarList
        horizontal
        pagingEnabled
        pastScrollRange={6}
        futureScrollRange={6}
        markedDates={markedDates}
        theme={{
          calendarBackground: colors.background,
          monthTextColor: colors.textPrimary,
          dayTextColor: colors.textPrimary,
          textDisabledColor: colors.textSecondary,
          arrowColor: colors.textPrimary,
          todayTextColor: colors.accentBlue,
          selectedDayBackgroundColor: colors.primaryBlue,
          selectedDayTextColor: colors.textPrimary,
          dotColor: colors.primaryBlue,
          textDayFontWeight: "700",
          textMonthFontWeight: "800",
          textDayHeaderFontWeight: "800",
        }}
        style={{ borderTopWidth: 1, borderTopColor: colors.border }}
      />

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: "900", marginBottom: 10 }}>
          Appointments
        </Text>

        <FlatList
          data={MOCK}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 14, backgroundColor: colors.card, marginBottom: 10 }}>
              <Text style={{ color: colors.textPrimary, fontWeight: "900" }}>
                {item.building ?? "Tour"}{item.time ? ` · ${item.time}` : ""}
              </Text>
              <Text style={{ color: colors.textSecondary, marginTop: 6 }}>{item.date}</Text>
              {item.address ? <Text style={{ color: colors.textSecondary, marginTop: 6 }}>{item.address}</Text> : null}
              {item.contact ? <Text style={{ color: colors.textSecondary, marginTop: 6 }}>{item.contact}</Text> : null}
            </View>
          )}
        />
      </View>
    </View>
  );
}
