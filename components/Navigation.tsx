
import React, { useState, useEffect } from 'react';
import { Category } from '../types';

interface NavigationProps {
  activeCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  logoUrl: string;
  categories: Category[];
  onOpenCart: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeCategory, onSelectCategory, logoUrl, categories, onOpenCart }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const handleNavClick = (category: Category) => {
    if (category.subcategories && category.subcategories.length > 0) {
       setExpandedCategory(expandedCategory === category.title ? null : category.title);
    } else {
       onSelectCategory(category.id);
       setMenuOpen(false);
       setExpandedCategory(null);
    }
  };

  const handleSubCategoryClick = (categoryId: string) => {
    // In a real app we might filter by subcategory, here we just go to the category page
    onSelectCategory(categoryId);
    setMenuOpen(false);
    setExpandedCategory(null);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-cardboard/95 backdrop-blur-sm border-b border-black/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Left: Menu Button */}
            <button 
              onClick={() => setMenuOpen(true)}
              className="group flex items-center gap-3 text-black hover:text-neonPink transition-colors z-20"
            >
              <div className="relative">
                 {/* Menu Icon */}
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
                 </svg>
                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-neonGreen rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="hidden sm:block font-sans font-bold uppercase tracking-widest text-sm">Menu</span>
            </button>

            {/* Center: Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer z-10 bg-transparent group" onClick={() => onSelectCategory(null)}>
                  <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
                    kitsch<span className="font-sans font-light">&</span>co<span className="text-neonPink">.</span>studio
                  </h1>
                  <div className="absolute -bottom-1 left-0 w-full h-3 bg-neonGreen/50 -skew-x-12 hidden group-hover:block transition-all duration-300"></div>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center space-x-6 z-20">
              <button className="hidden sm:block text-black hover:text-neonGreen transition-colors">
                {/* Search Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </button>
              
              <button className="hidden sm:block text-black hover:text-neonPink transition-colors">
                {/* Heart Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </button>

              <button 
                onClick={onOpenCart}
                className="text-black hover:text-neonPink transition-colors relative"
              >
                {/* Shopping Bag Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <span className="absolute -top-1 -right-1 bg-neonGreen text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-black">0</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-cardboard z-[100] transition-transform duration-500 ease-in-out flex flex-col ${
          menuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Menu Header */}
        <div className="flex justify-between items-center p-4 sm:px-8 h-20 border-b border-black/10 flex-shrink-0">
          <span className="font-sans font-bold text-sm uppercase tracking-widest text-gray-500">Navigation</span>
          <button 
            onClick={() => setMenuOpen(false)}
            className="group flex items-center gap-2 text-black hover:text-neonPink transition-colors"
          >
            <span className="font-sans font-bold uppercase tracking-widest text-sm">Close</span>
            <div className="bg-black text-white rounded-full p-1 group-hover:bg-neonPink transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
               </svg>
            </div>
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-12 md:py-10">
            <ul className="space-y-4 md:space-y-6">
              {categories.map((item) => (
                <li key={item.id} className="border-b border-black/5 pb-4 md:pb-6 last:border-0">
                  <button
                    onClick={() => handleNavClick(item)}
                    className="w-full flex items-center justify-between group text-left"
                  >
                    <span className={`font-display text-3xl md:text-5xl lg:text-5xl font-bold transition-colors duration-300 uppercase ${
                      (expandedCategory === item.title || activeCategory === item.id) ? 'text-neonPink' : 'text-black group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neonPink group-hover:to-neonGreen'
                    }`}>
                      {item.title}
                    </span>
                    
                    {item.subcategories && item.subcategories.length > 0 ? (
                      <div className={`transform transition-transform duration-300 ${expandedCategory === item.title ? 'rotate-180' : ''}`}>
                         {/* Chevron Down */}
                         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-black">
                           <path d="m6 9 6 6 6-6"/>
                         </svg>
                      </div>
                    ) : (
                       /* Chevron Right */
                       <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-black opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-2">
                         <path d="m9 18 6-6-6-6"/>
                       </svg>
                    )}
                  </button>

                  {/* Subcategories Accordion */}
                  <div 
                    className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedCategory === item.title 
                        ? 'grid-rows-[1fr] opacity-100 mt-6' 
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="min-h-0 pl-4 md:pl-8 border-l-2 border-neonGreen">
                      <ul className="space-y-3">
                        {item.subcategories?.map((sub) => (
                          <li key={sub}>
                            <button
                              onClick={() => handleSubCategoryClick(item.id)}
                              className="font-sans text-lg md:text-xl text-gray-600 hover:text-black hover:underline decoration-neonPink underline-offset-4 transition-colors uppercase"
                            >
                              {sub}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Menu Footer decorative */}
        <div className="p-4 text-center bg-black text-neonGreen font-sans text-xs uppercase tracking-[0.3em] flex-shrink-0">
          Sustainable Beauty • Recycled • Handcrafted
        </div>
      </div>
    </>
  );
};
