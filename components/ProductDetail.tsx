import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Initialize first variant as selected if variants exist
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    setQuantity(1);
  }, [product]);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="animate-fadeIn pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-8 md:pt-24">
        {/* Back Navigation */}
        <button 
          onClick={onBack}
          className="mb-8 font-bold text-sm uppercase tracking-widest hover:text-neonPink transition-colors flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> 
          <span>Povratak</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Image Section */}
          <div className="relative group">
             <div className="relative aspect-[4/4] sm:aspect-[3/4]  overflow-hidden border-2 border-black shadow-[8px_8px_0px_0px_rgba(255,0,255,1)] bg-white z-10">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
             </div>
             {/* Decor Elements */}
             <div className="absolute -z-10 -bottom-4 -left-4 w-full h-full border-2 border-neonPink"></div>
             <div className="absolute -z-20 -top-4 -right-4 w-32 h-32 bg-neonGreen rounded-full blur-2xl opacity-50"></div>
          </div>

          {/* Info Section */}
          <div className="lg:sticky lg:top-32">
             <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
               <span>{product.category}</span>
               <span className="text-neonPink">/</span>
               <span>{product.subcategory || 'Kolekcija'}</span>
             </div>

             <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl leading-[0.9] uppercase mb-8 text-black break-words">
               {product.name}
             </h1>

             <div className="flex items-center justify-between border-y-2 border-black py-6 mb-8">
               <span className="font-display font-bold text-4xl text-black">
                 {product.price}
               </span>
               <div className="flex gap-2 items-center">
                 <span className="w-3 h-3 rounded-full bg-neonGreen border border-black animate-pulse"></span>
                 <span className="font-mono text-xs uppercase tracking-widest">Dostupno</span>
               </div>
             </div>

             <div className="prose prose-lg font-sans text-gray-800 mb-10 leading-relaxed">
               <p className="font-bold text-xl mb-4">{product.description}</p>
               <p className="text-base text-gray-600">
                 Ručno izrađeno s pažnjom u našem zagrebačkom studiju. Svaki proizvod je jedinstven, koristi 100% recikliranu ambalažu i organske sastojke lokalnog podrijetla. Dizajnirano da probudi vaša osjetila.
               </p>
             </div>

             {/* Variant Selector */}
             {product.variants && (
               <div className="mb-8 animate-fadeIn">
                 <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-3">
                   Odaberi varijantu
                 </label>
                 <div className="flex flex-wrap gap-3">
                   {product.variants.map((variant) => (
                     <button
                       key={variant}
                       onClick={() => setSelectedVariant(variant)}
                       className={`
                         relative px-6 py-3 border-2 border-black font-sans font-bold text-sm uppercase tracking-wider transition-all duration-200
                         ${selectedVariant === variant 
                           ? 'bg-neonGreen text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' 
                           : 'bg-transparent text-black hover:bg-black hover:text-white'
                         }
                       `}
                     >
                       {variant}
                     </button>
                   ))}
                 </div>
               </div>
             )}

             {/* Actions Bar: Quantity, Add to Cart, Favorites */}
             <div className="flex flex-wrap sm:flex-nowrap gap-4 mb-8">
               {/* Quantity Selector */}
               <div className="order-1 sm:order-none flex items-center border-2 border-black bg-white h-14 w-auto">
                 <button 
                   onClick={handleDecrement}
                   className="w-12 h-full flex items-center justify-center hover:bg-gray-100 transition-colors text-2xl font-bold"
                 >
                   &minus;
                 </button>
                 <span className="w-12 text-center font-display font-bold text-2xl mb-1">{quantity}</span>
                 <button 
                   onClick={handleIncrement}
                   className="w-12 h-full flex items-center justify-center hover:bg-gray-100 transition-colors text-2xl font-bold"
                 >
                   +
                 </button>
               </div>

               {/* Add to Cart Button - Order 3 on mobile (new line), Order 2 on desktop */}
               <button 
                 className="order-3 sm:order-none w-full sm:w-auto sm:flex-1 bg-black text-white font-display font-bold text-lg hover:bg-neonPink hover:text-black transition-all border-2 border-black uppercase tracking-wider flex items-center justify-center h-14 px-8"
                 onClick={() => alert(`Dodan u košaricu: ${quantity}x ${product.name} ${selectedVariant ? `(${selectedVariant})` : ''}`)}
               >
                 Dodaj u košaricu
               </button>

               {/* Favorites Button - Order 2 on mobile (right of qty), Order 3 on desktop */}
               <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`order-2 sm:order-none ml-auto sm:ml-0 w-14 h-14 flex items-center justify-center border-2 border-black transition-colors ${isFavorite ? 'bg-neonPink text-black' : 'bg-transparent text-black hover:bg-gray-100'}`}
               >
                 {isFavorite ? (
                   // Filled Heart
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                     <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                   </svg>
                 ) : (
                   // Outline Heart
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                   </svg>
                 )}
               </button>
             </div>

             {/* Additional Info Accordion-style */}
             <div className="grid grid-cols-2 gap-px bg-black border border-black">
                <div className="bg-cardboard p-6 text-center hover:bg-white transition-colors cursor-pointer group">
                  <span className="block font-mono text-xs uppercase text-gray-500 mb-2">Dostava</span>
                  <span className="font-bold text-sm group-hover:text-neonPink">EU & HRVATSKA</span>
                </div>
                <div className="bg-cardboard p-6 text-center hover:bg-white transition-colors cursor-pointer group">
                   <span className="block font-mono text-xs uppercase text-gray-500 mb-2">Materijal</span>
                   <span className="font-bold text-sm group-hover:text-neonPink">100% EKO PAPIR</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};