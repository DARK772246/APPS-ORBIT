"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home as HomeIcon, Gamepad2, LayoutGrid, HelpCircle, Search, X, Globe, Star, 
  Flame, Zap, ShieldCheck, Instagram, Music, Video, BellRing, PenTool, Image as ImageIcon 
} from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export default function Home() {
  const [apps, setApps] = useState([])
  const [slides, setSlides] = useState([])
  const [articles, setArticles] = useState([])
  const [userRequests, setUserRequests] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('Home')
  const [wishlist, setWishlist] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchData()
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setWishlist(saved)
    const timer = setInterval(() => { if (slides.length > 0) setCurrentSlide(s => (s + 1) % slides.length) }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  async function fetchData() {
    try {
      const { data: a } = await supabase.from('apps').select('*').order('created_at', { ascending: false })
      const { data: s } = await supabase.from('featured_slides').select('*').order('id', { ascending: false })
      const { data: art } = await supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(6)
      const { data: r } = await supabase.from('requests').select('*').order('created_at', { ascending: false }).limit(6)
      
      if (a) { setApps(a); setFiltered(a); }
      if (s) setSlides(s)
      if (art) setArticles(art)
      if (r) setUserRequests(r)
    } catch (err) { console.error(err) }
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

  if (!mounted) return <div className="min-h-screen bg-[#0a0a0a]" />

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] transition-colors duration-300 font-sans pb-20">
      
      {/* 1. ONE-LINE NEWS TICKER */}
      <div className="bg-[#2ea64d] text-white py-2.5 overflow-hidden relative z-[110] border-b border-white/10 shadow-lg">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-6 px-4">
            <BellRing size={12}/> {apps[0]?.title || 'System'} Update Live! 🚀 • Safe Premium Programs Verified by Salman Khan • Free Mods Available • 
            <Zap size={12}/> Join Salman AppOrbit Galaxy • 100% Virus-Free Secure Server • New Tech Insight: {articles[0]?.title || 'Orbit News'} • 
            <BellRing size={12}/> {apps[0]?.title || 'System'} Update Live! 🚀 • Safe Premium Programs Verified by Salman Khan • Free Mods Available • 
          </span>
        </div>
      </div>

      {/* 2. NAVBAR */}
      <nav className="bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-white/5 sticky top-0 z-[100] px-4 h-16 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#2ea64d] text-white px-2 py-1 rounded-lg font-black text-xl italic shadow-lg">SAO</div>
            <span className="font-black text-lg tracking-tighter uppercase hidden sm:block dark:text-white text-gray-800 italic">Salman <span className="text-[#2ea64d]">AppOrbit</span></span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-gray-400">
            {[ {l:'Home', i:HomeIcon}, {l:'Games', i:Gamepad2}, {l:'Programs', i:LayoutGrid}, {l:'FAQ', i:HelpCircle} ].map(t => (
              <button key={t.l} onClick={() => setActiveTab(t.l)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === t.l ? 'text-[#2ea64d]' : 'hover:text-[#2ea64d]'}`}>
                <t.i size={18}/><span className="text-[10px] font-bold uppercase tracking-widest">{t.l}</span>
                {activeTab === t.l && <motion.div layoutId="navline" className="h-0.5 w-full bg-[#2ea64d] mt-1" />}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Search className="text-gray-400 cursor-pointer hover:text-[#2ea64d]" onClick={() => setSearchOpen(!searchOpen)}/>
            <Link href="/wishlist" className="relative p-1">❤️{wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-lg">{wishlist.length}</span>}</Link>
          </div>
        </div>
      </nav>

      {/* SEARCH OVERLAY */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className="fixed top-16 left-0 right-0 bg-white dark:bg-[#1e1e1e] border-b dark:border-white/10 p-4 z-50 overflow-hidden shadow-2xl">
            <input autoFocus type="text" placeholder="Search premium programs..." className="w-full bg-gray-100 dark:bg-black/40 p-4 rounded-xl outline-none text-sm ring-1 ring-[#2ea64d] dark:text-white font-bold" onChange={e => setSearchTerm(e.target.value)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. HERO SLIDER */}
      {slides.length > 0 && (
        <div className="relative h-[320px] md:h-[450px] overflow-hidden bg-[#1e1e1e]">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlide} initial={{opacity:0, x:30}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-30}} transition={{duration:0.8}} className={`absolute inset-0 flex flex-col md:flex-row items-center ${slides[currentSlide].bg_color}`}>
               <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-10 md:px-24 text-white z-10">
                  <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase italic tracking-tighter leading-tight">{slides[currentSlide].title}</h2>
                  <p className="text-white/80 text-sm mb-8 line-clamp-3 italic">"{slides[currentSlide].description}"</p>
                  <Link href={slides[currentSlide].button_link || '#'} className="bg-white text-black px-10 py-3 rounded-full text-xs font-black uppercase w-fit hover:scale-105 transition-all shadow-xl">Explore Now</Link>
               </div>
               <div className="hidden md:block w-1/2 h-full relative">
                  {slides[currentSlide].image_url && <img src={slides[currentSlide].image_url} className="w-full h-full object-cover opacity-60" alt="" />}
                  <div className={`absolute inset-0 bg-gradient-to-r from-black/40 to-transparent`}></div>
               </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* 4. MAIN CATALOG */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-10 border-l-4 border-[#2ea64d] pl-4">
           <h2 className="text-xl font-black uppercase italic tracking-tighter dark:text-white text-gray-800">{activeTab} Galaxy</h2>
        </div>

        {loading ? <div className="py-20 text-center text-gray-500 animate-pulse uppercase font-black tracking-widest text-xs">Syncing Orbit...</div> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-20">
            {filtered.map(app => {
              const isNewUpdate = (new Date() - new Date(app.updated_at)) / (1000 * 60 * 60) < 48;
              return (
                <div key={app.id} className="an1-card group p-3 flex flex-col items-center bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-100 dark:border-white/5 transition-all relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1">
                  <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                    {isNewUpdate && <span className="bg-blue-600 text-white text-[7px] font-black px-2 py-1 rounded shadow-lg uppercase animate-pulse italic">Updated</span>}
                    {app.downloads > 50 && <span className="bg-orange-500 text-white text-[7px] font-black px-2 py-1 rounded shadow-lg uppercase flex items-center gap-1"><Flame size={8}/> Hot</span>}
                  </div>
                  <button onClick={(e) => toggleWishlist(e, app.id)} className="absolute top-2 right-2 z-20 text-xs">{wishlist.includes(app.id) ? '❤️' : '🤍'}</button>
                  <Link href={`/apps/${app.id}`} className="w-full flex flex-col items-center">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100 dark:bg-black/20 border border-gray-100 dark:border-white/5 relative">
                      {app.icon_url && <img src={app.icon_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" loading="lazy" />}
                    </div>
                    <h3 className="text-[12px] font-bold truncate w-full text-center uppercase group-hover:text-[#2ea64d] transition-colors mb-1 dark:text-gray-100 text-gray-800">{app.title}</h3>
                    <div className="flex items-center gap-1 mb-3"><Star size={10} className="text-[#2ea64d] fill-[#2ea64d]"/><span className="text-[9px] font-bold text-[#2ea64d]">4.9</span></div>
                    <button className="w-full bg-[#2ea64d] text-white text-[10px] font-black py-2 rounded-lg uppercase transition-colors">Download</button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. USER REQUESTS TRACKER */}
        <section className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 mb-24 shadow-sm">
           <h2 className="text-xl font-black uppercase italic tracking-tighter mb-8 border-l-4 border-blue-500 pl-4 dark:text-white text-gray-800">Community Tracker</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 italic font-medium">
              {userRequests.map((req, i) => (
                <div key={i} className="p-5 bg-gray-50 dark:bg-black/30 rounded-2xl border dark:border-white/5 flex justify-between items-center transition-all hover:bg-white dark:hover:bg-black/50">
                   <div><p className="text-[11px] font-black uppercase dark:text-white truncate max-w-[150px]">{req.app_name}</p><p className="text-[8px] text-gray-400 uppercase font-bold mt-1">By: {req.user_name} • {req.status || 'Checking'}</p></div>
                   <div className={`w-2.5 h-2.5 rounded-full ${req.status?.toLowerCase().includes('added') ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`} />
                </div>
              ))}
           </div>
        </section>

        {/* 6. BLOG INSIGHTS FEED */}
        <section>
          <h2 className="text-2xl font-black uppercase italic mb-10 border-l-4 border-orange-500 pl-4 dark:text-white text-gray-800 italic">Orbit Tech Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map(art => (
              <Link key={art.id} href={`/blog/${art.slug}`} className="group bg-white dark:bg-[#111] p-3 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm transition-all hover:shadow-xl flex flex-col">
                <div className="w-full aspect-video rounded-3xl overflow-hidden mb-4 relative bg-black/20 border dark:border-white/5 flex items-center justify-center">
                  {art.image_url ? (
                    <img src={art.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                  ) : (
                    <ImageIcon size={40} className="opacity-10 text-gray-400" />
                  )}
                  <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-[7px] font-black px-2 py-0.5 rounded shadow-lg uppercase">Read Article</div>
                </div>
                <div className="px-2">
                  <p className="text-[9px] font-black text-orange-500 uppercase mb-2 flex items-center gap-1"><PenTool size={10}/> {art.author}</p>
                  <h3 className="text-[15px] font-black uppercase group-hover:text-[#2ea64d] line-clamp-2 italic">{art.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}