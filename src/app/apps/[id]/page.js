"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Home as HomeIcon, Search, Heart, LayoutGrid, MessageSquare, Star, Bell, Filter } from 'lucide-react'

export default function GamingStore() {
  const [apps, setApps] = useState([])
  const [showStore, setShowStore] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchApps() {
      const { data } = await supabase.from('apps').select('*').order('created_at', { ascending: false })
      if (data) setApps(data)
      setLoading(false)
    }
    fetchApps()
  }, [])

  return (
    <div className="min-h-screen bg-[#050b18] text-white selection:bg-blue-500/30">
      <AnimatePresence mode="wait">
        {!showStore ? (
          /* --- SCREEN 1: SPLASH (3D POP-OUT LOOK) --- */
          <motion.div 
            key="splash"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            className="relative h-screen flex flex-col items-center justify-end pb-24 px-10 text-center"
          >
            <div className="absolute inset-0 z-0">
               <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000" className="w-full h-full object-cover opacity-40 scale-125" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050b18] via-[#050b18]/60 to-transparent"></div>
            </div>
            <div className="relative z-10 space-y-8">
              <h1 className="text-5xl font-black leading-tight uppercase italic tracking-tighter drop-shadow-2xl">
                Enjoy the best <br/> <span className="text-blue-500">Galaxy</span> ever
              </h1>
              <button 
                onClick={() => setShowStore(true)}
                className="bg-[#3b82f6] hover:bg-blue-600 text-white font-black px-16 py-5 rounded-[2rem] uppercase tracking-widest text-xs shadow-[0_20px_40px_rgba(59,130,246,0.3)] transition-all active:scale-95"
              >
                Lets Get Started
              </button>
            </div>
          </motion.div>
        ) : (
          /* --- SCREEN 2: MAIN STORE (EXACT LAYOUT) --- */
          <motion.div 
            key="store"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            className="pb-32 pt-6"
          >
            <div className="bg-glow top-0 left-0"></div>
            <div className="bg-glow bottom-0 right-0"></div>

            {/* Header */}
            <header className="px-6 flex justify-between items-center mb-8 sticky top-0 bg-[#050b18]/60 backdrop-blur-xl z-50 py-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                <ChevronLeft size={24}/>
              </div>
              <h2 className="text-lg font-black uppercase tracking-[0.2em] italic">Popular Games</h2>
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                <Bell size={24}/>
              </div>
            </header>

            {/* Search Bar */}
            <div className="px-6 mb-8">
               <div className="bg-white/5 border border-white/10 p-4 rounded-[1.5rem] flex items-center gap-4">
                  <Search size={20} className="text-gray-500"/>
                  <input type="text" placeholder="Search for your favorites..." className="bg-transparent border-none outline-none text-sm w-full" />
                  <Filter size={20} className="text-blue-500"/>
               </div>
            </div>

            {/* Poster Grid */}
            <main className="px-6">
              <div className="grid grid-cols-2 gap-6">
                {apps.map((app) => (
                  <Link href={`/apps/${app.id}`} key={app.id}>
                    <motion.div whileHover={{ y: -10 }} className="poster-card group">
                      <img src={app.icon_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={app.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-5 flex flex-col justify-end">
                         <div className="bg-blue-600 w-fit px-2 py-0.5 rounded-lg text-[8px] font-black uppercase mb-2">NEW</div>
                         <h3 className="font-black text-[16px] truncate uppercase leading-none mb-2">{app.title}</h3>
                         <div className="flex items-center justify-between">
                            <span className="text-[12px] font-bold text-blue-400 tracking-tighter">{app.price}</span>
                            <div className="flex items-center gap-1">
                               <Star size={10} className="fill-orange-400 text-orange-400"/>
                               <span className="text-[10px] font-bold text-gray-300">4.9</span>
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* LIST VIEW (Teesri Screen ka look) */}
              <div className="mt-14 pb-10">
                 <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8 border-l-4 border-blue-600 pl-4">Top this year</h3>
                 <div className="space-y-4">
                    {apps.slice(0, 3).map(app => (
                      <div key={app.id} className="bg-white/[0.03] p-5 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                         <div className="flex items-center gap-4">
                            <img src={app.icon_url} className="w-16 h-16 rounded-2xl object-cover shadow-2xl border border-white/10" alt="" />
                            <div>
                               <h4 className="font-black text-[14px] uppercase italic tracking-tight">{app.title}</h4>
                               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{app.category}</p>
                               <div className="flex items-center gap-1 mt-1 opacity-50">
                                  <Star size={8} className="fill-orange-400 text-orange-400"/>
                                  <span className="text-[8px] font-bold">4.8</span>
                               </div>
                            </div>
                         </div>
                         <Link href={`/apps/${app.id}`}>
                           <button className="bg-white/5 text-white border border-white/10 px-8 py-2.5 rounded-full text-[10px] font-black uppercase hover:bg-blue-600 hover:border-blue-600 transition-all shadow-xl">Play</button>
                         </Link>
                      </div>
                    ))}
                 </div>
              </div>
            </main>

            {/* --- THE EXACT SPATIAL BOTTOM NAV --- */}
            <div className="spatial-nav">
               <button className="text-gray-500"><LayoutGrid size={24}/></button>
               <button className="text-gray-500"><Search size={24}/></button>
               <button className="nav-item-active"><HomeIcon size={24}/></button>
               <button className="text-gray-500"><Heart size={24}/></button>
               <button className="text-gray-500"><MessageSquare size={24}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Chota function for Chevron
function ChevronLeft({size}) {
  return <Star size={size} className="-rotate-90"/> // Placeholder if lucide not updated
}