// components/products/ProductMaster.tsx
import React, { useState, useEffect } from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useListProducts, useUploadExcel, useCreateProduct, useBulkDeleteProducts, useDeleteProduct } from '../../hooks/useProduct';
import { ProductMaster as ProductType, ProductMasterCreate } from '../../types/products';
import { ProductTable } from './components/ProductTable';
import { SearchAndFilterBar } from './components/SearchAndFilterBar';
import { Pagination } from './components/Pagination';
import { UploadModal } from './components/UploadModal';
import { AddProductModal } from './components/AddProductModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { exportFilteredProducts } from '../../utils/productExcelExport';

interface ProductMasterProps {
  language: 'en' | 'hi';
}

const translations = {
  en: {
    title: "Product Master",
    description: "Manage full product details",
    uploadButton: "Upload Data",
    addProductButton: "Add Product",
    deleteSelected: "Delete Selected",
    uploading: "Uploading...",
    deleting: "Deleting...",
    // Toast messages
    fileUploadSuccess: "File uploaded successfully!",
    fileUploadError: "Upload failed",
    productAddSuccess: "Product added successfully!",
    productAddError: "Failed to add product",
    productDeleteSuccess: "Product deleted successfully!",
    productDeleteError: "Failed to delete product",
    bulkDeleteSuccess: "products deleted successfully!",
    bulkDeleteError: "Failed to delete products",
    exportSuccess: "Excel file downloaded successfully!",
    exportError: "Failed to export data. Please try again.",
    noDataToExport: "No data available to export",
    selectProductsToDelete: "Please select products to delete"
  },
  hi: {
    title: "उत्पाद मास्टर",
    description: "पूर्ण उत्पाद विवरण प्रबंधित करें",
    uploadButton: "डेटा अपलोड करें",
    addProductButton: "उत्पाद जोड़ें",
    deleteSelected: "चयनित हटाएं",
    uploading: "अपलोड हो रहा है...",
    deleting: "हटा रहा है...",
    // Toast messages
    fileUploadSuccess: "फ़ाइल सफलतापूर्वक अपलोड की गई!",
    fileUploadError: "अपलोड विफल",
    productAddSuccess: "उत्पाद सफलतापूर्वक जोड़ा गया!",
    productAddError: "उत्पाद जोड़ने में विफल",
    productDeleteSuccess: "उत्पाद सफलतापूर्वक हटाया गया!",
    productDeleteError: "उत्पाद हटाने में विफल",
    bulkDeleteSuccess: "उत्पाद सफलतापूर्वक हटाए गए!",
    bulkDeleteError: "उत्पाद हटाने में विफल",
    exportSuccess: "एक्सेल फ़ाइल सफलतापूर्वक डाउनलोड हुई!",
    exportError: "डेटा निर्यात करने में विफल। कृपया पुनः प्रयास करें।",
    noDataToExport: "निर्यात करने के लिए कोई डेटा उपलब्ध नहीं",
    selectProductsToDelete: "कृपया हटाने के लिए उत्पाद चुनें"
  }
};

export function ProductMaster({ language }: ProductMasterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isExporting, setIsExporting] = useState(false);

  const t = translations[language];

  // API hooks
  const { execute: fetchProducts, data: products, isLoading: loadingProducts, error: productsError } = useListProducts();
  const { execute: uploadExcel, isLoading: uploading } = useUploadExcel();
  const { execute: createProduct, isLoading: creatingProduct } = useCreateProduct();
  const { execute: bulkDeleteProducts, isLoading: deletingBulk } = useBulkDeleteProducts();
  const { execute: deleteProduct, isLoading: deletingSingle } = useDeleteProduct();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (productsError) {
      toast.error(productsError);
    }
  }, [productsError]);

  // Safely handle products array
  const safeProducts = Array.isArray(products) ? products : [];

  // Filter products based on search term
  const filteredProducts = safeProducts.filter(
    (p) =>
      p.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.part_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.segment_product?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Reset selected products when page changes or search changes
  useEffect(() => {
    setSelectedProducts([]);
  }, [currentPage, searchTerm]);

  // Export functionality
  const handleExport = async () => {
    if (filteredProducts.length === 0) {
      toast.error(t.noDataToExport);
      return;
    }

    setIsExporting(true);
    try {
      const result = exportFilteredProducts(
        filteredProducts,
        searchTerm,
        itemsPerPage,
        currentPage
      );
      toast.success(`${t.exportSuccess} ${result.rowCount} records exported.`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(t.exportError);
    } finally {
      setIsExporting(false);
    }
  };

  // Selection handlers
  const handleSelectProduct = (id: number) => {
    setSelectedProducts(prev => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        return prev.filter(productId => productId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    const currentItemIds = currentItems
      .map(p => p.product_id)
      .filter((id): id is number => typeof id === 'number' && id !== undefined);
      
    const allCurrentSelected = currentItemIds.length > 0 && currentItemIds.every(id => selectedProducts.includes(id));
    
    if (allCurrentSelected) {
      setSelectedProducts(prev => prev.filter(id => !currentItemIds.includes(id)));
    } else {
      setSelectedProducts(prev => {
        const newSelected = [...prev];
        currentItemIds.forEach(id => {
          if (!newSelected.includes(id)) {
            newSelected.push(id);
          }
        });
        return newSelected;
      });
    }
  };

  // Delete handlers
  const handleDeleteProduct = async (id: number) => {
    const product = safeProducts.find(p => p.product_id === id);
    const productName = product?.product_name || `ID: ${id}`;
    
    setDeleteTargetId(id);
    setDeleteTargetName(productName);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    
    try {
      await deleteProduct(deleteTargetId);
      toast.success(t.productDeleteSuccess);
      setSelectedProducts(prev => prev.filter(productId => productId !== deleteTargetId));
      await fetchProducts();
    } catch (error) {
      console.error('Delete product error:', error);
      toast.error(t.productDeleteError);
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTargetId(null);
      setDeleteTargetName("");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error(t.selectProductsToDelete);
      return;
    }
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await bulkDeleteProducts(selectedProducts);
      toast.success(`${selectedProducts.length} ${t.bulkDeleteSuccess}`);
      setSelectedProducts([]);
      await fetchProducts();
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error(t.bulkDeleteError);
    } finally {
      setShowBulkDeleteConfirm(false);
    }
  };

  // Upload handlers
  const handleFileUpload = async (file: File) => {
    try {
      await uploadExcel(file);
      toast.success(t.fileUploadSuccess);
      setShowUploadModal(false);
      await fetchProducts();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(t.fileUploadError);
    }
  };

  // Add product handlers
  const handleSaveProduct = async (productData: ProductMasterCreate) => {
    try {
      await createProduct(productData);
      toast.success(t.productAddSuccess);
      setShowAddProductModal(false);
      await fetchProducts();
    } catch (error) {
      console.error('Create product error:', error);
      toast.error(t.productAddError);
    }
  };

  // Check if all current items are selected
  const currentItemIds = currentItems
    .map(p => p.product_id)
    .filter((id): id is number => typeof id === 'number' && id !== undefined);
  const allCurrentSelected = currentItemIds.length > 0 && currentItemIds.every(id => selectedProducts.includes(id));
  const someCurrentSelected = currentItemIds.some(id => selectedProducts.includes(id));

  if (loadingProducts) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600">{t.description}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-[#ffff4d] hover:bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors font-medium"
            disabled={uploading}
          >
            <Upload className="h-4 w-4" />
            <span>{uploading ? t.uploading : t.uploadButton}</span>
          </button>
          <button
            onClick={() => setShowAddProductModal(true)}
            className="bg-[#0066cc] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{t.addProductButton}</span>
          </button>
          {selectedProducts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              disabled={deletingBulk}
            >
              <Trash2 className="h-4 w-4" />
              <span>
                {deletingBulk ? t.deleting : `${t.deleteSelected} (${selectedProducts.length})`}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <SearchAndFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        onExport={handleExport}
        isExporting={isExporting}
        language={language}
      />

      {/* Products Table */}
      <ProductTable
        products={currentItems}
        selectedProducts={selectedProducts}
        onSelectProduct={handleSelectProduct}
        onSelectAll={handleSelectAll}
        onDeleteProduct={handleDeleteProduct}
        language={language}
        loading={loadingProducts}
        allCurrentSelected={allCurrentSelected}
        someCurrentSelected={someCurrentSelected}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        language={language}
      />

      {/* Modals */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleFileUpload}
        language={language}
        isUploading={uploading}
      />

      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onSave={handleSaveProduct}
        language={language}
        isSaving={creatingProduct}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteTargetId(null);
          setDeleteTargetName("");
        }}
        onConfirm={confirmDelete}
        productName={deleteTargetName}
        language={language}
        isDeleting={deletingSingle}
      />

      <DeleteConfirmModal
        isOpen={showBulkDeleteConfirm}
        onClose={() => setShowBulkDeleteConfirm(false)}
        onConfirm={confirmBulkDelete}
        productName={`${selectedProducts.length} products`}
        language={language}
        isDeleting={deletingBulk}
        isBulk={true}
      />
    </div>
  );
}
