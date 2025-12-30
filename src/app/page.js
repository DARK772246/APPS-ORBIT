"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home as HomeIcon, Gamepad2, LayoutGrid, HelpCircle, Search, X, Globe, Star, 
  Flame, CheckCircle, Clock, ArrowDownToLine, Settings, Smartphone, Zap, Mail, ShieldCheck,
  Instagram, Music
} from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function Home() {
  const [apps, setApps] = useState([])
  const [slides, setSlides] = useState([])
  const [userRequests, setUserRequests] = useState([])
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
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setWishlist(saved)
    
    const timer = setInterval(() => {
      if (slides.length > 0) setCurrentSlide(s => (s + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  async function fetchData() {
    const { data: a } = await supabase.from('apps').select('*').order('created_at', { ascending: false })
    const { data: s } = await supabase.from('featured_slides').select('*').order('id', { ascending: false })
    const { data: r } = await supabase.from('requests').select('*').order('created_at', { ascending: false }).limit(6)
    
    if (a) { setApps(a); setFiltered(a); }
    if (s) setSlides(s)
    if (r) setUserRequests(r)
    setLoading(false)
  }

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
      
      {/* 1. NAVBAR */}
      <nav className="bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-white/5 sticky top-0 z-[100] px-4 h-16 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#2ea64d] text-white px-2 py-1 rounded-lg font-black text-xl italic shadow-lg">SAO</div>
            <span className="font-black text-lg tracking-tighter uppercase hidden sm:block dark:text-white">Salman <span className="text-[#2ea64d]">AppOrbit</span></span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {[ {l:'Home', i:HomeIcon}, {l:'Games', i:Gamepad2}, {l:'Programs', i:LayoutGrid}, {l:'FAQ', i:HelpCircle} ].map(t => (
              <button key={t.l} onClick={() => setActiveTab(t.l)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === t.l ? 'text-[#2ea64d]' : 'text-gray-400 hover:text-[#2ea64d]'}`}>
                <t.i size={18}/><span className="text-[10px] font-bold uppercase tracking-widest">{t.l}</span>
                {activeTab === t.l && <motion.div layoutId="navline" className="h-0.5 w-full bg-[#2ea64d] mt-1" />}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Search className="text-gray-400 cursor-pointer hover:text-[#2ea64d]" onClick={() => setSearchOpen(!searchOpen)}/>
            <Link href="/wishlist" className="relative p-1">
              <span className="text-gray-400 hover:text-red-500 transition-colors">❤️</span>
              {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>}
            </Link>
            <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full border dark:border-white/10 text-[10px] font-bold uppercase text-gray-500"><Globe size={12} className="text-[#2ea64d]"/> English</div>
          </div>
        </div>
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className="absolute top-16 left-0 right-0 bg-white dark:bg-[#1e1e1e] border-b dark:border-white/10 p-4 z-50 overflow-hidden shadow-2xl">
              <input autoFocus type="text" placeholder="Search Orbit..." className="w-full bg-gray-100 dark:bg-black/40 p-4 rounded-xl outline-none text-sm ring-1 ring-gray-200 dark:ring-white/10 focus:ring-[#2ea64d] dark:text-white" onChange={e => setSearchTerm(e.target.value)} />
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. AUTO SLIDER */}
      {slides.length > 0 && (
        <div className="relative h-[320px] md:h-[420px] overflow-hidden bg-[#1e1e1e]">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlide} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className={`absolute inset-0 flex flex-col md:flex-row items-center ${slides[currentSlide].bg_color}`}>
               <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-10 md:px-24 text-white z-10">
                  <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase italic tracking-tighter leading-tight">{slides[currentSlide].title}</h2>
                  <p className="text-white/80 text-sm mb-8 line-clamp-3 font-medium italic">"{slides[currentSlide].description}"</p>
                  <Link href={slides[currentSlide].button_link || '#'} className="bg-white text-black px-10 py-3 rounded-full text-xs font-black uppercase w-fit hover:scale-105 transition-all shadow-xl">Explore Now</Link>
               </div>
               <div className="hidden md:block w-1/2 h-full relative">
                  <img src={slides[currentSlide].image_url} className="w-full h-full object-cover opacity-60" />
                  <div className={`absolute inset-0 bg-gradient-to-r from-black/40 to-transparent`}></div>
               </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* 3. DOWNLOAD GUIDE */}
      <section className="max-w-7xl mx-auto px-4 mt-12 mb-16">
        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] flex flex-wrap items-center justify-around gap-6 shadow-sm">
           {[ {s:1, t:'Select App'}, {s:2, t:'Wait 10s Scan'}, {s:3, t:'Install Pro'} ].map(step => (
             <div key={step.s} className="flex items-center gap-3">
                <span className="bg-[#2ea64d]/10 text-[#2ea64d] w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm">{step.s}</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">{step.t}</p>
             </div>
           ))}
        </div>
      </section>

      {/* 4. APP GRID */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex justify-between items-center mb-10 border-l-4 border-[#2ea64d] pl-4">
          <h2 className="text-xl font-black uppercase italic tracking-tighter">{activeTab} Galaxy</h2>
          <div className="flex gap-4">
             <a href="https://www.instagram.com/salman_orakxi/" target="_blank" className="text-gray-400 hover:text-pink-500 transition-colors"><Instagram size={18}/></a>
             <a href="https://www.tiktok.com/@hba013" target="_blank" className="text-gray-400 hover:text-[#2ea64d] transition-colors"><Music size={18}/></a>
          </div>
        </div>

        {loading ? <div className="text-center py-20 text-gray-500 animate-pulse uppercase tracking-widest">Orbiting...</div> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filtered.map(app => {
              // NEW UPDATE LOGIC (Last 48 Hours)
              const isNewUpdate = (new Date() - new Date(app.updated_at)) / (1000 * 60 * 60) < 48;
              
              return (
                <div key={app.id} className="an1-card group p-3 flex flex-col items-center bg-white dark:bg-[#1e1e1e] rounded-2xl border dark:border-white/5 transition-all relative overflow-hidden shadow-sm hover:shadow-xl">
                  {/* BADGES */}
                  <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                    {isNewUpdate && <span className="bg-blue-600 text-white text-[7px] font-black px-2 py-1 rounded shadow-lg uppercase animate-pulse">New Update 🚀</span>}
                    {app.downloads > 100 && <span className="bg-orange-500 text-white text-[7px] font-black px-2 py-1 rounded shadow-lg uppercase flex items-center gap-1"><Flame size={8}/> Hot</span>}
                  </div>

                  <button onClick={(e) => toggleWishlist(e, app.id)} className="absolute top-2 right-2 z-20 text-xs">{wishlist.includes(app.id) ? '❤️' : '🤍'}</button>

                  <Link href={`/apps/${app.id}`} className="w-full">
                    <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5">
                      <img src={app.icon_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={app.title} />
                    </div>
                    <h3 className="text-[12px] font-bold truncate w-full text-center uppercase mb-1 dark:text-gray-100">{app.title}</h3>
                    <div className="flex items-center justify-center gap-1 mb-3">
                       <Star size={10} className="text-[#2ea64d] fill-[#2ea64d]"/><span className="text-[9px] font-bold text-[#2ea64d]">4.9</span>
                    </div>
                    <button className="w-full bg-[#2ea64d] text-white text-[10px] font-black py-2 rounded-lg uppercase tracking-tighter hover:bg-[#268a40] transition-colors">Download</button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. REQUEST STATUS SECTION */}
        <section className="mt-32">
          <div className="bg-white dark:bg-[#111] rounded-[2.5rem] p-10 border border-gray-100 dark:border-white/5">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-10 border-l-4 border-blue-500 pl-4">Community Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {userRequests.map((req, i) => (
                 <div key={i} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-black/30 rounded-2xl border border-gray-100 dark:border-white/5">
                    <div>
                       <p className="text-[11px] font-black uppercase dark:text-white truncate max-w-[120px]">{req.app_name}</p>
                       <p className="text-[8px] text-gray-400 uppercase font-bold mt-1">Status: {req.status || 'Searching'}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${req.status?.toLowerCase().includes('added') ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`} />
                 </div>
               ))}
            </div>
            <Link href="/request" className="block text-center mt-10 text-[10px] font-black uppercase text-[#2ea64d] underline tracking-widest">Submit your own request +</Link>
          </div>
        </section>

        {/* 6. AUTHORITY & SEO SECTION */}
        <section className="mt-32 pt-20 border-t dark:border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-xl font-black uppercase italic mb-8 tracking-widest text-[#2ea64d]">Verified FAQ</h2>
              <div className="space-y-4">
                {[
                  { q: "Is Salman AppOrbit safe?", a: "Every program is manually scanned on physical Android devices by Salman Khan." },
                  { q: "How to update?", a: "Check the 'New Update' badge on the home screen to get the latest optimized version." }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <h4 className="font-black text-xs mb-2 uppercase text-[#2ea64d]">Q: {item.q}</h4>
                    <p className="text-xs text-gray-500 italic">"{item.a}"</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#2ea64d]/5 p-10 rounded-[3rem] border border-[#2ea64d]/20 text-center flex flex-col justify-center shadow-inner">
               <ShieldCheck className="mx-auto mb-4 text-[#2ea64d]" size={40}/>
               <h3 className="font-black uppercase italic mb-2 tracking-tighter">Verified Security</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed italic">"Our mission is to provide Pakistan with a secure ecosystem for premium Android software. Your digital safety is our priority." - Salman Khan</p>
            </div>
        </section>
      </main>
    </div>
  )
}