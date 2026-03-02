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
  time?: string; // HH:MM (24h)
  building?: string;
  address?: string;
  contact?: string;
};

const MOCK: Appt[] = [
  { id: "a1", date: "2026-03-03", time: "11:00", building: "Royal View", address: "42 Barker Ave, White Plains, NY 10601, 6D", contact: "Leasing" },
  { id: "a2", date: "2026-03-08", time: "14:30", building: "Brentwood Condominiums", address: "300 Main St, White Plains, NY 10601, 3J", contact: "Agent" },
];

function formatWhen(dateYYYYMMDD: string, time24?: string) {
  if (!dateYYYYMMDD) return "";
  const [y, m, d] = dateYYYYMMDD.split("-").map((x) => Number(x));
  if (!y || !m || !d) return dateYYYYMMDD;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mon = monthNames[m - 1] ?? "";
  const day = String(d).padStart(2, "0");

  if (!time24) return `${mon} ${day}`;

  const [hhRaw, mmRaw] = time24.split(":");
  const hh = Number(hhRaw);
  const mm = Number(mmRaw ?? "0");
  if (!Number.isFinite(hh)) return `${mon} ${day}`;
  const ampm = hh >= 12 ? "PM" : "AM";
  const hour12 = ((hh + 11) % 12) + 1;
  const min2 = String(mm).padStart(2, "0");
  return `${mon} ${day} - ${String(hour12).padStart(2, "0")}:${min2} ${ampm}`;
}

function safeText(v?: string) {
  return v && v.trim().length ? v.trim() : "—";
}

export default function CalendarScreen() {
  const [menuOpen, setMenuOpen] = useState(false);

  const markedDates = useMemo(() => {
    const m: Record<string, any> = {};
    for (const a of MOCK) {
      m[a.date] = {
        customStyles: {
          container: { backgroundColor: colors.primaryBlue, borderRadius: 16 },
          text: { color: colors.background, fontWeight: "900" },
        },
      };
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

      <CalendarList
        markingType="custom"
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
          textDayFontWeight: "700",
          textMonthFontWeight: "800",
          textDayHeaderFontWeight: "800",
        }}
      />

      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12 }}>
        <FlatList
          data={MOCK}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => {
            const when = formatWhen(item.date, item.time);
            return (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 16,
                  padding: 14,
                  backgroundColor: colors.card,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: colors.textPrimary, fontWeight: "900" }}>
                  {safeText(item.building)}{when ? ` - ${when}` : ""}
                </Text>
                <Text style={{ color: colors.textSecondary, marginTop: 6 }}>{safeText(item.address)}</Text>
                <Text style={{ color: colors.textSecondary, marginTop: 6 }}>{safeText(item.contact)}</Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
