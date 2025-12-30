"use client"
import { useEffect, useState, use } from 'react'
import { supabase } from '../../../supabase' 
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, Share2, Info, Star, Smartphone, 
  AlertTriangle, Scale, CheckCircle, Copy, Bell, ArrowLeft 
} from 'lucide-react'
import ThemeToggle from '../../../components/ThemeToggle'

export default function AppDetail({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const id = params.id
  const [app, setApp] = useState(null)
  const [reviews, setReviews] = useState([])
  const [showPayment, setShowPayment] = useState(false)
  const [scanning, setScanning] = useState(true)
  const [newReview, setNewReview] = useState({ user_name: '', rating: 5, comment: '' })

  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => setScanning(false), 2000)
    return () => clearTimeout(timer)
  }, [id])

  async function fetchData() {
    try {
      const { data: appData } = await supabase.from('apps').select('*').eq('id', id).single()
      if (appData) setApp(appData)
      const { data: revData } = await supabase.from('reviews').select('*').eq('app_id', id).order('created_at', { ascending: false })
      if (revData) setReviews(revData)
    } catch (err) { console.error(err) }
  }

  if (!app) return <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center text-[#2ea64d] font-black animate-pulse uppercase tracking-[0.5em]">Establishing Orbit...</div>

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300 font-sans">
      <nav className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center sticky top-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md z-50 px-6">
        <Link href="/" className="text-[10px] font-black uppercase text-gray-400 hover:text-[#2ea64d] flex items-center gap-2">
          <ArrowLeft size={14}/> Back to Store
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link Copied!"); }} className="text-gray-400 hover:text-blue-500"><Copy size={18}/></button>
          <button onClick={() => window.open(`https://wa.me/?text=Download ${app.title}: ${window.location.href}`)} className="text-gray-400 hover:text-[#2ea64d] shadow-sm"><Share2 size={18}/></button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-16 border-b border-gray-100 dark:border-white/5 pb-12 text-center md:text-left">
          <div className="w-44 h-44 bg-gray-100 dark:bg-[#121212] rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl flex items-center justify-center">
            {app.icon_url ? <img src={app.icon_url} className="w-full h-full object-cover" /> : <span className="text-7xl">📱</span>}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 italic leading-none">{app.title}</h1>
            <p className="text-[#2ea64d] font-bold text-xs uppercase tracking-[0.3em] mb-8">{app.category} • v{app.version}</p>
            <button onClick={() => app.is_free ? window.location.href=`/apps/${id}/download` : setShowPayment(true)} className="bg-[#24cd77] text-white font-black px-12 py-5 rounded-2xl uppercase text-[11px] shadow-xl active:scale-95 transition-all">
              {app.is_free ? 'Secure Download' : `Unlock Access (${app.price})`}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-[2rem] p-8 mb-12 shadow-sm italic text-sm">
           "{app.description}"
        </div>
      </main>

      {/* Payment Modal for Paid Apps */}
      {showPayment && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md text-center">
          <div className="bg-white dark:bg-[#111] p-10 rounded-[3rem] max-w-sm w-full relative border border-[#24cd77]/30">
             <button onClick={() => setShowPayment(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">✕</button>
             <h3 className="text-xl font-black uppercase mb-8 italic text-[#2ea64d]">Orbit Payment</h3>
             <p className="text-2xl font-black mb-4 dark:text-white">0327-5176283</p>
             <a href={`https://wa.me/923275176283?text=I paid for ${app.title}`} className="block bg-[#25D366] text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-widest shadow-xl">Send Screenshot</a>
          </div>
        </div>
      )}
    </div>
  )
}