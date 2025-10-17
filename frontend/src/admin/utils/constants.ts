// utils/constants.ts
export const ASSET_TYPES = [
  { value: 'laptop', label: 'Laptop' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'tablet', label: 'Tablet' },
] as const;

export const ASSET_STATUSES = [
  { value: 'available', label: 'Available' },
  { value: 'allocated', label: 'Allocated' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'retired', label: 'Retired' },
] as const;