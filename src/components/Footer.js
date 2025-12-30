"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Instagram, MessageCircle, Video, Music } from 'lucide-react'

export default function Footer() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return <footer className="h-20 bg-gray-50 dark:bg-[#0f0f0f]" />

  return (
    <footer className="bg-gray-50 dark:bg-[#0f0f0f] border-t dark:border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h3 className="font-black italic text-2xl mb-4 uppercase tracking-tighter italic">Salman <span className="text-[#2ea64d]">AppOrbit</span></h3>
          <p className="text-gray-500 text-sm max-w-sm italic mb-6">Premium apps at half the price. Each mod is verified by Salman Khan for security.</p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/salman_orakxi/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-white/5 rounded-2xl hover:text-[#2ea64d] transition-all border dark:border-white/10 shadow-sm"><Instagram size={20}/></a>
            <a href="https://wa.me/923275176283" target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-white/5 rounded-2xl hover:text-[#2ea64d] transition-all border dark:border-white/10 shadow-sm"><MessageCircle size={20}/></a>
            <a href="https://www.tiktok.com/@hba013" target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-white/5 rounded-2xl hover:text-[#2ea64d] transition-all border dark:border-white/10 shadow-sm"><Music size={20}/></a>
            <a href="https://www.capcut.com/profile/PcMJTW0O7lYBMSNm6lVMfgnxIC89wumA2ig5THnmg24" target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-white/5 rounded-2xl hover:text-[#2ea64d] transition-all border dark:border-white/10 shadow-sm"><Video size={20}/></a>
          </div>
        </div>
        <div><h4 className="text-xs font-black uppercase mb-6 text-gray-400 italic">Explore</h4><ul className="space-y-3 text-xs font-bold uppercase tracking-tighter text-gray-500"><li><Link href="/request">Request App</Link></li><li><Link href="/wishlist">Favorites</Link></li><li><Link href="/">Home</Link></li></ul></div>
        <div><h4 className="text-[10px] font-black uppercase mb-4 text-gray-400 italic">Legal</h4><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-loose">© 2025 SALMAN APPORBIT <br/> PK16 NAYA 1234 5032 7517 6283</p></div>
      </div>
    </footer>
  )
}