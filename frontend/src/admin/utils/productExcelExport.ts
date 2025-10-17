// utils/productExcelExport.ts
import * as XLSX from 'xlsx';
import { ProductMaster } from '../types/products';

export interface ExcelExportOptions {
  filename?: string;
  sheetName?: string;
  includeTimestamp?: boolean;
}

export function exportProductsToExcel(
  products: ProductMaster[],
  options: ExcelExportOptions = {}
) {
  const {
    filename = 'product_master',
    sheetName = 'Products',
    includeTimestamp = true
  } = options;

  // Transform data for Excel
  const excelData = products.map(product => ({
    'ID': product.product_id,
    'Serial No': product.sl_no || '-',
    'Location': product.location || '-',
    'Cell': product.cell || '-',
    'Vehicle Application': product.vehicle_application || '-',
    'Segment Product': product.segment_product || '-',
    'Product Name': product.product_name || '-',
    'Part No': product.part_no || '-',
    'Grade': product.grade || '-',
    'Size': product.size || '-',
    'Net Qty Inner': product.net_qty_inner || '-',
    'Size1': product.size1 || '-',
    'Mechanic Coupon Inner': product.mechanic_coupon_inner || '-',
    'MRP Inner': product.mrp_inner || '-',
    'MRP Master': product.mrp_master || '-',
    'Barcode': product.barcode || '-',
    'Product Code': product.prd_code || '-',
    'Padi Cell': product.padi_cell || '-',
    'TSKP1 Cell': product.tskp1_cell || '-',
    'TSKP2 Cell': product.tskp2_cell || '-',
    'Label Status': product.lbl_status ? 'Active' : 'Inactive'
  }));

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const columnWidths = [
    { wch: 8 },  // ID
    { wch: 12 }, // Serial No
    { wch: 15 }, // Location
    { wch: 10 }, // Cell
    { wch: 20 }, // Vehicle Application
    { wch: 18 }, // Segment Product
    { wch: 25 }, // Product Name
    { wch: 15 }, // Part No
    { wch: 10 }, // Grade
    { wch: 10 }, // Size
    { wch: 15 }, // Net Qty Inner
    { wch: 10 }, // Size1
    { wch: 18 }, // Mechanic Coupon Inner
    { wch: 12 }, // MRP Inner
    { wch: 12 }, // MRP Master
    { wch: 15 }, // Barcode
    { wch: 15 }, // Product Code
    { wch: 12 }, // Padi Cell
    { wch: 12 }, // TSKP1 Cell
    { wch: 12 }, // TSKP2 Cell
    { wch: 12 }  // Label Status
  ];
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate filename with timestamp
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

export function exportFilteredProducts(
  products: ProductMaster[],
  searchTerm: string,
  itemsPerPage: number,
  currentPage: number
) {
  return exportProductsToExcel(products, {
    filename: `product_master_filtered`,
    includeTimestamp: true
  });
}
