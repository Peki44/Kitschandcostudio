
import React from 'react';
import { Instagram, Facebook, Mail } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-black text-cardboard pt-16 pb-8 border-t-8 border-neonPink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand & Contact */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-display text-4xl font-bold mb-4 tracking-tight">
              kitsch<span className="font-sans font-light">&</span>co<span className="text-neonGreen">.</span>studio
            </h2>
            <p className="font-sans text-gray-400 max-w-sm leading-relaxed mb-8">
              Sustainable beauty products. Handcrafted in small batches with recycled cardboard packaging. Join the eco-revolution without losing your style.
            </p>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-800 pt-6 max-w-sm">
              <div>
                 <h4 className="font-sans font-bold text-white uppercase tracking-widest mb-2 text-xs">Studio</h4>
                 <p className="font-mono text-sm text-gray-400">Ilica 42</p>
                 <p className="font-mono text-sm text-gray-400">10000 Zagreb, Croatia</p>
              </div>
              <div>
                 <h4 className="font-sans font-bold text-white uppercase tracking-widest mb-2 text-xs">Contact</h4>
                 <a href="mailto:hello@kitschandco.studio" className="block font-mono text-sm text-neonGreen hover:text-neonPink transition-colors mb-1">
                   hello@kitschandco.studio
                 </a>
                 <p className="font-mono text-sm text-gray-400">+385 91 234 5678</p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-sans font-bold text-neonGreen uppercase tracking-widest mb-6">Explore</h3>
            <ul className="space-y-3 font-display text-lg">
              <li><a href="#" className="hover:text-neonPink transition-colors">Naša priča</a></li>
              <li><a href="#" className="hover:text-neonPink transition-colors">Sastojci</a></li>
              <li><a href="#" className="hover:text-neonPink transition-colors">Dostava</a></li>
              <li><a href="#" className="hover:text-neonPink transition-colors">Kontakt</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-sans font-bold text-neonPink uppercase tracking-widest mb-6">Stay in loop</h3>
            <p className="font-sans text-sm text-gray-400 mb-4">Subscribe for neon updates.</p>
            <div className="flex border-b border-gray-600 pb-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-transparent border-none outline-none w-full text-white placeholder-gray-600 font-sans focus:ring-0"
              />
              <button className="text-neonGreen font-bold hover:text-white uppercase text-xs">Join</button>
            </div>
            <div className="flex space-x-4 mt-8">
              <Instagram className="text-white hover:text-neonPink cursor-pointer transition-colors" />
              <Facebook className="text-white hover:text-neonPink cursor-pointer transition-colors" />
              <Mail className="text-white hover:text-neonPink cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-900 text-center font-sans text-xs text-gray-600 flex flex-col md:flex-row justify-center items-center gap-4">
          <p>&copy; {new Date().getFullYear()} kitsch&co.studio. All rights reserved. Designed with Neon Love.</p>
          <button onClick={onOpenAdmin} className="hover:text-neonPink opacity-50 hover:opacity-100 transition-opacity">
            ADMIN LOGIN
          </button>
        </div>
      </div>
    </footer>
  );
};
