"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home as HomeIcon, Gamepad2, LayoutGrid, HelpCircle, Search, X, Globe, Star, 
  Flame, CheckCircle, Clock, ArrowDownToLine, Smartphone, Zap, Mail, ShieldCheck, 
  Instagram, Music, PenTool, Image as ImageIcon, BellRing, DownloadCloud, ArrowUp
} from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
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
  const [activeTab, setActiveTab] = useState('Home')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const { data: a } = await supabase.from('apps').select('*').order('created_at', { ascending: false })
      const { data: s } = await supabase.from('featured_slides').select('*').order('id', { ascending: false })
      const { data: art } = await supabase.from('articles').select('*').order('created_at', { ascending: false }).limit(6)
      const { data: r } = await supabase.from('requests').select('*').order('created_at', { ascending: false }).limit(6)
      if (a) setApps(a); if (s) setSlides(s); if (art) setArticles(art); if (r) setUserRequests(r);
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const filtered = apps.filter(app => app.title.toLowerCase().includes(searchTerm.toLowerCase()))
  const trending = filtered.filter(a => (a.category === 'App' || a.category === 'Programs')).slice(0, 8)
  const gaming = filtered.filter(a => a.category === 'Game').slice(0, 8)

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] transition-colors duration-300 font-sans pb-20">
      <Navbar onSearch={setSearchTerm} />
      
      <main className="pt-16">
        <HeroSlider slides={slides} />

        <div className="max-w-7xl mx-auto px-6 space-y-24 py-20 relative z-10">
          
          {/* TRENDING */}
          <section id="apps">
            <div className="flex items-center justify-between mb-10 border-l-4 border-orange-500 pl-6">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-orange-500 leading-none">
                <Flame className="animate-pulse" /> Trending Now
              </h2>
              <Link href="/apps/all" className="text-[10px] font-bold uppercase text-gray-500 hover:text-orange-500 px-4 py-2 rounded-full border dark:border-white/5 transition-all">Show More</Link>
            </div>
            <AppSlider apps={trending} loading={loading} />
          </section>

          {/* LATEST */}
          <section>
            <div className="flex items-center justify-between mb-10 border-l-4 border-[#2ea64d] pl-6 leading-none">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-[#2ea64d]">
                <Zap /> Latest Orbit Sync
              </h2>
            </div>
            <AppSlider apps={filtered.slice(0, 8)} loading={loading} />
          </section>

          {/* GAMING */}
          <section id="games">
            <div className="flex items-center justify-between mb-10 border-l-4 border-blue-500 pl-6 leading-none">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2 text-blue-500">
                <Trophy size={24} /> Pro Gaming
              </h2>
              <Link href="/apps/all" className="text-[10px] font-bold uppercase text-gray-500 hover:text-blue-500 px-4 py-2 rounded-full border dark:border-white/5 transition-all">Show More</Link>
            </div>
            <AppSlider apps={gaming} loading={loading} />
          </section>

          {/* BLOG SECTION */}
          <section>
            <h2 className="text-2xl font-black uppercase italic mb-12 border-l-4 border-orange-500 pl-4 dark:text-white">Orbit Tech Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map(art => (
                <Link key={art.id} href={`/blog/${art.slug}`} className="group bg-white dark:bg-[#111] p-4 rounded-3xl border dark:border-white/5 shadow-sm hover:shadow-xl transition-all">
                  <div className="w-full aspect-video rounded-2xl overflow-hidden mb-4 relative bg-black/20 flex items-center justify-center">
                    {art.image_url ? <img src={art.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" /> : <ImageIcon className="opacity-10" />}
                  </div>
                  <h3 className="text-lg font-black uppercase group-hover:text-[#2ea64d] leading-tight italic line-clamp-2 dark:text-white">{art.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function Trophy({size}) { return <Star size={size} className="text-blue-500" /> }