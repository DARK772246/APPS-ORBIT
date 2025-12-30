"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home as HomeIcon, 
  Gamepad2, 
  LayoutGrid, 
  HelpCircle, 
  Search, 
  X, 
  Globe, 
  Star, 
  Instagram, 
  Music, 
  Video,
  ShieldCheck,
  Zap,
  Mail
} from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function Home() {
  const [apps, setApps] = useState([])
  const [slides, setSlides] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('Home')
  const [mounted, setMounted] = useState(false)
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    setMounted(true)
    fetchData()
    // Load Wishlist from local storage
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setWishlist(saved)
    
    // Auto Slider Timer
    const timer = setInterval(() => {
      if (slides.length > 0) setCurrentSlide(s => (s + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  async function fetchData() {
    const { data: a } = await supabase.from('apps').select('*').order('created_at', { ascending: false })
    const { data: s } = await supabase.from('featured_slides').select('*').order('id', { ascending: false })
    if (a) { setApps(a); setFiltered(a); }
    if (s) setSlides(s)
    setLoading(false)
  }

  // Filtering Logic (Search + Tabs)
  useEffect(() => {
    let res = apps
    if (searchTerm) res = res.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()))
    if (activeTab === 'Games') res = res.filter(a => a.category === 'Game')
    if (activeTab === 'Programs') res = res.filter(a => a.category === 'App' || a.category === 'Tool')
    setFiltered(res)
  }, [searchTerm, activeTab, apps])

  const toggleWishlist = (e, id) => {
    e.preventDefault()
    let favs = JSON.parse(localStorage.getItem('wishlist') || '[]')
    if (favs.includes(id)) favs = favs.filter(i => i !== id)
    else favs.push(id)
    localStorage.setItem('wishlist', JSON.stringify(favs))
    setWishlist(favs)
  }

  if (!mounted) return <div className="min-h-screen bg-[#121212]" />

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] transition-colors duration-300 font-sans">
      
      {/* 1. TOP NAVBAR (AN1 Style) */}
      <nav className="bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-white/5 sticky top-0 z-[100] px-4 h-16 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#2ea64d] text-white px-2 py-1 rounded-lg font-black text-xl italic leading-none shadow-lg">SAO</div>
            <span className="font-black text-lg tracking-tighter uppercase hidden sm:block dark:text-white">Salman <span className="text-[#2ea64d]">AppOrbit</span></span>
          </Link>

          {/* Nav Icons */}
          <div className="hidden lg:flex items-center gap-8">
            {[ 
              {l:'Home', i:HomeIcon}, {l:'Games', i:Gamepad2}, {l:'Programs', i:LayoutGrid}, {l:'FAQ', i:HelpCircle} 
            ].map(t => (
              <button key={t.l} onClick={() => setActiveTab(t.l)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === t.l ? 'text-[#2ea64d]' : 'text-gray-400 hover:text-[#2ea64d]'}`}>
                <t.i size={18}/><span className="text-[10px] font-bold uppercase tracking-widest">{t.l}</span>
                {activeTab === t.l && <motion.div layoutId="nav-line" className="h-0.5 w-full bg-[#2ea64d] mt-1" />}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Search className="text-gray-400 cursor-pointer hover:text-[#2ea64d]" onClick={() => setSearchOpen(!searchOpen)}/>
            <Link href="/wishlist" className="relative p-1">
              <span className="text-gray-400 hover:text-red-500 transition-colors">❤️</span>
              {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-bounce">{wishlist.length}</span>}
            </Link>
            <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full border dark:border-white/10 text-[10px] font-bold uppercase text-gray-500"><Globe size={12} className="text-[#2ea64d]"/> English (PK)</div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className="absolute top-16 left-0 right-0 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-white/10 p-4 z-50 overflow-hidden shadow-2xl">
              <div className="max-w-3xl mx-auto relative">
                <input autoFocus type="text" placeholder="Search premium programs..." className="w-full bg-gray-100 dark:bg-black/40 p-4 rounded-xl outline-none text-sm ring-1 ring-gray-200 dark:ring-white/10 focus:ring-[#2ea64d] transition-all dark:text-white" onChange={e => setSearchTerm(e.target.value)} />
                <X className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-red-500" onClick={() => setSearchOpen(false)}/>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. AUTO-SLIDING SPLIT HERO */}
      {slides.length > 0 && (
        <div className="relative h-[320px] md:h-[450px] overflow-hidden bg-[#1e1e1e]">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlide} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.8}} className={`absolute inset-0 flex flex-col md:flex-row items-center ${slides[currentSlide].bg_color || 'bg-[#2ea64d]'}`}>
               <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-10 md:px-24 text-white z-10">
                  <motion.h2 initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="text-3xl md:text-5xl font-black mb-4 uppercase italic tracking-tighter leading-tight">{slides[currentSlide].title}</motion.h2>
                  <p className="text-white/80 text-sm mb-8 line-clamp-3 italic font-medium">"{slides[currentSlide].description}"</p>
                  <Link href={slides[currentSlide].button_link || '#'} className="bg-white text-black dark:bg-white dark:text-black px-10 py-3 rounded-full text-xs font-black uppercase w-fit hover:scale-105 transition-all shadow-xl">Explore Now</Link>
               </div>
               <div className="hidden md:block w-1/2 h-full relative">
                  <img src={slides[currentSlide].image_url} className="w-full h-full object-cover" alt="Slide" />
                  <div className={`absolute inset-0 bg-gradient-to-r from-current to-transparent opacity-40 ${slides[currentSlide].bg_color}`}></div>
               </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-6 left-10 md:left-24 z-20 flex gap-2">
            {slides.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${currentSlide === i ? 'w-8 bg-white shadow-lg' : 'w-2 bg-white/30'}`} />
            ))}
          </div>
        </div>
      )}

      {/* 3. 1-2-3 DOWNLOAD GUIDE SECTION */}
      <section className="max-w-7xl mx-auto px-4 mt-12 mb-16">
        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] flex flex-wrap items-center justify-around gap-6 shadow-sm">
           {[ {s:1, t:'Select Pro App'}, {s:2, t:'Wait for Scan'}, {s:3, t:'Secure Link Ready'} ].map(step => (
             <div key={step.s} className="flex items-center gap-3 group">
                <span className="bg-[#2ea64d]/10 text-[#2ea64d] w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm group-hover:bg-[#2ea64d] group-hover:text-white transition-all shadow-inner">{step.s}</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 italic">{step.t}</p>
             </div>
           ))}
        </div>
      </section>

      {/* 4. MAIN APP CATALOG GRID (6 Columns) */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex justify-between items-center mb-12 border-l-4 border-[#2ea64d] pl-4">
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter leading-none">
              {activeTab === 'Home' ? 'LATEST PROGRAM UPDATES' : `${activeTab.toUpperCase()} CATALOG`}
            </h2>
            <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-widest italic">Verified by Salman Khan Intelligence</p>
          </div>
          <div className="flex gap-4">
             <a href="https://www.instagram.com/salman_orakxi/" target="_blank" className="text-gray-400 hover:text-pink-500 transition-colors"><Instagram size={18}/></a>
             <a href="https://www.tiktok.com/@hba013" target="_blank" className="text-gray-400 hover:text-white dark:hover:text-white transition-colors"><Music size={18}/></a>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400 font-bold animate-pulse tracking-[0.5em] uppercase text-xs">Orbiting Assets...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filtered.map(app => (
              <div key={app.id} className="an1-card group p-3 flex flex-col items-center bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-100 dark:border-white/5 transition-all relative overflow-hidden shadow-sm hover:shadow-xl">
                
                {/* Wishlist Toggle */}
                <button onClick={(e) => toggleWishlist(e, app.id)} className="absolute top-4 right-4 z-20 text-xs hover:scale-125 transition-transform drop-shadow-md">
                   {wishlist.includes(app.id) ? '❤️' : '🤍'}
                </button>

                <Link href={`/apps/${app.id}`} className="w-full flex flex-col items-center">
                  <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-sm border border-gray-100 dark:border-white/10 relative bg-gray-50 dark:bg-black/20">
                    <img src={app.icon_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={app.title} />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-white text-[7px] font-black px-2 py-0.5 rounded uppercase">Verified</div>
                  </div>
                  
                  <h3 className="text-[12px] font-bold truncate w-full text-center uppercase group-hover:text-[#2ea64d] transition-colors mb-1 dark:text-gray-200">{app.title}</h3>
                  <div className="flex items-center gap-1 mb-3">
                     <Star size={10} className="text-[#2ea64d] fill-[#2ea64d]"/>
                     <span className="text-[9px] font-bold text-[#2ea64d]">4.9 Rating</span>
                  </div>

                  <div className="mt-auto w-full">
                    <p className="text-[10px] font-black text-[#2ea64d] mb-2 text-center uppercase tracking-tighter">{app.is_free ? 'FREE VERSION' : app.price}</p>
                    <button className="w-full bg-[#2ea64d] hover:bg-[#268a40] text-white text-[10px] font-black py-2.5 rounded-xl uppercase tracking-tighter transition-colors shadow-sm active:scale-95">Download</button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* --- AD-FRIENDLY AUTHORITY SECTION (For AdSense) --- */}
        <section className="mt-32 pt-20 border-t border-gray-200 dark:border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* FAQ Area */}
            <div>
              <h2 className="text-2xl font-black uppercase italic mb-10 border-l-4 border-[#2ea64d] pl-4 italic">Common FAQ's</h2>
              <div className="space-y-6">
                {[
                  { q: "Is Salman AppOrbit safe for Android?", a: "Every pro utility on our platform is manually verified and scanned through physical devices by Salman Khan." },
                  { q: "How do I get premium updates?", a: "Once you have access, you can visit the store page for the latest version. We provide lifetime support for our community." },
                  { q: "Why use Salman AppOrbit?", a: "We offer high-quality, ad-free and optimized programs at a fraction of the market cost." }
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-[#111] p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
                    <h4 className="font-black text-sm mb-2 text-[#2ea64d] uppercase italic flex items-center gap-2"><ShieldCheck size={16}/> {item.q}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed italic font-serif">"{item.a}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Blog/Insights Area */}
            <div>
              <h2 className="text-2xl font-black uppercase italic mb-10 border-l-4 border-blue-500 pl-4 italic">Orbit Tech Insights</h2>
              <div className="space-y-8">
                <div className="group cursor-pointer">
                  <div className="flex items-center gap-3 text-blue-500 mb-2">
                    <Zap size={14} className="animate-pulse"/>
                    <span className="text-[10px] font-black uppercase tracking-widest">Industry Insight • 2026</span>
                  </div>
                  <h4 className="text-lg font-black group-hover:text-[#2ea64d] transition-colors leading-tight uppercase tracking-tighter italic italic">The Evolution of Premium Mobile Optimization</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed italic font-serif">Mobile tools are now more powerful than ever. Salman Khan explores how optimized programs are helping content creators in Pakistan save thousands...</p>
                </div>

                <div className="h-px bg-gray-200 dark:bg-white/10 w-full"></div>

                {/* Newsletter */}
                <div className="p-8 bg-[#2ea64d]/5 border border-[#2ea64d]/20 rounded-[2.5rem] text-center shadow-inner">
                  <div className="w-12 h-12 bg-[#2ea64d] text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                     <Mail size={24}/>
                  </div>
                  <h4 className="text-sm font-black uppercase mb-2 italic italic">Subscribe to the Orbit</h4>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-6 uppercase font-bold tracking-widest">Get Real-time alerts for Pro App updates</p>
                  <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                    <input type="email" placeholder="Your Email Address" className="flex-1 bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-3.5 rounded-xl text-xs outline-none focus:ring-2 ring-[#2ea64d] transition-all" />
                    <button className="bg-[#2ea64d] hover:bg-[#268a40] text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase shadow-lg transition-all active:scale-95">Join</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

    </div>
  )
}