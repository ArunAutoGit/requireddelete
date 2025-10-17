// components/products/AddProductModal.tsx
import React, { useState } from 'react';
import { AddProductModalProps, ProductMasterCreate } from '../../../types/products';

// interface AddProductModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (product: ProductMasterCreate) => void;
//   language: 'en' | 'hi';
//   isSaving: boolean;
// }

const translations = {
  en: {
    title: "Add Product",
    cancel: "Cancel",
    save: "Save",
    saving: "Saving...",
    productNameRequired: "Product name is required"
  },
  hi: {
    title: "उत्पाद जोड़ें",
    cancel: "रद्द करें",
    save: "सहेजें",
    saving: "सहेज रहा है...",
    productNameRequired: "उत्पाद का नाम आवश्यक है"
  }
};

export function AddProductModal({ isOpen, onClose, onSave, language, isSaving }: AddProductModalProps) {
  const [newProduct, setNewProduct] = useState<Partial<ProductMasterCreate>>({});
  const t = translations[language];

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setNewProduct({ 
        ...newProduct, 
        [name]: checked 
      });
    } else {
      setNewProduct({ 
        ...newProduct, 
        [name]: value 
      });
    }
  };

  const handleSave = () => {
    if (!newProduct.product_name) {
      alert(t.productNameRequired);
      return;
    }

    // Convert string values to appropriate types
    const productData: ProductMasterCreate = {
      product_name: newProduct.product_name || '',
      sl_no: newProduct.sl_no ? Number(newProduct.sl_no) : undefined,
      location: newProduct.location || undefined,
      cell: newProduct.cell || undefined,
      vehicle_application: newProduct.vehicle_application || undefined,
      segment_product: newProduct.segment_product || undefined,
      part_no: newProduct.part_no || undefined,
      grade: newProduct.grade || undefined,
      size: newProduct.size || undefined,
      net_qty_inner: newProduct.net_qty_inner ? Number(newProduct.net_qty_inner) : undefined,
      size1: newProduct.size1 || undefined,
      mechanic_coupon_inner: newProduct.mechanic_coupon_inner ? Number(newProduct.mechanic_coupon_inner) : undefined,
      mrp_inner: newProduct.mrp_inner ? Number(newProduct.mrp_inner) : undefined,
      mrp_master: newProduct.mrp_master ? Number(newProduct.mrp_master) : undefined,
      barcode: newProduct.barcode || undefined,
      prd_code: newProduct.prd_code || undefined,
      padi_cell: newProduct.padi_cell || undefined,
      tskp1_cell: newProduct.tskp1_cell || undefined,
      tskp2_cell: newProduct.tskp2_cell || undefined,
      lbl_status: newProduct.lbl_status || false,
    };

    onSave(productData);
    setNewProduct({});
  };

  const handleClose = () => {
    setNewProduct({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl m-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t.title}
        </h3>
        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {[
            'product_name', 'sl_no', 'location', 'cell', 'vehicle_application', 'segment_product',
            'part_no', 'grade', 'size', 'net_qty_inner', 'size1',
            'mechanic_coupon_inner', 'mrp_inner', 'mrp_master', 'barcode', 'prd_code',
            'padi_cell', 'tskp1_cell', 'tskp2_cell'
          ].map((field) => (
            <div key={field} className={field === 'product_name' ? 'col-span-2' : ''}>
              <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                {field.replace(/_/g, ' ')} {field === 'product_name' && '*'}
              </label>
              <input
                type={['sl_no', 'net_qty_inner', 'mechanic_coupon_inner', 'mrp_inner', 'mrp_master'].includes(field) ? 'number' : 'text'}
                name={field}
                value={newProduct[field as keyof ProductMasterCreate] as string || ''}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
                required={field === 'product_name'}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label Status
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="lbl_status"
                checked={Boolean(newProduct.lbl_status)}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#0066cc] focus:ring-[#0066cc] border-gray-300 rounded"
              />
              <span className="text-sm text-gray-600">Active</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !newProduct.product_name}
            className="px-4 py-2 rounded-lg bg-[#0066cc] text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSaving ? t.saving : t.save}
          </button>
        </div>
      </div>
    </div>
  );
}
