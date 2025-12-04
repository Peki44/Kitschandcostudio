import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      onClick={() => onClick(product)}
      className="group relative bg-cardboard-dark overflow-hidden cursor-pointer border border-transparent hover:border-neonGreen transition-all duration-300"
    >
      
      {/* Image Container with Overlay Effect */}
      <div className="relative aspect-[4/4] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-neonPink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-multiply"></div>
      </div>

      {/* Product Info */}
      <div className="p-4 relative">
        <div className="absolute -top-6 left-4 bg-black text-white px-2 py-0.5 text-xs font-bold uppercase tracking-widest border border-white">
          {product.category}
        </div>
        
        <h3 className="font-display font-bold text-2xl leading-none mt-2 group-hover:text-neonPink transition-colors">
          {product.name}
        </h3>
        
        {product.subcategory && (
          <p className="font-sans text-xs font-semibold text-gray-700 mt-1 uppercase tracking-wider">
            {product.subcategory}
          </p>
        )}

        <p className="font-mono font-bold text-lg text-black mt-3">
            {product.price}
        </p>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-4 right-4">
           <span className="text-3xl">→</span>
        </div>
      </div>
    </div>
  );
};