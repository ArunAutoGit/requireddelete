// utils/roleMapping.ts
export const mapToApiRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    'Admin': 'admin',
    'Finance': 'finance',
    'PrinterUser': 'printer',
    'Zonal Head': 'zonalhead',
    'State Head': 'statehead'
  };
  return roleMap[role] || 'printer';
};

export const mapToDisplayRole = (apiRole: string): string => {
  const roleMap: Record<string, string> = {
    'admin': 'Admin',
    'finance': 'Finance',
    'printer': 'PrinterUser',
    'zonalhead': 'Zonal Head',
    'statehead': 'State Head'
  };
  return roleMap[apiRole.toLowerCase()] || 'PrinterUser';
};