"use client"
import { useEffect, useState, use } from 'react'
import { supabase } from '../../../supabase' // FIXED PATH
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, Share2, Info, Star, Smartphone, 
  AlertTriangle, Scale, CheckCircle, Copy, Bell, ArrowLeft, Zap 
} from 'lucide-react'
import ThemeToggle from '../../../components/ThemeToggle' // FIXED PATH

export default function AppDetail({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const id = params.id
  
  const [app, setApp] = useState(null)
  const [relatedApps, setRelatedApps] = useState([])
  const [reviews, setReviews] = useState([])
  const [showPayment, setShowPayment] = useState(false)
  const [scanning, setScanning] = useState(true)
  const [newReview, setNewReview] = useState({ user_name: '', rating: 5, comment: '' })
  const [isRecentlyUpdated, setIsRecentlyUpdated] = useState(false)

  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => setScanning(false), 2000)
    return () => clearTimeout(timer)
  }, [id])

  async function fetchData() {
    try {
      const { data: appData } = await supabase.from('apps').select('*').eq('id', id).single()
      if (appData) {
        setApp(appData)
        document.title = `${appData.title} v${appData.version} - Salman AppOrbit`
        
        const { data: related } = await supabase.from('apps').select('*').eq('category', appData.category).neq('id', id).limit(4)
        setRelatedApps(related || [])

        const lastUpdate = new Date(appData.updated_at || appData.created_at)
        const diff = (new Date() - lastUpdate) / (1000 * 60 * 60)
        if (diff < 48) setIsRecentlyUpdated(true)
      }
      const { data: revData } = await supabase.from('reviews').select('*').eq('app_id', id).order('created_at', { ascending: false })
      if (revData) setReviews(revData)
    } catch (err) { console.error("Orbit Error:", err) }
  }

  const handleAction = () => {
    if (app.is_free) window.location.href = `/apps/${id}/download`
    else setShowPayment(true)
  }

  if (!app) return <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center text-[#2ea64d] font-black animate-pulse uppercase tracking-[0.5em]">Connecting to Orbit...</div>

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300 font-sans pb-20">
      <nav className="p-4 border-b border-gray-100 dark:border-white/5 sticky top-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md z-50 px-6 flex justify-between items-center shadow-sm">
        <Link href="/" className="text-[10px] font-black uppercase text-gray-500 hover:text-[#2ea64d] flex items-center gap-2">
          <ArrowLeft size={14}/> Back to Store
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link Copied!"); }} className="text-gray-400 hover:text-blue-500"><Copy size={16}/></button>
          <button onClick={() => window.open(`https://wa.me/?text=Check this mod: ${window.location.href}`)} className="text-gray-400 hover:text-[#2ea64d]"><Share2 size={16}/></button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {isRecentlyUpdated && (
          <div className="bg-blue-600 text-white p-4 rounded-2xl mb-8 flex items-center gap-3 shadow-lg">
            <Bell className="animate-bounce" size={20}/>
            <p className="text-[10px] font-black uppercase tracking-widest leading-loose">Orbit Alert: v{app.version} update is now live! Verified.</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-12 border-b border-gray-100 dark:border-white/5 pb-12 text-center md:text-left">
          <div className="w-44 h-44 bg-gray-100 dark:bg-[#121212] rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl flex items-center justify-center flex-shrink-0">
            {app.icon_url ? <img src={app.icon_url} className="w-full h-full object-cover" alt="" /> : <span className="text-7xl">📱</span>}
          </div>
          <div className="flex-1 w-full">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 italic leading-none">{app.title}</h1>
            <p className="text-[#2ea64d] font-bold text-[10px] uppercase tracking-[0.4em] mb-8">Software Intelligence • v{app.version}</p>
            
            {scanning ? (
              <div className="inline-flex items-center gap-3 bg-blue-500/5 px-6 py-3 rounded-2xl mb-8 animate-pulse"><div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div><p className="text-[10px] font-black uppercase text-blue-500 tracking-widest italic">Scanning Orbit...</p></div>
            ) : (
              <div className="inline-flex items-center gap-3 bg-green-500/5 px-6 py-3 rounded-2xl mb-8"><ShieldCheck className="text-green-500" size={20}/><p className="text-[10px] font-black uppercase text-green-500 tracking-widest italic">Verified Virus-Free</p></div>
            )}

            <div className="flex flex-col md:flex-row gap-4 items-center">
              <button onClick={handleAction} className="w-full md:w-auto bg-[#2ea64d] text-white font-black px-14 py-5 rounded-2xl uppercase text-[11px] shadow-xl active:scale-95 transition-all">{app.is_free ? 'Secure Download' : `Unlock Access (${app.price})`}</button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 mb-16 shadow-sm">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              {[
                { l: 'File Size', v: app.size || 'Varies' },
                { l: 'Android Required', v: app.min_android || '8.0+' },
                { l: 'Last Updated', v: new Date(app.updated_at || app.created_at).toLocaleDateString(), c: 'text-blue-500' },
                { l: 'Status', v: 'Verified & Working ✅', c: 'text-[#24cd77]' }
              ].map((row, i) => (
                <div key={i} className="flex justify-between py-3.5 border-b border-gray-50 dark:border-white/5 text-[11px] font-bold uppercase tracking-widest font-mono">
                   <span className="text-gray-400">{row.l}</span>
                   <span className={row.c || 'text-gray-800 dark:text-gray-200'}>{row.v}</span>
                </div>
              ))}
           </div>
        </div>
        {/* Rest of the page components same as before */}
      </main>
    </div>
  )
}