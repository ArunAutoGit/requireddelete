// utils/excelExport.ts
import * as XLSX from 'xlsx';
import { Asset } from '../types/asset';

export interface ExcelExportOptions {
  filename?: string;
  sheetName?: string;
  includeTimestamp?: boolean;
}

export function exportAssetsToExcel(
  assets: Asset[], 
  options: ExcelExportOptions = {}
) {
  const {
    filename = 'asset_allocation',
    sheetName = 'Assets',
    includeTimestamp = true
  } = options;

  // Column headers
  const headers = {
    asset_name: 'Asset Name',
    asset_type: 'Category',
    asset_serial_number: 'Serial Number',
    asset_model: 'Model',
    user_name: 'Assigned To',
    user_role: 'User Role',
    assigned_location: 'Location',
    allocated_on: 'Allocation Date',
    status: 'Status'
  };

  // Category translations
  const categoryTranslations = {
    laptop: 'Laptop',
    mobile: 'Mobile',
    tablet: 'Tablet'
  };

  // Role translations
  const roleTranslations = {
    msr: 'MSR',
    finance: 'Finance',
    statehead: 'State Head',
    zonalhead: 'Zonal Head',
    printer: 'Printer User'
  };

  // Transform data for Excel
  const excelData = assets.map(asset => ({
    [headers.asset_name]: asset.asset_name,
    [headers.asset_type]: categoryTranslations[asset.asset_type as keyof typeof categoryTranslations] || asset.asset_type,
    [headers.asset_serial_number]: asset.asset_serial_number || 'N/A',
    [headers.asset_model]: asset.asset_model || 'N/A',
    [headers.user_name]: asset.user_name || 'Unassigned',
    [headers.user_role]: asset.user_role ? (roleTranslations[asset.user_role as keyof typeof roleTranslations] || asset.user_role) : '-',
    [headers.assigned_location]: asset.assigned_location || '-',
    [headers.allocated_on]: asset.allocated_on ? new Date(asset.allocated_on).toLocaleDateString() : '-',
    [headers.status]: asset.assigned_to ? 'Allocated' : 'Available'
  }));

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 20 }, // Asset Name
    { wch: 12 }, // Category
    { wch: 15 }, // Serial Number
    { wch: 15 }, // Model
    { wch: 18 }, // Assigned To
    { wch: 15 }, // User Role
    { wch: 15 }, // Location
    { wch: 12 }, // Allocation Date
    { wch: 10 }  // Status
  ];
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate filename with timestamp if requested
  const timestamp = includeTimestamp ? `_${new Date().toISOString().split('T')[0]}` : '';
  const finalFilename = `${filename}${timestamp}.xlsx`;

  // Download the file
  XLSX.writeFile(workbook, finalFilename);

  return {
    filename: finalFilename,
    rowCount: excelData.length,
    success: true
  };
}

// Export filtered assets
export function exportAssetsWithSummary(
  assets: Asset[],
  filters: {
    searchTerm: string;
    category: string;
    role: string;
  }
) {
  return exportAssetsToExcel(assets, {
    filename: `asset_allocation_filtered`,
    includeTimestamp: true
  });
}
