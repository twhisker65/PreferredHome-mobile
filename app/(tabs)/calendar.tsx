import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Calendar } from "react-native-calendars";
import { colors } from "../../styles/colors";
import { headingLabel } from "../../styles/typography";
import { TopBar } from "../../components/TopBar";
import { SidePanel } from "../../components/SidePanel";
import { MenuSheet } from "../../components/MenuSheet";
import { useListings } from "../../lib/useListings";

type Appt = {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM (24hr internal)
  building?: string;
  address?: string;
  contact?: string;
};

function str(v: any): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

function pick(raw: any, keys: string[]): any {
  for (const k of keys) {
    if (raw && Object.prototype.hasOwnProperty.call(raw, k)) return raw[k];
  }
  return undefined;
}

function parseDateTime(rawDate: string, rawTime?: string): { date: string; time?: string } | null {
  const d = str(rawDate);
  const t = str(rawTime);

  if (d.includes("T")) {
    const iso = new Date(d);
    if (!Number.isNaN(iso.getTime())) {
      const yyyy = iso.getFullYear();
      const mm = String(iso.getMonth() + 1).padStart(2, "0");
      const dd = String(iso.getDate()).padStart(2, "0");
      const hh = String(iso.getHours()).padStart(2, "0");
      const mi = String(iso.getMinutes()).padStart(2, "0");
      return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${mi}` };
    }
  }

  const combo = d.match(/^(\d{4}-\d{2}-\d{2})[\sT](\d{1,2}:\d{2})/);
  if (combo) return { date: combo[1], time: combo[2] };

  const dateOnly = d.match(/^\d{4}-\d{2}-\d{2}$/);
  if (!dateOnly) return null;

  const timeOnly = t.match(/^\d{1,2}:\d{2}$/) ? t : undefined;
  return { date: d, time: timeOnly };
}

function formatTime(t?: string): string {
  if (!t) return "";
  // Already AM/PM format
  if (/AM|PM/i.test(t)) return t.toUpperCase();
  // Convert HH:MM 24hr to AM/PM
  const match = t.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return t;
  const h = parseInt(match[1], 10);
  const m = match[2];
  const period = h < 12 ? "AM" : "PM";
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:${m} ${period}`;
}

function formatDate(d: string): string {
  // YYYY-MM-DD → "Mar 03"
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const match = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return d;
  const month = months[parseInt(match[2], 10) - 1] ?? match[2];
  return `${month} ${match[3]}`;
}

function safeText(v?: string) {
  return v && v.trim().length ? v.trim() : "—";
}

export default function CalendarScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { listings, loading, error } = useListings();

  const appts: Appt[] = useMemo(() => {
    const out: Appt[] = [];

    for (const l of listings) {
      const raw = l.raw ?? {};

      const viewingDate = str(
        pick(raw, ["viewingDate", "viewing_date", "Viewing Date", "tourDate", "tour_date", "Tour Date", "viewing_datetime"])
      );
      const viewingTime = str(pick(raw, ["viewingTime", "viewing_time", "Viewing Time", "tourTime", "tour_time", "Tour Time"]));

      const parsed = parseDateTime(viewingDate, viewingTime);
      if (!parsed) continue;

      const contact = str(pick(raw, ["contactName", "contact_name", "Contact Name", "leasingContact", "Leasing Contact", "contact"])) || "";

      out.push({
        id: l.id,
        date: parsed.date,
        time: parsed.time,
        building: l.buildingName,
        address: l.addressLine,
        contact,
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
      m[a.date] = {
        marked: true,
        dotColor: colors.primaryBlue,
      };
    }
    return m;
  }, [appts]);

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

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar — single month, not a list, so it does not scroll internally */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <Calendar
            hideExtraDays
            markingType={"dot"}
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

        {/* Appointments heading */}
        <View style={{ paddingHorizontal: 16, paddingTop: 22, paddingBottom: 12 }}>
          <Text style={headingLabel}>Appointments</Text>
        </View>

        {/* Appointment cards */}
        {loading ? (
          <View style={{ paddingHorizontal: 16 }}>
            <ActivityIndicator />
          </View>
        ) : error ? (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{ color: colors.textSecondary }}>{error}</Text>
          </View>
        ) : appts.length === 0 ? (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={{ color: colors.textSecondary }}>No appointments scheduled.</Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, gap: 12 }}>
            {appts.map((item) => {
              const dateStr = formatDate(item.date);
              const timeStr = formatTime(item.time);
              const dateTime = timeStr ? `${dateStr} - ${timeStr}` : dateStr;

              return (
                <View
                  key={item.id + "|" + item.date + "|" + (item.time ?? "")}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 18,
                    padding: 14,
                    backgroundColor: colors.card,
                  }}
                >
                  {/* Row 1: Building Name — Date & Time */}
                  <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: "900" }} numberOfLines={1}>
                    {safeText(item.building)} — {dateTime}
                  </Text>

                  {/* Row 2: Full address */}
                  <Text style={{ color: colors.textSecondary, marginTop: 6, fontSize: 13 }} numberOfLines={2}>
                    {safeText(item.address)}
                  </Text>

                  {/* Row 3: Contact name */}
                  <Text style={{ color: colors.textSecondary, marginTop: 4, fontSize: 13 }} numberOfLines={1}>
                    {safeText(item.contact)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
