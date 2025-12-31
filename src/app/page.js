"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home as HomeIcon, Gamepad2, LayoutGrid, HelpCircle, Search, X, Globe, Star, 
  Flame, CheckCircle, Clock, Smartphone, Zap, Mail, ShieldCheck, Instagram, Music, PenTool, Image as ImageIcon 
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
      const { data: art } = await supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(3)
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

  if (!mounted) return <div className="min-h-screen bg-[#121212]" />

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] transition-colors duration-300 font-sans pb-20">
      {/* NAVBAR */}
      <nav className="bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-white/5 sticky top-0 z-[100] px-4 h-16 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#2ea64d] text-white px-2 py-1 rounded-lg font-black text-xl italic shadow-lg">SAO</div>
            <span className="font-black text-lg tracking-tighter uppercase hidden sm:block dark:text-white">Salman <span className="text-[#2ea64d]">AppOrbit</span></span>
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-gray-400">
            {[ {l:'Home', i:HomeIcon}, {l:'Games', i:Gamepad2}, {l:'Programs', i:LayoutGrid}, {l:'FAQ', i:HelpCircle} ].map(t => (
              <button key={t.l} onClick={() => setActiveTab(t.l)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === t.l ? 'text-[#2ea64d]' : 'hover:text-[#2ea64d]'}`}>
                <t.i size={18}/><span className="text-[10px] font-bold uppercase">{t.l}</span>
                {activeTab === t.l && <motion.div layoutId="navline" className="h-0.5 w-full bg-[#2ea64d] mt-1" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle /><Search className="text-gray-400 cursor-pointer hover:text-[#2ea64d]" onClick={() => setSearchOpen(!searchOpen)}/>
            <Link href="/wishlist" className="relative p-1">
              <span className="text-gray-400 hover:text-red-500 transition-colors">❤️</span>
              {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>}
            </Link>
          </div>
        </div>
      </nav>

      {/* AUTO SLIDER */}
      {slides.length > 0 && (
        <div className="relative h-[320px] md:h-[450px] overflow-hidden bg-[#1e1e1e]">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlide} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.8}} className={`absolute inset-0 flex flex-col md:flex-row items-center ${slides[currentSlide].bg_color}`}>
               <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-10 md:px-24 text-white z-10">
                  <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase italic tracking-tighter leading-tight">{slides[currentSlide].title}</h2>
                  <p className="text-white/80 text-sm mb-8 line-clamp-3 italic">"{slides[currentSlide].description}"</p>
                  <Link href={slides[currentSlide].button_link || '#'} className="bg-white text-black px-10 py-3 rounded-full text-xs font-black uppercase w-fit hover:scale-105 transition-all">Explore</Link>
               </div>
               <div className="hidden md:block w-1/2 h-full relative">
                  {slides[currentSlide].image_url && <img src={slides[currentSlide].image_url} className="w-full h-full object-cover opacity-60" alt="" />}
                  <div className={`absolute inset-0 bg-gradient-to-r from-black/40 to-transparent`}></div>
               </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-6 left-10 md:left-24 z-20 flex gap-2">
            {slides.map((_, i) => (<div key={i} className={`h-1 rounded-full transition-all ${currentSlide === i ? 'w-10 bg-[#2ea64d]' : 'w-2 bg-white/20'}`} />))}
          </div>
        </div>
      )}

      {/* GRID */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-lg font-black uppercase mb-10 border-l-4 border-[#2ea64d] pl-4 italic dark:text-white">{activeTab} Galaxy</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-20">
          {filtered.map(app => {
            const isNew = (new Date() - new Date(app.updated_at)) / (1000 * 60 * 60) < 48;
            return (
              <div key={app.id} className="an1-card group p-3 bg-white dark:bg-[#1e1e1e] rounded-2xl border dark:border-white/5 relative overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
                  {isNew && <span className="bg-blue-600 text-white text-[7px] font-black px-2 py-1 rounded shadow-lg uppercase animate-pulse">Update 🚀</span>}
                </div>
                <Link href={`/apps/${app.id}`} className="w-full">
                  <div className="w-full aspect-square rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-black/20 border border-gray-100 dark:border-white/5">
                    {app.icon_url && <img src={app.icon_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" loading="lazy" />}
                  </div>
                  <h3 className="text-[12px] font-bold truncate w-full text-center uppercase dark:text-gray-100 text-gray-800">{app.title}</h3>
                  <button className="w-full bg-[#2ea64d] hover:bg-[#268a40] text-white text-[10px] font-black py-2 rounded-lg uppercase mt-2">Get</button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* BLOG FEED */}
        <section>
          <h2 className="text-2xl font-black uppercase italic mb-10 border-l-4 border-orange-500 pl-4 dark:text-white text-gray-800">Orbit Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map(art => (
              <Link key={art.id} href={`/blog/${art.slug}`} className="group bg-white dark:bg-[#111] p-3 rounded-[2.5rem] border dark:border-white/5 shadow-sm hover:shadow-xl transition-all">
                <div className="w-full aspect-video rounded-3xl overflow-hidden mb-4 relative bg-gray-100 dark:bg-black/40 border dark:border-white/5 flex items-center justify-center">
                  {art.image_url ? <img src={art.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" /> : <ImageIcon size={40} className="opacity-20"/>}
                </div>
                <div className="p-2"><h3 className="text-[15px] font-black uppercase group-hover:text-[#2ea64d] line-clamp-2 italic">{art.title}</h3></div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}