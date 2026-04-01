// app/(tabs)/calendar.tsx — Build 3.2.21
// Changes from 3.2.20.15:
//   Fixed layout: outer ScrollView removed. Calendar is fixed at top; appointments
//   scroll independently below in their own ScrollView. This keeps the calendar
//   always visible while appointments with multiple entries scroll freely.
//   Appt type updated: mapsAddress field added (street + city/state/zip, no unit number).
//   Appointment address is now tappable — opens default map app using mapsAddress.
//   pull-to-refresh moved to appointments ScrollView (RefreshControl retained).
//   All appointment parsing, markedDates, and sorting logic unchanged.

import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Pressable,
  Linking,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { colors } from "../../styles/colors";
import { textStyles } from "../../styles/typography";
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
  mapsAddress?: string;
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

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<{ year: number; month: number }>({
    year: today.getFullYear(),
    month: today.getMonth() + 1,
  });

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  // Build appointments list — includes mapsAddress (no unit number) for map tap
  const appts: Appt[] = useMemo(() => {
    const out: Appt[] = [];
    for (const l of listings) {
      const raw = l.raw ?? {};
      const viewingAppt = str(raw.viewingAppointment);
      const parsed = parseDateTime(viewingAppt);
      if (!parsed) continue;

      // Build maps address without unit number (street + city/state/zip only)
      const streetAddr = str(raw.streetAddress);
      const cityStateZip = [str(raw.city), str(raw.state), str(raw.zipCode)]
        .filter(Boolean)
        .join(", ");
      const mapsAddress = [streetAddr, cityStateZip].filter(Boolean).join(", ") || undefined;

      out.push({
        id: l.id,
        date: parsed.date,
        time: parsed.time,
        building: l.buildingName,
        address: l.addressLine,
        mapsAddress,
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
      m[a.date] = { selected: true, selectedColor: colors.accent };
    }
    return m;
  }, [appts]);

  const visibleAppts = useMemo(() => {
    const prefix = `${String(currentMonth.year)}-${String(currentMonth.month).padStart(2, "0")}`;
    return appts.filter((a) => a.date.startsWith(prefix));
  }, [appts, currentMonth]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="PreferredHome" onPressMenu={() => setMenuOpen(true)} />

      {/* Calendar — fixed at top, not scrollable */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Calendar
          hideExtraDays
          markedDates={markedDates}
          onMonthChange={(month) => {
            setCurrentMonth({ year: month.year, month: month.month });
          }}
          style={{ borderRadius: 18, overflow: "hidden" }}
          theme={{
            calendarBackground: colors.background,
            monthTextColor: colors.textPrimary,
            dayTextColor: colors.textPrimary,
            textDisabledColor: colors.textSecondary,
            todayTextColor: colors.accent,
            arrowColor: colors.textPrimary,
            textDayFontWeight: "700",
            textMonthFontWeight: "800",
            textDayHeaderFontWeight: "800",
          }}
        />
      </View>

      {/* Appointments header — fixed between calendar and list */}
      <View style={{
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}>
        <Text style={textStyles.sectionTitle}>Appointments</Text>
      </View>

      {/* Appointments list — independently scrollable */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28, gap: 10 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {loading ? (
          <ActivityIndicator />
        ) : error ? (
          <Text style={{ color: colors.compareFail, fontSize: textStyles.bodySmall.fontSize }}>{error}</Text>
        ) : visibleAppts.length === 0 ? (
          <Text style={{ color: colors.textSecondary, fontSize: textStyles.bodySmall.fontSize }}>
            No appointments for this month.
          </Text>
        ) : (
          visibleAppts.map((a) => (
            <View
              key={a.id}
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.surface,
                borderRadius: 14,
                padding: 14,
                gap: 3,
              }}
            >
              <Text style={textStyles.bodyEmphasis}>
                {safeText(a.building)} — {formatDisplayDate(a.date)}{a.time ? ` — ${a.time}` : ""}
              </Text>
              {a.mapsAddress ? (
                <Pressable
                  onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(a.mapsAddress!)}`)}
                >
                  <Text style={{ color: colors.accent, fontSize: textStyles.bodySmall.fontSize }}>
                    {safeText(a.address)}
                  </Text>
                </Pressable>
              ) : (
                <Text style={{ color: colors.textSecondary, fontSize: textStyles.bodySmall.fontSize }}>
                  {safeText(a.address)}
                </Text>
              )}
              {a.contact ? (
                <Text style={{ color: colors.textSecondary, fontSize: textStyles.bodySmall.fontSize }}>
                  {a.contact}
                </Text>
              ) : null}
            </View>
          ))
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
