import type { Listing } from "./types";

export const mockListings: Listing[] = [
  {
    id: "l1",
    preferred: true,
    status: "Available",
    buildingName: "The Rowan",
    addressLine: "42 Barker Ave, White Plains, NY 10601 · Unit 4B",
    unitSummary: "Apartment · 2 bd · 2 ba · 1,120 sqft",
    monthlyTotal: 3850,
    source: "StreetEasy",
  },
  {
    id: "l2",
    preferred: true,
    status: "Inquired",
    buildingName: "The Halcyon",
    addressLine: "10 Main St, White Plains, NY 10601 · Unit 12A",
    unitSummary: "Apartment · 1 bd · 1 ba · 820 sqft",
    monthlyTotal: 3100,
    source: "Zillow",
  },
  {
    id: "l3",
    preferred: false,
    status: "Visited",
    buildingName: "Kensington Place",
    addressLine: "5 Mamaroneck Ave, White Plains, NY 10601 · Unit 7C",
    unitSummary: "Apartment · 2 bd · 1 ba · 980 sqft",
    monthlyTotal: 3350,
    source: "Compass",
  },
  {
    id: "l4",
    preferred: false,
    status: "Rejected",
    buildingName: "Broadstone",
    addressLine: "200 Martine Ave, White Plains, NY 10601 · Unit 3D",
    unitSummary: "Apartment · Studio · 1 ba · 610 sqft",
    monthlyTotal: 2600,
    source: "Apartments.com",
  },
];
