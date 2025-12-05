
import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { Concierge } from './components/Concierge';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { Product, Category, AppSettings } from './types';
import { initDB, checkAndSeed, storage } from './services/storage';

const App: React.FC = () => {
  // Application State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ logoUrl: '', heroImageUrl: '' });
  const [isLoading, setIsLoading] = useState(true);

  // View State
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // --- Initialization ---
  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initDB();
        await checkAndSeed(); // Ensure data exists
        
        // Add a small delay to ensure seeding tx completes if it ran
        setTimeout(async () => {
            const [loadedProducts, loadedCategories, loadedSettings] = await Promise.all([
              storage.getProducts(),
              storage.getCategories(),
              storage.getSettings()
            ]);
            setProducts(loadedProducts);
            setCategories(loadedCategories);
            setSettings(loadedSettings);
            setIsLoading(false);
        }, 100);
      } catch (e) {
        console.error("Failed to load application data:", e);
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);

  // --- Handlers ---
  const handleProductSelect = (product: Product) => {
    window.scrollTo(0, 0);
    setSelectedProduct(product);
  };

  const handleCategorySelect = (id: string | null) => {
    setActiveCategory(id);
    setSelectedProduct(null); 
    setShowAdmin(false);
    window.scrollTo(0, 0);
  };

  const handleBackToGrid = () => setSelectedProduct(null);

  // --- Admin Actions ---
  const handleSaveProduct = async (product: Product) => {
    await storage.saveProduct(product);
    // Refresh list
    const updated = await storage.getProducts();
    setProducts(updated);
  };

  const handleDeleteProduct = async (id: string) => {
    await storage.deleteProduct(id);
    const updated = await storage.getProducts();
    setProducts(updated);
  };

  const handleSaveCategory = async (category: Category) => {
    await storage.saveCategory(category);
    const updated = await storage.getCategories();
    setCategories(updated);
  };

  const handleDeleteCategory = async (id: string) => {
    await storage.deleteCategory(id);
    const updated = await storage.getCategories();
    setCategories(updated);
  };

  const handleSaveSetting = async (key: string, value: string) => {
    await storage.saveSetting(key, value);
    const updated = await storage.getSettings();
    setSettings(updated);
  };

  // --- Filter Logic ---
  const displayedProducts: Product[] = activeCategory 
    ? products.filter(p => p.category === activeCategory)
    : products;

  const currentCategoryTitle = activeCategory 
    ? categories.find(c => c.id === activeCategory)?.title 
    : "NOVA KOLEKCIJA";


  if (isLoading) {
    return (
      <div className="min-h-screen bg-cardboard flex items-center justify-center">
        <div className="text-3xl font-display font-bold animate-pulse text-neonPink">LOADING KITSCH...</div>
      </div>
    );
  }

  // --- Render Views ---
  let content;
  if (showAdmin) {
    content = (
      <AdminPanel 
        products={products}
        categories={categories}
        settings={settings}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
        onSaveSetting={handleSaveSetting}
        onClose={() => setShowAdmin(false)} 
      />
    );
  } else if (selectedProduct) {
    content = <ProductDetail product={selectedProduct} onBack={handleBackToGrid} />;
  } else {
    // Default Shop View
    content = (
      <>
        {/* Hero Section (Only visible on Home) */}
        {!activeCategory && (
          <section className="relative w-full border-b-2 border-black overflow-hidden bg-[#F0EBE0]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-16 flex flex-col justify-center relative z-10 min-h-[60vh]">
                <div className="absolute top-0 left-0 w-32 h-32 bg-neonGreen rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
                
                <h2 className="font-display font-black text-5xl sm:text-7xl 2xl:text-9xl uppercase leading-[1] mb-6 mix-blend-darken text-fashionBlack">
                  Pure <br/>
                  <span className="text-white text-stroke-black">Kitsch</span> <br/>
                  Beauty
                </h2>
                <p className="font-sans text-lg md:text-xl font-medium max-w-md mb-8 border-l-4 border-neonPink pl-4">
                  Ručno rađena kozmetika, svijeće i mirisi. Prirodni sastojci u recikliranom ruhu.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleCategorySelect(categories[0]?.id)}
                    className="bg-black text-white font-sans font-bold px-8 py-4 hover:bg-neonPink hover:text-black transition-colors border-2 border-black uppercase tracking-widest"
                  >
                    Istraži
                  </button>
                  <button className="bg-transparent text-black font-sans font-bold px-8 py-4 hover:bg-neonGreen transition-colors border-2 border-black uppercase tracking-widest">
                    O nama
                  </button>
                </div>
              </div>
              
              {/* Hero Image Section */}
              <div className="relative h-[50vh] lg:h-auto bg-cardboard border-l-2 border-black flex items-center justify-center p-6">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className="w-[80%] aspect-square rounded-full border-2 border-neonPink/30 animate-pulse"></div>
                </div>
                
                <img 
                  src="/kitschandcostudio_1.jpg" 
                  alt="Kitsch Studio Hero" 
                  className="aspect-[2/2] w-auto max-h-[70%] max-w-[80%] object-contain drop-shadow-[10px_10px_0px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            
            {/* Running Text Banner */}
            <div className="bg-neonGreen border-t-2 border-black py-2 overflow-hidden whitespace-nowrap">
              <div className="animate-marquee inline-block">
                <span className="text-black font-bold font-mono text-sm sm:text-lg mx-4">HANDMADE • ORGANIC • RECYCLED • CHIC •</span>
                <span className="text-black font-bold font-mono text-sm sm:text-lg mx-4">HANDMADE • ORGANIC • RECYCLED • CHIC •</span>
                <span className="text-black font-bold font-mono text-sm sm:text-lg mx-4">HANDMADE • ORGANIC • RECYCLED • CHIC •</span>
                <span className="text-black font-bold font-mono text-sm sm:text-lg mx-4">HANDMADE • ORGANIC • RECYCLED • CHIC •</span>
                <span className="text-black font-bold font-mono text-sm sm:text-lg mx-4">HANDMADE • ORGANIC • RECYCLED • CHIC •</span> 
                <span className="text-black font-bold font-mono text-sm sm:text-lg mx-4">HANDMADE • ORGANIC • RECYCLED • CHIC •</span>
              </div>
            </div>
          </section>
        )}

        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-12 border-b-4 border-black pb-4">
            <h2 className="font-display font-black text-black text-xl md:text-6xl uppercase stroke-black text-stroke-2">
              {currentCategoryTitle}
            </h2>
            <span className="font-mono text-sm mb-2">{displayedProducts.length} ARTIKALA</span>
          </div>

          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
              {displayedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={handleProductSelect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-gray-500">Kategorija je trenutno prazna.</p>
            </div>
          )}
        </section>

        {/* Brand Banner - Only on Home */}
        {!activeCategory && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-32">
                <div className="relative py-16 px-8 border-2 border-black bg-neonGreen overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neonPink rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <h3 className="font-display text-2xl md:text-6xl font-black uppercase mb-6 leading-none text-black">Recycled. <br/>Radical. Real.</h3>
                    <p className="font-sans text-lg font-bold text-black/80">
                        We believe in packaging that doesn't cost the Earth, and aesthetics that don't bore the eyes. 
                        Our products are 100% natural, encased in recycled cardboard.
                    </p>
                    </div>
                </div>
            </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-cardboard selection:bg-neonPink selection:text-white">
      {!showAdmin && (
        <Navigation 
          activeCategory={activeCategory} 
          onSelectCategory={handleCategorySelect} 
          logoUrl={settings.logoUrl}
          categories={categories}
          onOpenCart={() => setCartOpen(true)}
        />
      )}

      {/* Cart Drawer */}
      <div className={`fixed inset-0 z-[120] flex justify-end transition-all duration-500 ${cartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${cartOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setCartOpen(false)}
        ></div>
        <div 
          className={`relative w-full max-w-md bg-cardboard h-full shadow-2xl p-6 flex flex-col border-l-4 border-black transition-transform duration-500 ease-in-out transform ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
              <h2 className="font-display text-2xl font-bold uppercase">Your Cart</h2>
              <button onClick={() => setCartOpen(false)} className="hover:text-neonPink font-bold">
                CLOSE [X]
              </button>
            </div>
            <div className="flex-grow flex items-center justify-center text-gray-500 font-sans italic">
              <div className="text-center">
                 <p className="mb-4 text-lg">Your bag is currently empty.</p>
                 <button onClick={() => setCartOpen(false)} className="text-neonPink underline font-bold hover:text-black">Start Shopping</button>
              </div>
            </div>
            <button className="w-full bg-black text-white py-4 font-display font-bold text-xl uppercase tracking-widest hover:bg-neonGreen hover:text-black transition-colors border-2 border-black">
              Checkout
            </button>
          </div>
      </div>

      <main>
        {content}
      </main>

      {/* Concierge Service - Pass context */}
      {/*<Concierge categories={categories} products={products} />*/}

      {/* Footer */}
      {!showAdmin && (
        <Footer onOpenAdmin={() => setShowAdmin(true)} />
      )}

    </div>
  );
};

export default App;
