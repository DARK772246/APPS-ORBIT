"use client";
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Smartphone, Gamepad2, LayoutGrid, Heart } from 'lucide-react';
// ThemeToggle ka import yahan se hata hua hai

export default function Navbar({ onSearch }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Apps', href: '/#apps' },
    { name: 'Games', href: '/#games' },
    { name: 'All Orbit', href: '/apps/all' },
    { name: 'Requests', href: '/request' },
  ];

  return (
    <nav className="fixed top-0 w-full z-[200] bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-md border-b dark:border-white/5 h-16 flex items-center shadow-sm">
      <div className="max-w-7xl mx-auto w-full px-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#2ea64d] text-white rounded-lg flex items-center justify-center font-black italic shadow-lg">SAO</div>
          <span className="font-black text-lg tracking-tighter uppercase hidden sm:block dark:text-white">Salman <span className="text-[#2ea64d]">AppOrbit</span></span>
        </Link>

        {/* Desktop Search Bar */}
        <div className="flex-1 max-w-md mx-6 relative group hidden md:block">
          <input 
            type="text" 
            placeholder="Search premium apps..." 
            className="w-full bg-gray-100 dark:bg-black/40 border-none px-4 py-2 rounded-full text-xs outline-none focus:ring-1 ring-[#2ea64d] dark:text-white"
            onChange={(e) => onSearch && onSearch(e.target.value)} 
          />
          <Search className="absolute right-4 top-2.5 text-gray-400 group-focus-within:text-[#2ea64d]" size={14} />
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-[10px] font-black uppercase text-gray-500 hover:text-[#2ea64d] tracking-widest transition-colors">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Icons & Burger */}
        <div className="flex items-center gap-2">
          <Link href="/wishlist" className="p-2 text-gray-500 dark:text-gray-400">
            <Heart size={20} />
          </Link>
          
          {/* Burger Menu Button (Visible on Mobile) */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="lg:hidden p-2 text-gray-500 dark:text-gray-400 focus:outline-none"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 100 }} 
            // <--- ULTIMATE FIX: z-[500] (Global Top Layer) Aur BG ko pure black kar diya --->
            className="fixed inset-0 top-16 bg-black z-[500] lg:hidden p-6 flex flex-col gap-6 shadow-2xl"
          >
            {/* Mobile Search Bar */}
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-[#111] p-4 rounded-2xl outline-none text-sm dark:text-white border border-white/10" 
                onChange={(e) => {
                   onSearch && onSearch(e.target.value);
                }} 
              />
              <Search className="absolute right-4 top-4 text-gray-400" size={18} />
            </div>

            {/* Mobile Tabs/Links */}
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-black uppercase italic tracking-tighter text-white hover:text-[#2ea64d] transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Profile/Auth Placeholder for Mobile */}
            <div className="mt-auto pb-10 border-t border-white/5 pt-6">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Logged in as Administrator</p>
               <h4 className="text-xl font-black uppercase italic text-[#2ea64d]">Salman Khan</h4>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}