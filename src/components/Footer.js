"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Instagram, MessageCircle, Video, Music } from 'lucide-react'

export default function Footer() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return <footer className="h-20" />

  return (
    <footer className="bg-gray-50 dark:bg-[#0f0f0f] border-t dark:border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h3 className="font-black italic text-2xl mb-4 uppercase tracking-tighter">
            Salman <span className="text-[#2ea64d]">AppOrbit</span>
          </h3>
          <p className="text-gray-500 text-sm max-w-sm italic mb-6">
            Verified Premium Apps at half the price. Manual security verification by Salman Khan.
          </p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/salman_orakxi/" target="_blank" className="p-3 bg-white dark:bg-white/5 rounded-2xl border dark:border-white/10"><Instagram size={20}/></a>
            <a href="https://wa.me/923275176283" target="_blank" className="p-3 bg-white dark:bg-white/5 rounded-2xl border dark:border-white/10"><MessageCircle size={20}/></a>
          </div>
        </div>

        {/* EXPLORE SECTION */}
        <div>
          <h4 className="text-xs font-black uppercase mb-6 text-gray-400 italic">Explore</h4>
          <ul className="space-y-3 text-xs font-bold uppercase tracking-tighter text-gray-500">
            <li><Link href="/" className="hover:text-[#2ea64d]">Home</Link></li>
            <li><Link href="/request" className="hover:text-[#2ea64d]">Request App</Link></li>
            <li><Link href="/wishlist" className="hover:text-[#2ea64d]">My Favorites</Link></li>
          </ul>
        </div>

        {/* LEGAL SECTION (NEW LINKS ADDED HERE) */}
        <div>
          <h4 className="text-xs font-black uppercase mb-6 text-gray-400 italic">Legal & Support</h4>
          <ul className="space-y-3 text-xs font-bold uppercase tracking-tighter text-gray-500">
            <li><Link href="/about" className="hover:text-[#2ea64d]">About Us</Link></li>
            <li><Link href="/privacy" className="hover:text-[#2ea64d]">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-[#2ea64d]">Terms & Conditions</Link></li>
            <li className="text-[10px] text-gray-400 mt-4">PK16 NAYA 1234 5032 7517 6283</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}