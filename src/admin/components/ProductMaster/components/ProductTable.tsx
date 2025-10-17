// components/products/ProductTable.tsx
import React from 'react';
import { Trash2 } from 'lucide-react';
import { ProductMaster, ProductTableProps } from '../../../types/products';

// interface ProductTableProps {
//   products: ProductMaster[];
//   selectedProducts: number[];
//   onSelectProduct: (id: number) => void;
//   onSelectAll: () => void;
//   onDeleteProduct: (id: number) => void;
//   language: 'en' | 'hi';
//   loading?: boolean;
//   allCurrentSelected: boolean;
//   someCurrentSelected: boolean;
// }

const translations = {
  en: {
    tableHeaders: [
      "Select", "ID", "Slno", "Location", "Cell", "Vehicle Application",
      "Segment Product", "Product", "Part No", "Grade", "Size", "Net Qty Inner",
      "Size1", "Mechanic Coupon Inner", "MRP Inner", "MRP Master", "Barcode",
      "Prd Code", "Padi Cell", "TSKP1 Cell", "TSKP2 Cell", "Label Status", "Actions"
    ]
  },
  hi: {
    tableHeaders: [
      "चुनें", "आईडी", "क्रमांक", "स्थान", "सेल", "वाहन अनुप्रयोग",
      "सेगमेंट उत्पाद", "उत्पाद", "भाग संख्या", "ग्रेड", "आकार", "शुद्ध मात्रा (आंतरिक)",
      "आकार 1", "मैकेनिक कूपन (आंतरिक)", "एमआरपी (आंतरिक)", "मास्टर एमआरपी", "बारकोड",
      "उत्पाद कोड", "पादी सेल", "टीएसकेपी1 सेल", "टीएसकेपी2 सेल", "लेबल स्थिति", "कार्रवाई"
    ]
  }
};

export function ProductTable({
  products,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
  onDeleteProduct,
  language,
  loading,
  allCurrentSelected,
  someCurrentSelected
}: ProductTableProps) {
  const t = translations[language];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg">
        <div className="text-lg text-gray-500">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border">
        <thead className="bg-[#0066cc]">
          <tr>
            {t.tableHeaders.map((col, index) => (
              <th
                key={col}
                className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-white border"
              >
                {index === 0 ? (
                  <input
                    type="checkbox"
                    checked={allCurrentSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = someCurrentSelected && !allCurrentSelected;
                      }
                    }}
                    onChange={onSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                ) : (
                  col
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr
              key={product.product_id}
              className={`hover:bg-[#fff9c4] text-gray-900 ${
                product.product_id && selectedProducts.includes(product.product_id) ? 'bg-blue-50' : ''
              }`}
            >
              <td className="px-4 py-2 border">
                <input
                  type="checkbox"
                  checked={product.product_id ? selectedProducts.includes(product.product_id) : false}
                  onChange={() => {
                    if (product.product_id) {
                      onSelectProduct(product.product_id);
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
              </td>
              <td className="px-4 py-2 border">{product.product_id}</td>
              <td className="px-4 py-2 border">{product.sl_no || '-'}</td>
              <td className="px-4 py-2 border">{product.location || '-'}</td>
              <td className="px-4 py-2 border">{product.cell || '-'}</td>
              <td className="px-4 py-2 border">{product.vehicle_application || '-'}</td>
              <td className="px-4 py-2 border">{product.segment_product || '-'}</td>
              <td className="px-4 py-2 border">{product.product_name || '-'}</td>
              <td className="px-4 py-2 border">{product.part_no || '-'}</td>
              <td className="px-4 py-2 border">{product.grade || '-'}</td>
              <td className="px-4 py-2 border">{product.size || '-'}</td>
              <td className="px-4 py-2 border">{product.net_qty_inner || '-'}</td>
              <td className="px-4 py-2 border">{product.size1 || '-'}</td>
              <td className="px-4 py-2 border">{product.mechanic_coupon_inner || '-'}</td>
              <td className="px-4 py-2 border">{product.mrp_inner || '-'}</td>
              <td className="px-4 py-2 border">{product.mrp_master || '-'}</td>
              <td className="px-4 py-2 border">{product.barcode || '-'}</td>
              <td className="px-4 py-2 border">{product.prd_code || '-'}</td>
              <td className="px-4 py-2 border">{product.padi_cell || '-'}</td>
              <td className="px-4 py-2 border">{product.tskp1_cell || '-'}</td>
              <td className="px-4 py-2 border">{product.tskp2_cell || '-'}</td>
              <td className="px-4 py-2 border">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.lbl_status 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.lbl_status ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-2 border">
                <button
                  onClick={() => {
                    if (product.product_id) {
                      onDeleteProduct(product.product_id);
                    }
                  }}
                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                  title={language === 'hi' ? "हटाएं" : "Delete"}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
