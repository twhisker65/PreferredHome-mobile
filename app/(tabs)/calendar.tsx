// app/(tabs)/calendar.tsx — Build 3.2.06
// Change: replaced SidePanel+MenuSheet with MenuPanel+sub-panel system.
// Added useSafeAreaInsets + topBarHeight. Added activeSubPanel state.
// All other logic unchanged.

import React, { useCallback, useMemo, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, RefreshControl } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { colors } from "../../styles/colors";
import { headingLabel } from "../../styles/typography";
import { TopBar } from "../../components/TopBar";
import { MenuPanel, type SubPanelKey } from "../../components/MenuPanel";
import { ProfilePanel } from "../../components/ProfilePanel";
import { CriteriaPanel } from "../../components/CriteriaPanel";
import { SettingsPanel } from "../../components/SettingsPanel";
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
  const match = raw.match(/^(\d{4}-\d{2}-\d{2})[T ]?(\d{2}:\d{2})?/);
  if (!match) return null;
  const date = match[1];
  if (!match[2]) return { date };
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
  const insets = useSafeAreaInsets();
  const topBarHeight = insets.top + 53;

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSubPanel, setActiveSubPanel] = useState<SubPanelKey | null>(null);
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
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>No appointments scheduled.</Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, gap: 10 }}>
            {appts.map((a) => (
              <View
                key={a.id}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  borderRadius: 14,
                  padding: 14,
                  gap: 3,
                }}
              >
                <Text style={{ color: colors.textPrimary, fontWeight: "900", fontSize: 14 }}>
                  {safeText(a.building)} — {formatDisplayDate(a.date)}{a.time ? ` — ${a.time}` : ""}
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{safeText(a.address)}</Text>
                {a.contact ? (
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{a.contact}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

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
        <ProfilePanel topOffset={topBarHeight} onClose={() => setActiveSubPanel(null)} />
      )}
      {activeSubPanel === "criteria" && (
        <CriteriaPanel topOffset={topBarHeight} onClose={() => setActiveSubPanel(null)} />
      )}
      {activeSubPanel === "settings" && (
        <SettingsPanel topOffset={topBarHeight} onClose={() => setActiveSubPanel(null)} />
      )}
    </View>
  );
}
