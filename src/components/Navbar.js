"use client";
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Smartphone, Gamepad2, LayoutGrid } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ onSearch }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-md border-b dark:border-white/5 h-16 flex items-center shadow-sm">
      <div className="max-w-7xl mx-auto w-full px-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#2ea64d] text-white px-2 py-1 rounded-lg font-black italic shadow-lg">SAO</div>
          <span className="font-black text-lg uppercase hidden sm:block dark:text-white">Salman <span className="text-[#2ea64d]">AppOrbit</span></span>
        </Link>

        {/* Search Bar (Workable) */}
        <div className="flex-1 max-w-md mx-6 relative group hidden md:block">
          <input 
            type="text" 
            placeholder="Search Orbit..." 
            className="w-full bg-gray-100 dark:bg-black/40 border-none px-4 py-2 rounded-full text-xs outline-none focus:ring-1 ring-[#2ea64d] dark:text-white"
            onChange={(e) => onSearch && onSearch(e.target.value)} 
          />
          <Search className="absolute right-4 top-2.5 text-gray-400 group-focus-within:text-[#2ea64d]" size={14} />
        </div>

        {/* Menu Links */}
        <div className="hidden lg:flex items-center gap-6">
          {[ {l:'Home', h:'/'}, {l:'Apps', h:'/#apps'}, {l:'Games', h:'/#games'}, {l:'Request', h:'/request'} ].map(t => (
            <Link key={t.l} href={t.h} className="text-[10px] font-black uppercase text-gray-500 hover:text-[#2ea64d] tracking-widest">{t.l}</Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-500"><Menu size={20}/></button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-16 left-0 right-0 bg-white dark:bg-[#111] p-6 flex flex-col gap-6 shadow-2xl lg:hidden">
            <input type="text" placeholder="Search..." className="p-4 bg-gray-100 dark:bg-black rounded-xl text-sm" onChange={(e) => onSearch(e.target.value)} />
            {[ 'Home', 'Apps', 'Games', 'Request' ].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="text-xl font-black uppercase italic">{l}</Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}