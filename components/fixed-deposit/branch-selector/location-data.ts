// Hardcoded location data for branch selection
// State codes match the mock server format (ISO 3166-2)

export type StateOption = {
  value: string;
  label: string;
};

export type CityOption = {
  value: string;
  label: string;
};

export const STATES: StateOption[] = [
  { value: 'IN-MH', label: 'MH' },  // Maharashtra
  { value: 'IN-DL', label: 'DL' },  // Delhi
  { value: 'IN-KA', label: 'KA' },  // Karnataka
];

export const CITIES: Record<string, CityOption[]> = {
  'IN-MH': [{ value: 'Mumbai', label: 'Mumbai' }],
  'IN-DL': [{ value: 'Delhi', label: 'Delhi' }],
  'IN-KA': [{ value: 'Bangalore', label: 'Bangalore' }],
};

export function getCitiesForState(stateCode: string): CityOption[] {
  return CITIES[stateCode] || [];
}
