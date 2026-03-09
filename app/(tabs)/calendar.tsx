// app/(tabs)/calendar.tsx — Build 3.2.03
// Changes: added useFocusEffect for on-focus refresh, added RefreshControl for pull-to-refresh

import React, { useCallback, useMemo, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, RefreshControl } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Calendar } from "react-native-calendars";
import { colors } from "../../styles/colors";
import { headingLabel } from "../../styles/typography";
import { TopBar } from "../../components/TopBar";
import { SidePanel } from "../../components/SidePanel";
import { MenuSheet } from "../../components/MenuSheet";
import { useListings } from "../../lib/useListings";

type Appt = {
  id: string;
  date: string;
  time?: string;
  building: string;
  address: string;
  contact?: string;
};

function str(v: unknown): string {
  if (v == null) return "";
  return String(v).trim();
}

function parseDateTime(raw: string): { date: string; time?: string } | null {
  if (!raw) return null;
  // ISO: 2026-03-07T14:00:00 or 2026-03-07 14:00:00 or 2026-03-07
  const match = raw.match(/^(\d{4}-\d{2}-\d{2})[T ]?(\d{2}:\d{2})?/);
  if (!match) return null;
  const date = match[1];
  if (!match[2]) return { date };
  // Convert 24h to AM/PM
  const [hStr, mStr] = match[2].split(":");
  let h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return { date, time: `${h}:${mStr} ${period}` };
}

function formatDisplayDate(dateStr: string): string {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dateStr;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[parseInt(match[2], 10) - 1];
  return `${month} ${match[3]}`;
}

function safeText(v?: string) {
  return v && v.trim().length ? v.trim() : "—";
}

export default function CalendarScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { listings, loading, refreshing, error, refresh } = useListings();

  // Refresh whenever this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  const appts: Appt[] = useMemo(() => {
    const out: Appt[] = [];

    for (const l of listings) {
      const raw = l.raw ?? {};
      const viewingAppt = str(raw.viewingAppointment);
      const parsed = parseDateTime(viewingAppt);
      if (!parsed) continue;

      out.push({
        id: l.id,
        date: parsed.date,
        time: parsed.time,
        building: l.buildingName,
        address: l.addressLine,
        contact: str(raw.contactName) || undefined,
      });
    }

    out.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return (a.time ?? "").localeCompare(b.time ?? "");
    });

    return out;
  }, [listings]);

  const markedDates = useMemo(() => {
    const m: Record<string, any> = {};
    for (const a of appts) {
      m[a.date] = { selected: true, selectedColor: colors.primaryBlue };
    }
    return m;
  }, [appts]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="PreferredHome" onPressMenu={() => setMenuOpen(true)} />

      <SidePanel visible={menuOpen} side="left" onClose={() => setMenuOpen(false)}>
        <MenuSheet
          onGoProfile={() => { setMenuOpen(false); router.push("/profile"); }}
          onGoSettings={() => { setMenuOpen(false); router.push("/settings"); }}
          onClose={() => setMenuOpen(false)}
        />
      </SidePanel>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <Calendar
            hideExtraDays
            markedDates={markedDates}
            style={{ borderRadius: 18, overflow: "hidden" }}
            theme={{
              calendarBackground: colors.background,
              monthTextColor: colors.textPrimary,
              dayTextColor: colors.textPrimary,
              textDisabledColor: colors.textSecondary,
              todayTextColor: colors.primaryBlue,
              arrowColor: colors.textPrimary,
              textDayFontWeight: "700",
              textMonthFontWeight: "800",
              textDayHeaderFontWeight: "800",
            }}
          />
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 22, paddingBottom: 12 }}>
          <Text style={headingLabel}>Appointments</Text>
        </View>

        {loading ? (
          <View style={{ paddingHorizontal: 16 }}>
            <ActivityIndicator />
          </View>
        ) : error ? (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{ color: colors.red, fontSize: 13 }}>{error}</Text>
          </View>
        ) : appts.length === 0 ? (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>No viewing appointments scheduled.</Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, gap: 10 }}>
            {appts.map((a) => (
              <View
                key={`${a.id}-${a.date}`}
                style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14 }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Text style={{ color: colors.textPrimary, fontWeight: "900", fontSize: 15, flex: 1 }} numberOfLines={1}>
                    {safeText(a.building)}
                  </Text>
                  <Text style={{ color: colors.primaryBlue, fontWeight: "700", fontSize: 13, marginLeft: 8 }}>
                    {formatDisplayDate(a.date)}{a.time ? ` · ${a.time}` : ""}
                  </Text>
                </View>
                <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }} numberOfLines={2}>
                  {safeText(a.address)}
                </Text>
                {a.contact ? (
                  <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 4 }}>
                    {a.contact}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
