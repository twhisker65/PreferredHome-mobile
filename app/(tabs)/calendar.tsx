import React, { useMemo } from "react";
import { View, Text, FlatList } from "react-native";
import { CalendarList } from "react-native-calendars";
import { colors } from "../../styles/colors";
import { TopBar } from "../../components/TopBar";

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
  const markedDates = useMemo(() => {
    const m: Record<string, any> = {};
    for (const a of MOCK) {
      m[a.date] = { ...(m[a.date] ?? {}), marked: true, dotColor: "#2f80ff" };
    }
    return m;
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="PreferredHome" />

      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 }}>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: "900" }}>Calendar</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 6, fontSize: 13 }}>
          Month grid with dots for viewing appointments. List below.
        </Text>
      </View>

      <CalendarList
        pastScrollRange={12}
        futureScrollRange={12}
        scrollEnabled
        showScrollIndicator
        markedDates={markedDates}
        theme={{
          calendarBackground: "transparent",
          dayTextColor: colors.text,
          monthTextColor: colors.text,
          textSectionTitleColor: colors.textSecondary,
          selectedDayTextColor: colors.text,
          todayTextColor: "#2f80ff",
          arrowColor: colors.textSecondary,
        }}
        style={{ borderTopWidth: 1, borderTopColor: colors.border }}
      />

      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
        <Text style={{ color: colors.textSecondary, fontSize: 12, letterSpacing: 0.8 }}>APPOINTMENTS</Text>
      </View>

      <FlatList
        data={MOCK}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 14, marginBottom: 10 }}>
            <Text style={{ color: colors.text, fontSize: 15, fontWeight: "800" }}>
              {item.date} {item.time ? `• ${item.time}` : ""}
            </Text>
            <Text style={{ color: colors.textSecondary, marginTop: 6 }}>{item.building ?? "—"}</Text>
            <Text style={{ color: colors.textSecondary }}>{item.address ?? "—"}</Text>
            <Text style={{ color: colors.textSecondary, marginTop: 6 }}>Contact: {item.contact ?? "—"}</Text>
          </View>
        )}
      />
    </View>
  );
}
