
import React, { useState, ChangeEvent, useRef } from 'react';
import { Product, Category, AppSettings } from '../types';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  settings: AppSettings;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onSaveCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onSaveSetting: (key: string, value: string) => void;
  onClose: () => void;
}

type Tab = 'products' | 'categories' | 'design';

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, categories, settings, 
  onSaveProduct, onDeleteProduct, 
  onSaveCategory, onDeleteCategory, 
  onSaveSetting, onClose 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  
  // Product Form State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  
  // Category Form State
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  // --- IMAGE COMPRESSION UTILITY ---
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Limit width to 800px
          const scaleSize = MAX_WIDTH / img.width;
          
          // Only resize if image is larger than MAX_WIDTH
          if (scaleSize < 1) {
             canvas.width = MAX_WIDTH;
             canvas.height = img.height * scaleSize;
          } else {
             canvas.width = img.width;
             canvas.height = img.height;
          }

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Compress to JPEG with 0.7 quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };
  
  // Helper for image reading with compression
  const handleImageRead = async (e: ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        callback(compressed);
      } catch (err) {
        console.error("Image processing failed", err);
        alert("Greška pri učitavanju slike. Pokušajte drugu sliku.");
      }
    }
  };

  /* --- PRODUCT HANDLERS --- */
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct.price || !editingProduct.category) return;
    
    const productToSave: Product = {
      id: editingProduct.id || Date.now().toString(),
      name: editingProduct.name,
      category: editingProduct.category,
      subcategory: editingProduct.subcategory,
      price: editingProduct.price,
      image: editingProduct.image || 'https://via.placeholder.com/800',
      description: editingProduct.description || '',
      variants: editingProduct.variants || [],
    };
    onSaveProduct(productToSave);
    setEditingProduct(null);
  };

  const addVariant = () => {
    const val = prompt("Unesite naziv varijante:");
    if (val && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        variants: [...(editingProduct.variants || []), val]
      });
    }
  };

  /* --- CATEGORY HANDLERS --- */
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.title || !editingCategory.id) return;
    
    const categoryToSave: Category = {
      id: editingCategory.id,
      title: editingCategory.title,
      subcategories: editingCategory.subcategories || []
    };
    onSaveCategory(categoryToSave);
    setEditingCategory(null);
  };

  return (
    <div className="min-h-screen bg-cardboard py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn overflow-y-auto">
      <div className="max-w-6xl mx-auto bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 relative min-h-[80vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
          <h2 className="font-display font-black text-3xl md:text-5xl uppercase text-stroke-black">
            ADMIN <span className="text-neonPink">BACKSTAGE</span>
          </h2>
          <button onClick={onClose} className="text-3xl font-bold hover:text-neonPink transition-colors">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {(['products', 'categories', 'design'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-mono font-bold uppercase border-2 border-black transition-all ${
                activeTab === tab 
                  ? 'bg-black text-neonGreen shadow-[4px_4px_0px_0px_rgba(204,255,0,1)]' 
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {tab === 'products' ? 'Proizvodi' : tab === 'categories' ? 'Kategorije' : 'Dizajn'}
            </button>
          ))}
        </div>

        {/* --- PRODUCTS TAB --- */}
        {activeTab === 'products' && (
          <div className="flex-1">
            {!editingProduct ? (
              <>
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={() => setEditingProduct({ variants: [], category: categories[0]?.id })}
                    className="bg-neonPink text-white font-bold px-6 py-3 border-2 border-black hover:bg-black hover:text-neonPink uppercase tracking-widest"
                  >
                    + Novi Proizvod
                  </button>
                </div>
                <div className="overflow-x-auto border-2 border-black">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black text-white font-mono text-sm uppercase">
                        <th className="p-3 border-r border-gray-700">Slika</th>
                        <th className="p-3 border-r border-gray-700">Naziv</th>
                        <th className="p-3 border-r border-gray-700">Kategorija</th>
                        <th className="p-3 border-r border-gray-700">Cijena</th>
                        <th className="p-3">Akcije</th>
                      </tr>
                    </thead>
                    <tbody className="font-sans text-sm">
                      {products.map(p => (
                        <tr key={p.id} className="border-b border-black hover:bg-cardboard/30">
                          <td className="p-3 w-16">
                            <img src={p.image} alt="" className="w-10 h-10 object-cover border border-black" />
                          </td>
                          <td className="p-3 font-bold">{p.name}</td>
                          <td className="p-3">{p.category}</td>
                          <td className="p-3 font-mono">{p.price}</td>
                          <td className="p-3">
                            <button onClick={() => setEditingProduct(p)} className="text-blue-600 hover:underline mr-3 font-bold">UREDI</button>
                            <button onClick={() => { if(confirm('Obrisati?')) onDeleteProduct(p.id) }} className="text-red-600 hover:underline font-bold">OBRIŠI</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <form onSubmit={handleProductSubmit} className="space-y-6 max-w-2xl mx-auto border-2 border-dashed border-gray-300 p-6 bg-gray-50">
                <h3 className="font-bold text-xl uppercase mb-4 border-b-2 border-neonGreen inline-block">
                  {editingProduct.id ? 'Uredi Proizvod' : 'Novi Proizvod'}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase mb-1">Slika</label>
                    <div className="flex items-center gap-4">
                      {editingProduct.image && <img src={editingProduct.image} className="w-20 h-20 object-cover border border-black" />}
                      <input type="file" onChange={(e) => handleImageRead(e, (base64) => setEditingProduct({...editingProduct, image: base64}))} />
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">Slike se automatski optimiziraju za web.</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Naziv</label>
                    <input className="w-full border-2 border-black p-2" value={editingProduct.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} required />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Cijena</label>
                    <input className="w-full border-2 border-black p-2" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} required />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Kategorija</label>
                    <select className="w-full border-2 border-black p-2" value={editingProduct.category || ''} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} required>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Podkategorija</label>
                    <input className="w-full border-2 border-black p-2" value={editingProduct.subcategory || ''} onChange={e => setEditingProduct({...editingProduct, subcategory: e.target.value})} />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold uppercase mb-1">Opis</label>
                    <textarea className="w-full border-2 border-black p-2" rows={3} value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                  </div>

                  <div className="col-span-2">
                     <label className="block text-xs font-bold uppercase mb-1">Varijante</label>
                     <div className="flex flex-wrap gap-2 mb-2">
                       {editingProduct.variants?.map((v, idx) => (
                         <span key={idx} className="bg-black text-white px-2 py-1 text-xs">{v} <button type="button" onClick={() => setEditingProduct({...editingProduct, variants: editingProduct.variants?.filter((_, i) => i !== idx)})} className="ml-1 text-neonPink">x</button></span>
                       ))}
                     </div>
                     <button type="button" onClick={addVariant} className="text-xs bg-gray-200 px-2 py-1 border border-black hover:bg-neonGreen">+ Dodaj Varijantu</button>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-black text-white font-bold py-3 hover:bg-neonPink hover:text-black transition-colors">SPREMI</button>
                  <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-3 border-2 border-black font-bold hover:bg-gray-200">ODUSTANI</button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* --- CATEGORIES TAB --- */}
        {activeTab === 'categories' && (
           <div className="flex-1">
             {!editingCategory ? (
               <>
                 <div className="flex justify-end mb-4">
                    <button 
                      onClick={() => setEditingCategory({ subcategories: [] })}
                      className="bg-neonPink text-white font-bold px-6 py-3 border-2 border-black hover:bg-black hover:text-neonPink uppercase tracking-widest"
                    >
                      + Nova Kategorija
                    </button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map(cat => (
                      <div key={cat.id} className="border-2 border-black p-4 bg-gray-50 flex justify-between items-start">
                        <div>
                          <h4 className="font-display font-bold text-xl uppercase">{cat.title}</h4>
                          <span className="text-xs font-mono text-gray-500">ID: {cat.id}</span>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {cat.subcategories?.map(sub => (
                              <span key={sub} className="text-[10px] bg-cardboard border border-black px-1 uppercase">{sub}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                           <button onClick={() => setEditingCategory(cat)} className="text-xs font-bold border border-black px-2 py-1 hover:bg-black hover:text-white">UREDI</button>
                           <button onClick={() => { if(confirm('Obrisati?')) onDeleteCategory(cat.id) }} className="text-xs font-bold border border-black px-2 py-1 hover:bg-red-600 hover:text-white">OBRIŠI</button>
                        </div>
                      </div>
                    ))}
                 </div>
               </>
             ) : (
                <form onSubmit={handleCategorySubmit} className="space-y-6 max-w-md mx-auto border-2 border-dashed border-gray-300 p-6 bg-gray-50">
                  <h3 className="font-bold text-xl uppercase mb-4 border-b-2 border-neonGreen inline-block">
                    {editingCategory.title ? 'Uredi Kategoriju' : 'Nova Kategorija'}
                  </h3>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">ID (bez razmaka, npr. 'kozmetika')</label>
                    <input className="w-full border-2 border-black p-2 font-mono" value={editingCategory.id || ''} onChange={e => setEditingCategory({...editingCategory, id: e.target.value.toLowerCase().replace(/\s/g, '-')})} required disabled={!!categories.find(c => c.id === editingCategory.id && editingCategory !== c)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Naziv (Naslov)</label>
                    <input className="w-full border-2 border-black p-2" value={editingCategory.title || ''} onChange={e => setEditingCategory({...editingCategory, title: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Podkategorije (odvoji zarezom)</label>
                    <input 
                      className="w-full border-2 border-black p-2" 
                      value={editingCategory.subcategories?.join(', ') || ''} 
                      onChange={e => setEditingCategory({...editingCategory, subcategories: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} 
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-black text-white font-bold py-3 hover:bg-neonPink hover:text-black transition-colors">SPREMI</button>
                    <button type="button" onClick={() => setEditingCategory(null)} className="px-6 py-3 border-2 border-black font-bold hover:bg-gray-200">ODUSTANI</button>
                  </div>
                </form>
             )}
           </div>
        )}

        {/* --- DESIGN TAB --- */}
        {activeTab === 'design' && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Logo Editor */}
             <div className="border-2 border-black p-6 bg-white">
                <h3 className="font-bold text-xl uppercase mb-4 border-b-4 border-neonGreen inline-block">Logo</h3>
                <div className="mb-4 h-32 flex items-center justify-center bg-cardboard border border-black">
                   <img src={settings.logoUrl} alt="Current Logo" className="max-h-full max-w-full object-contain" />
                </div>
                <label className="cursor-pointer block w-full bg-black text-white text-center font-bold py-3 hover:bg-neonPink hover:text-black transition-colors">
                   UČITAJ NOVI LOGO
                   <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageRead(e, (val) => onSaveSetting('logoUrl', val))} />
                </label>
             </div>

             {/* Hero Image Editor */}
             <div className="border-2 border-black p-6 bg-white">
                <h3 className="font-bold text-xl uppercase mb-4 border-b-4 border-neonGreen inline-block">Hero Image</h3>
                <div className="mb-4 h-64 flex items-center justify-center bg-cardboard border border-black overflow-hidden relative">
                   <img src={settings.heroImageUrl} alt="Current Hero" className="w-full h-full object-cover" />
                </div>
                <label className="cursor-pointer block w-full bg-black text-white text-center font-bold py-3 hover:bg-neonPink hover:text-black transition-colors">
                   UČITAJ NOVI HERO IMAGE
                   <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageRead(e, (val) => onSaveSetting('heroImageUrl', val))} />
                </label>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};
