'use client';

// import { useState } from 'react'; // Unused import removed
import { ProductSize, ProductColor } from '@/types';

interface ProductVariantSelectorProps {
  sizes?: ProductSize[] | undefined;
  colors?: ProductColor[] | undefined;
  selectedSize?: string;
  selectedColor?: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}

export default function ProductVariantSelector({
  sizes = [],
  colors = [],
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}: ProductVariantSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Size Selection */}
      {sizes && sizes.length > 0 && (
        <div className="space-y-3">
          <label className="text-lg font-semibold text-gray-900 dark:text-white">
            Size {selectedSize && <span className="text-sm font-normal text-gray-600 dark:text-gray-400">({selectedSize.toUpperCase()})</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((sizeOption) => {
              const isSelected = selectedSize === sizeOption.size;
              const isOutOfStock = sizeOption.stock === 0;
              
              return (
                <button
                  key={sizeOption.size}
                  onClick={() => !isOutOfStock && onSizeChange(sizeOption.size)}
                  disabled={isOutOfStock}
                  className={`
                    relative px-4 py-2 border-2 rounded-lg font-semibold text-sm transition-all
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : isOutOfStock
                        ? 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }
                  `}
                >
                  {sizeOption.size.toUpperCase()}
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-red-400 rotate-45"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {selectedSize && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Stock available: {sizes.find(s => s.size === selectedSize)?.stock || 0} pieces
            </div>
          )}
        </div>
      )}

      {/* Color Selection */}
      {colors && colors.length > 0 && (
        <div className="space-y-3">
          <label className="text-lg font-semibold text-gray-900 dark:text-white">
            Color {selectedColor && <span className="text-sm font-normal text-gray-600 dark:text-gray-400">({colors.find(c => c.value === selectedColor)?.name})</span>}
          </label>
          <div className="flex flex-wrap gap-3">
            {colors.map((colorOption) => {
              const isSelected = selectedColor === colorOption.value;
              
              return (
                <button
                  key={colorOption.value}
                  onClick={() => onColorChange(colorOption.value)}
                  className={`
                    relative group flex items-center gap-3 px-4 py-3 border-2 rounded-lg transition-all
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }
                  `}
                >
                  {/* Color Circle */}
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0"
                    style={{ backgroundColor: colorOption.value }}
                  />
                  
                  {/* Color Name */}
                  <span className={`font-medium text-sm ${
                    isSelected 
                      ? 'text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {colorOption.name}
                  </span>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selection Summary */}
      {(selectedSize || selectedColor) && (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Your Selection:</h4>
          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            {selectedSize && (
              <div>Size: <span className="font-medium text-gray-900 dark:text-white">{selectedSize.toUpperCase()}</span></div>
            )}
            {selectedColor && (
              <div>Color: <span className="font-medium text-gray-900 dark:text-white">{colors.find(c => c.value === selectedColor)?.name}</span></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
