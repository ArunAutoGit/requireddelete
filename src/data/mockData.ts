import { HeatmapData, User } from '../shared/types';

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  role: 'admin',
  assignedAreas: []
};

export const mockHeatmapData: HeatmapData = {
  areas: [
    // States
    { id: 'MH', name: 'Maharashtra', type: 'state', scanCount: 45230, coordinates: { x: 280, y: 180, width: 120, height: 100 } },
    { id: 'KA', name: 'Karnataka', type: 'state', scanCount: 38450, coordinates: { x: 250, y: 280, width: 100, height: 120 } },
    { id: 'TN', name: 'Tamil Nadu', type: 'state', scanCount: 42100, coordinates: { x: 280, y: 380, width: 90, height: 110 } },
    { id: 'AP', name: 'Andhra Pradesh', type: 'state', scanCount: 29800, coordinates: { x: 320, y: 320, width: 80, height: 90 } },
    { id: 'TG', name: 'Telangana', type: 'state', scanCount: 31200, coordinates: { x: 340, y: 280, width: 70, height: 80 } },
    { id: 'KL', name: 'Kerala', type: 'state', scanCount: 28900, coordinates: { x: 220, y: 420, width: 60, height: 120 } },
    { id: 'RJ', name: 'Rajasthan', type: 'state', scanCount: 35600, coordinates: { x: 180, y: 120, width: 140, height: 120 } },
    { id: 'GJ', name: 'Gujarat', type: 'state', scanCount: 33800, coordinates: { x: 160, y: 200, width: 100, height: 110 } },
    { id: 'MP', name: 'Madhya Pradesh', type: 'state', scanCount: 32400, coordinates: { x: 280, y: 200, width: 120, height: 80 } },
    { id: 'UP', name: 'Uttar Pradesh', type: 'state', scanCount: 52300, coordinates: { x: 320, y: 120, width: 150, height: 100 } },
    { id: 'DL', name: 'Delhi', type: 'state', scanCount: 18900, coordinates: { x: 340, y: 100, width: 30, height: 30 } },
    { id: 'HR', name: 'Haryana', type: 'state', scanCount: 22100, coordinates: { x: 310, y: 90, width: 70, height: 50 } },
    { id: 'PB', name: 'Punjab', type: 'state', scanCount: 24800, coordinates: { x: 280, y: 70, width: 80, height: 60 } },
    { id: 'WB', name: 'West Bengal', type: 'state', scanCount: 41200, coordinates: { x: 420, y: 200, width: 90, height: 120 } },
    { id: 'OR', name: 'Odisha', type: 'state', scanCount: 26700, coordinates: { x: 400, y: 250, width: 80, height: 100 } },
    { id: 'JH', name: 'Jharkhand', type: 'state', scanCount: 18500, coordinates: { x: 410, y: 220, width: 70, height: 80 } },
    { id: 'BR', name: 'Bihar', type: 'state', scanCount: 31800, coordinates: { x: 380, y: 180, width: 90, height: 70 } },
    { id: 'AS', name: 'Assam', type: 'state', scanCount: 15600, coordinates: { x: 480, y: 150, width: 80, height: 60 } },
    { id: 'TR', name: 'Tripura', type: 'state', scanCount: 8900, coordinates: { x: 520, y: 200, width: 40, height: 50 } },
    { id: 'ML', name: 'Meghalaya', type: 'state', scanCount: 7200, coordinates: { x: 500, y: 170, width: 50, height: 40 } }
  ],
  maxScanCount: 52300,
  dateRange: {
    start: '2024-01-01',
    end: '2024-12-31'
  }
};

export const maharashtraDistrictsData: HeatmapData = {
  areas: [
    { id: 'MH-MUM', name: 'Mumbai', type: 'district', parent: 'MH', scanCount: 15230, coordinates: { x: 50, y: 120, width: 60, height: 50 } },
    { id: 'MH-PUN', name: 'Pune', type: 'district', parent: 'MH', scanCount: 12890, coordinates: { x: 120, y: 150, width: 80, height: 60 } },
    { id: 'MH-NAG', name: 'Nagpur', type: 'district', parent: 'MH', scanCount: 8450, coordinates: { x: 250, y: 100, width: 70, height: 60 } },
    { id: 'MH-NAS', name: 'Nashik', type: 'district', parent: 'MH', scanCount: 5890, coordinates: { x: 100, y: 80, width: 80, height: 70 } },
    { id: 'MH-AUR', name: 'Aurangabad', type: 'district', parent: 'MH', scanCount: 4720, coordinates: { x: 180, y: 120, width: 90, height: 60 } }
  ],
  maxScanCount: 15230,
  dateRange: {
    start: '2024-01-01',
    end: '2024-12-31'
  }
};

export const timePresets = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'half-yearly', label: 'Half-Yearly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'custom', label: 'Custom Range' }
];

export const stateOptions = [
  { value: 'MH', label: 'Maharashtra' },
  { value: 'KA', label: 'Karnataka' },
  { value: 'TN', label: 'Tamil Nadu' },
  { value: 'AP', label: 'Andhra Pradesh' },
  { value: 'TG', label: 'Telangana' },
  { value: 'KL', label: 'Kerala' },
  { value: 'RJ', label: 'Rajasthan' },
  { value: 'GJ', label: 'Gujarat' },
  { value: 'MP', label: 'Madhya Pradesh' },
  { value: 'UP', label: 'Uttar Pradesh' },
  { value: 'WB', label: 'West Bengal' }
];