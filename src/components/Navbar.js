"use client";
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Heart, LayoutGrid, Zap } from 'lucide-react';

export default function Navbar({ onSearch }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-0 right-0 z-[500] px-4">
      <div className="max-w-5xl mx-auto glass-panel rounded-full h-14 flex items-center justify-between px-6 shadow-2xl border-white/10">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#2ea64d] text-white squircle flex items-center justify-center font-black italic shadow-[0_0_15px_rgba(46,166,77,0.4)] group-hover:scale-110 transition-transform">S</div>
          <span className="font-black text-sm tracking-tighter uppercase hidden sm:block">ORBIT</span>
        </Link>

        {/* Dynamic Search - Capsule Style */}
        <div className="flex-1 max-w-sm mx-4 relative">
          <input 
            type="text" 
            placeholder="Search mods..." 
            className="w-full bg-white/5 border border-white/5 px-4 py-1.5 rounded-full text-[11px] outline-none focus:border-[#2ea64d]/50 focus:bg-white/10 transition-all"
            onChange={(e) => onSearch && onSearch(e.target.value)} 
          />
          <Search className="absolute right-3 top-2 text-gray-500" size={14} />
        </div>

        {/* Links & Action */}
        <div className="flex items-center gap-4">
          <Link href="/wishlist" className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <Heart size={18} />
          </Link>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/apps/all" className="text-[10px] font-black uppercase text-gray-400 hover:text-[#2ea64d] tracking-widest transition-colors">Explorer</Link>
            <Link href="/request" className="text-[10px] font-black uppercase text-gray-400 hover:text-[#3b82f6] tracking-widest transition-colors">Request</Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 glass-panel rounded-[2rem] p-8 flex flex-col gap-6 lg:hidden shadow-2xl"
          >
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black italic uppercase tracking-tighter hover:text-[#2ea64d]">Home</Link>
            <Link href="/apps/all" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black italic uppercase tracking-tighter hover:text-[#2ea64d]">Explorer</Link>
            <Link href="/request" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black italic uppercase tracking-tighter hover:text-[#3b82f6]">Requests</Link>
            <div className="mt-4 pt-6 border-t border-white/5">
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Orbit Control Center</p>
               <h4 className="text-xl font-black italic text-[#2ea64d]">SALMAN KHAN</h4>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}