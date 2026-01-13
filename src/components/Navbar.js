"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ onSearch }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-md border-b dark:border-white/5 h-16 flex items-center shadow-sm">
      <div className="max-w-7xl mx-auto w-full px-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#2ea64d] text-white px-2 py-1 rounded-lg font-black italic shadow-lg">SAO</div>
          <span className="font-black text-lg tracking-tighter uppercase hidden sm:block dark:text-white">Salman <span className="text-[#2ea64d]">AppOrbit</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 font-bold uppercase text-[10px] tracking-widest">
          <Link href="/" className="hover:text-[#2ea64d] transition-colors">Home</Link>
          <Link href="/apps/all" className="hover:text-[#2ea64d] transition-colors">Apps</Link>
          <Link href="/apps/all" className="hover:text-[#2ea64d] transition-colors">Games</Link>
          <Link href="/request" className="hover:text-[#2ea64d] transition-colors">Requests</Link>
        </div>

        {/* Search & Theme */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-gray-100 dark:bg-black/40 border-none px-4 py-1.5 rounded-full text-xs outline-none focus:ring-1 ring-[#2ea64d] w-40 dark:text-white"
              onChange={(e) => onSearch && onSearch(e.target.value)} 
            />
            <Search className="absolute right-4 top-2 text-gray-400" size={14} />
          </div>
          <ThemeToggle />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-500"><Menu size={20}/></button>
        </div>
      </div>
    </nav>
  );
}