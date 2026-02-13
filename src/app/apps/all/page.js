"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home as HomeIcon, Gamepad2, LayoutGrid, HelpCircle, Search, X, Globe, Star, 
  Flame, CheckCircle, Clock, ArrowDownToLine, Smartphone, Zap, Mail, ShieldCheck, 
  Instagram, Music, PenTool, Image as ImageIcon, BellRing, DownloadCloud, ArrowUp, Trophy
} from 'lucide-react'
// ThemeToggle import removed
import Navbar from '../components/Navbar'
import HeroSlider from '../components/HeroSlider'
import AppSlider from '../components/AppSlider'

export default function Home() {
  const [apps, setApps] = useState([])
  const [slides, setSlides] = useState([])
  const [articles, setArticles] = useState([])
  const [userRequests, setUserRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [mounted, setMounted] = useState(false)
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    setMounted(true)
    fetchData()
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setWishlist(saved)
  }, [])

  async function fetchData() {
    try {
      const { data: a } = await supabase.from('apps').select('*').order('created_at', { ascending: false })
      const { data: s } = await supabase.from('featured_slides').select('*')
      const { data: art } = await supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(6)
      const { data: r } = await supabase.from('requests').select('*').order('created_at', { ascending: false }).limit(6)
      
      if (a) setApps(a);
      if (s) setSlides(s);
      if (art) setArticles(art);
      if (r) setUserRequests(r);
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  // --- FILTERING LOGIC ---
  const filteredApps = apps.filter(app => app.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const trending = filteredApps.filter(a => a.is_trending === true).slice(0, 8);
  const gaming = filteredApps.filter(a => a.is_pro_gaming === true).slice(0, 8);

  const toggleWishlist = (e, id) => {
    e.preventDefault()
    let favs = JSON.parse(localStorage.getItem('wishlist') || '[]')
    if (favs.includes(id)) favs = favs.filter(i => i !== id)
    else favs.push(id)
    localStorage.setItem('wishlist', JSON.stringify(favs))
    setWishlist(favs)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] transition-colors duration-300 font-sans pb-20">
      
      {/* 1. NAVBAR */}
      <Navbar onSearch={setSearchTerm} />
      
      <main className="pt-16">
        {/* 2. DYNAMIC SLIDER */}
        <HeroSlider slides={slides} />

        <div className="max-w-7xl mx-auto px-6 space-y-24 py-16 relative z-10">
          
          {/* 3. TRENDING SECTION */}
          <section id="apps">
            <div className="flex items-center justify-between mb-10 border-l-4 border-orange-500 pl-6">
              <div>
                <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-orange-500 leading-none">
                  <Flame className="animate-pulse" /> Trending Now
                </h2>
              </div>
              <Link href="/apps/all">
                <button className="text-[10px] font-black uppercase text-orange-500 border border-orange-500/20 px-6 py-2.5 rounded-full hover:bg-orange-500 hover:text-white transition-all shadow-lg active:scale-95 italic tracking-widest">
                  Show All Orbit
                </button>
              </Link>
            </div>
            <AppSlider apps={trending.length > 0 ? trending : filteredApps.slice(0,8)} loading={loading} />
          </section>

          {/* 4. LATEST SYNC SECTION */}
          <section id="latest">
            <div className="flex items-center justify-between mb-10 border-l-4 border-[#2ea64d] pl-6 leading-none">
              <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-[#2ea64d]">
                <Zap /> Latest Orbit Sync
              </h2>
            </div>
            <AppSlider apps={filteredApps.slice(0, 8)} loading={loading} />
          </section>

          {/* --- AD SLOT: Orbit_Homepage_Ad (ID: 7999676146) --- */}
          <div className="px-6 py-12">
            <div className="w-full mx-auto">
              <ins 
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-6036065566084740" 
                data-ad-slot="7999676146" 
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
              <script dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }} />
            </div>
          </div>
          {/* --- END AD SLOT --- */}

          {/* 5. PRO GAMING SECTION */}
          <section id="games">
            <div className="flex items-center justify-between mb-10 border-l-4 border-blue-500 pl-6 leading-none">
              <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-blue-500">
                <Trophy size={24} /> Pro Gaming
              </h2>
              <Link href="/apps/all">
                <button className="text-[10px] font-black uppercase text-blue-500 border border-blue-500/20 px-6 py-2.5 rounded-full hover:bg-blue-500 hover:text-white transition-all shadow-lg active:scale-95 italic tracking-widest">
                  View All Games
                </button>
              </Link>
            </div>
            {gaming.length > 0 ? (
               <AppSlider apps={gaming} loading={loading} />
            ) : (
               <div className="text-center py-10 text-gray-500 font-bold uppercase tracking-widest text-xs italic border border-dashed border-white/10 rounded-2xl">
                 No Pro Games Added Yet. Check Admin Panel.
               </div>
            )}
          </section>

          {/* 6. REQUEST STATUS */}
          <section className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 mb-24 shadow-sm">
             <h2 className="text-xl font-black uppercase italic tracking-tighter mb-8 border-l-4 border-blue-500 pl-4 dark:text-white leading-none">Community Tracker</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 italic font-medium">
                {userRequests.map((req, i) => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-black/30 rounded-2xl border dark:border-white/5 flex justify-between items-center italic transition-all hover:bg-white dark:hover:bg-black/50 shadow-sm">
                     <div><p className="text-[11px] font-black uppercase dark:text-white truncate max-w-[150px] italic">{req.app_name}</p><p className="text-[8px] text-gray-400 uppercase font-bold mt-1">Status: {req.status || 'Checking'}</p></div>
                     <div className={`w-2.5 h-2.5 rounded-full ${req.status?.toLowerCase().includes('added') ? 'bg-green-500 animate-pulse' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`} />
                  </div>
                ))}
             </div>
          </section>

          {/* 7. BLOG FEED */}
          <section>
            <h2 className="text-2xl font-black uppercase italic mb-10 border-l-4 border-orange-500 pl-4 dark:text-white text-gray-800 italic leading-none">Orbit Tech Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map(art => (
                <Link key={art.id} href={`/blog/${art.slug}`} className="group bg-white dark:bg-[#111] p-3 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all flex flex-col">
                  <div className="w-full aspect-video rounded-3xl overflow-hidden mb-4 relative bg-gray-100 dark:bg-black/20 border dark:border-white/5 flex items-center justify-center">
                    {art.image_url ? (
                      <img src={art.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={art.title} loading="lazy" />
                    ) : (
                      <ImageIcon size={40} className="opacity-10 text-gray-400" />
                    )}
                    <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-[7px] font-black px-3 py-1 rounded shadow-lg uppercase tracking-widest">Read Article</div>
                  </div>
                  <div className="p-2">
                    <p className="text-[9px] font-black text-orange-500 uppercase mb-2 flex items-center gap-1"><PenTool size={10}/> {art.author}</p>
                    <h3 className="text-[15px] font-black leading-tight uppercase group-hover:text-[#2ea64d] transition-colors line-clamp-2 italic dark:text-gray-100 text-gray-800 leading-none">{art.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* 8. SCROLL TO TOP */}
      <button 
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        className="fixed bottom-24 left-6 bg-white dark:bg-[#1e1e1e] p-3 rounded-full shadow-2xl border border-gray-200 dark:border-white/5 text-gray-500 hover:text-[#2ea64d] transition-all z-50 shadow-blue-500/10"
      >
        <ArrowUp size={20}/>
      </button>

    </div>
  )
}