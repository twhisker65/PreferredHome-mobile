import React, { useMemo, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { CalendarList } from "react-native-calendars";
import { colors } from "../../styles/colors";
import { TopBar } from "../../components/TopBar";
import { SidePanel } from "../../components/SidePanel";
import { MenuSheet } from "../../components/MenuSheet";
import { useListings } from "../../lib/useListings";

type Appt = {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
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

  // If datetime is combined: "YYYY-MM-DD HH:MM" or ISO string.
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

function safeText(v?: string) {
  return v && v.trim().length ? v.trim() : "—";
}

export default function CalendarScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { listings, loading, error } = useListings();

  const appts: Appt[] = useMemo(() => {
    // Build appointments from listings.
    // Source of truth: listing raw payload coming from Google Sheets.
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

    // Sort by date then time
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
        customStyles: {
          container: { backgroundColor: colors.primaryBlue, borderRadius: 16 },
          text: { color: colors.background, fontWeight: "900" },
        },
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

      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <CalendarList
          current={appts[0]?.date ?? undefined}
          pastScrollRange={6}
          futureScrollRange={6}
          horizontal
          pagingEnabled
          hideExtraDays
          markingType={"custom"}
          markedDates={markedDates}
          style={{ borderRadius: 18, overflow: "hidden" }}
          theme={{
            calendarBackground: colors.background,
            monthTextColor: colors.textPrimary,
            dayTextColor: colors.textPrimary,
            textDisabledColor: colors.textSecondary,
            todayTextColor: colors.primaryBlue,
            arrowColor: colors.textPrimary,
          }}
        />
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 18, paddingBottom: 10 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 26, fontWeight: "900" }}>Appointments</Text>
      </View>

      {loading ? (
        <View style={{ padding: 16 }}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          <Text style={{ color: colors.textSecondary }}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={appts}
          keyExtractor={(i) => i.id + "|" + i.date + "|" + (i.time ?? "")}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28, gap: 12 }}
          renderItem={({ item }) => (
            <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 14, backgroundColor: colors.card }}>
              <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: "900" }}>
                {safeText(item.building)}{item.time ? ` · ${item.time}` : ""}
              </Text>

              <Text style={{ color: colors.textSecondary, marginTop: 8 }}>{safeText(item.date)}</Text>

              {/* 3rd line: contact name (per 3.1.07) */}
              <Text style={{ color: colors.textSecondary, marginTop: 6 }}>{safeText(item.contact)}</Text>

              <Text style={{ color: colors.textSecondary, marginTop: 6 }}>{safeText(item.address)}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
