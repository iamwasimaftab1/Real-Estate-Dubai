
export interface LeadData {
  email: string;
  mobile: string;
  budget: string;
  propertyType: string;
}

export interface MarketInsight {
  id: string;
  area: string;
  roi: number;
  trend: 'up' | 'down' | 'stable';
  avgPrice: string;
  description?: string;
  coordinates: { x: number; y: number }; // Percentage based for responsive SVG
}

export enum BudgetRange {
  BASIC = "AED 500k - 1M",
  MID = "AED 1M - 3M",
  HIGH = "AED 3M - 10M",
  ULTRA = "AED 10M+"
}

export enum PropertyType {
  APARTMENT = "Apartment",
  VILLA = "Villa",
  TOWNHOUSE = "Townhouse",
  LAND = "Investment Land",
  COMMUNITY = "Gated Community"
}
