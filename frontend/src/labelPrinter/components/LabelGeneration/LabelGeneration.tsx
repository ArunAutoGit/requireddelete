import React, { useState } from 'react';
import { Search, Package, Eye } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../services/productService';
import { useCreateCouponBatch } from "../../hooks/useCreateCouponBatch";

interface LabelGenerationProps {
  isDark: boolean;
  onTabChange: (tab: string, printData?: any) => void;
  language: 'en' | 'hi';
}

export default function LabelGeneration({ isDark, onTabChange, language }: LabelGenerationProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [filters, setFilters] = useState({
    Cell: '',
    Part_No: '',
    Grade: '',
    Size: ''
  });

  // Fetch products from API
  const { products, loading, error } = useProducts();
  const { createBatch, loading: batchLoading, error: batchError } = useCreateCouponBatch();

  const texts = {
    en: {
      title: 'Generate Labels',
      subtitle: 'Select a product and generate QR code labels',
      searchPlaceholder: 'Search products or part numbers...',
      availableProducts: 'Available Products',
      labelGeneration: 'Label Generation',
      selectedProduct: 'Selected Product',
      quantityPerProduct: 'Quantity of Labels',
      generateLabels: 'Generate',
      preview: 'Preview'
    },
    hi: {
      title: 'लेबल जेनरेट करें',
      subtitle: 'एक उत्पाद चुनें और QR कोड लेबल जेनरेट करें',
      searchPlaceholder: 'उत्पाद या पार्ट नंबर खोजें...',
      availableProducts: 'उपलब्ध उत्पाद',
      labelGeneration: 'लेबल जेनरेशन',
      selectedProduct: 'चयनित उत्पाद',
      quantityPerProduct: 'लेबल की मात्रा',
      generateLabels: 'जेनरेट करें',
      preview: 'प्रीव्यू'
    }
  };

  const currentTexts = texts[language];

  const handleProductSelect = (product: Product) => {
    if (selectedProduct && selectedProduct.Slno === product.Slno) {
      setSelectedProduct(null);
    } else {
      setSelectedProduct(product);
    }
  };

  const handleGenerateLabels = async () => {
    if (selectedProduct && quantity > 0) {
      try {
        await createBatch(selectedProduct.product_id, quantity);
        
        // Navigate to batchdashboard without passing any data
        onTabChange("batchdashboard");
      } catch (err) {
        console.error("Error generating labels:", err);
        alert("Failed to generate labels. Please try again.");
      }
    }
  };

  // Apply filters + search
  const filteredProducts = products.filter(product => {
    return (
      (!searchTerm ||
        product.Product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.Part_No.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (!filters.Cell || product.Cell.includes(filters.Cell)) &&
      (!filters.Part_No || product.Part_No.includes(filters.Part_No)) &&
      (!filters.Grade || product.Grade.includes(filters.Grade)) &&
      (!filters.Size || product.Size.includes(filters.Size))
    );
  });

  return (
    <div className={`p-6 space-y-6 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {currentTexts.title}
          </h2>
          <p className={isDark ? 'text-gray-200' : 'text-gray-600'}>
            {currentTexts.subtitle}
          </p>
        </div>

        {selectedProduct && (
          <button
            onClick={() => onTabChange('preview')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ffff4d] to-[#ffff4d]/80 text-gray-900 rounded-lg hover:from-[#ffff4d]/90 hover:to-[#ffff4d] transition-all duration-200 font-medium"
          >
            <Eye className="w-4 h-4" />
            {currentTexts.preview} (1)
          </button>
        )}
      </div>

      {/* Loading & Error states */}
      {loading && <div className={isDark ? 'text-white' : 'text-gray-900'}>Loading products...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}
      {batchLoading && <div className={isDark ? 'text-yellow-400' : 'text-yellow-600'}>Generating labels...</div>}
      {batchError && <div className="text-red-500">{batchError}</div>}

      {!loading && !error && (
        <>
          {/* Search and Filters */}
          <div className={`
            ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
            p-6 rounded-xl border shadow-sm space-y-4
          `}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-500'}`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={currentTexts.searchPlaceholder}
                  className={`
                    w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-200
                    ${isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }
                    focus:outline-none focus:ring-2 focus:ring-[#ffff4d]/30 focus:border-[#ffff4d]
                  `}
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(filters).map(([key, value]) => (
                <div key={key}>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {key.replace('_', ' ')}
                  </label>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setFilters({...filters, [key]: e.target.value})}
                    placeholder={`Filter by ${key.toLowerCase()}`}
                    className={`
                      w-full px-3 py-2 rounded-lg border transition-colors duration-200
                      ${isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                      }
                      focus:outline-none focus:ring-2 focus:ring-[#ffff4d]/30 focus:border-[#ffff4d]
                    `}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product List */}
          <div className={`
            ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
            rounded-xl border shadow-sm overflow-hidden
          `}>
            <div className="p-6 border-b border-inherit">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {currentTexts.availableProducts} ({filteredProducts.length})
              </h3>
            </div>

            <div className="divide-y divide-inherit max-h-96 overflow-y-auto">
              {filteredProducts.map((product) => {
                const isSelected = selectedProduct && selectedProduct.Slno === product.Slno;
                return (
                  <div
                    key={product.Slno}
                    onClick={() => handleProductSelect(product)}
                    className={`
                      p-4 cursor-pointer transition-all duration-200
                      ${isSelected
                        ? 'bg-[#ffff4d]/10 border-l-4 border-[#ffff4d]'
                        : isDark
                          ? 'hover:bg-gray-700/50'
                          : 'hover:bg-[#fff9c4]'
                      }
                      ${isDark ? 'text-white' : 'text-gray-900'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Package className={`w-5 h-5 ${isDark ? 'text-[#ffff4d]' : 'text-yellow-600'}`} />
                          <h4 className="font-semibold">{product.Product}</h4>
                          <span className={`text-sm px-2 py-1 rounded ${
                            isDark ? 'bg-gray-700 text-[#ffff4d]' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {product.Grade}
                          </span>
                        </div>
                        <div className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          <div>Part No: <span className="font-mono">{product.Part_No}</span></div>
                          <div>Size: {product.Size} | Cell: {product.Cell} | MRP: ₹{product.MRP_Inner}</div>
                        </div>
                      </div>

                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${isSelected 
                          ? 'bg-[#ffff4d] border-[#ffff4d]' 
                          : isDark 
                            ? 'border-gray-500' 
                            : 'border-gray-300'
                        }
                      `}>
                        {isSelected && <div className="w-2 h-2 bg-gray-900 rounded-full" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generation Panel */}
          {selectedProduct && (
            <div className={`
              ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
              p-6 rounded-xl border shadow-sm
            `}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {currentTexts.labelGeneration}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {currentTexts.selectedProduct}
                  </h4>
                  <div className={`text-sm p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="font-semibold">{selectedProduct.Product}</div>
                    <div className="text-xs mt-1 opacity-75">Part No: {selectedProduct.Part_No}</div>
                    <div className="text-xs opacity-75">Grade: {selectedProduct.Grade} | Size: {selectedProduct.Size}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                      {currentTexts.quantityPerProduct}
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      className={`
                        w-full px-3 py-2 rounded-lg border transition-colors duration-200
                        ${isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                        }
                        focus:outline-none focus:ring-2 focus:ring-[#ffff4d]/30 focus:border-[#ffff4d]
                      `}
                    />
                  </div>

                  <button
                    onClick={handleGenerateLabels}
                    disabled={batchLoading}
                    className={`
                      w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
                      ${batchLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-[#ffff4d] to-[#ffff4d]/80 hover:from-[#ffff4d]/90 hover:to-[#ffff4d] focus:outline-none focus:ring-2 focus:ring-[#ffff4d]/30'
                      }
                      text-gray-900
                    `}
                  >
                    {batchLoading 
                      ? 'Generating...' 
                      : `${currentTexts.generateLabels} ${quantity} ${language === 'hi' ? 'लेबल' : 'Labels'}`
                    }
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}