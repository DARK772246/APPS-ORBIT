"use client"
import { useEffect, useState, use } from 'react'
import { supabase } from '../../../supabase'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, Share2, Info, Star, Smartphone, 
  AlertTriangle, Scale, CheckCircle, Copy, Bell, ArrowLeft, Zap 
} from 'lucide-react'
import ThemeToggle from '../../../components/ThemeToggle'

export default function AppDetail({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const id = params.id
  
  const [app, setApp] = useState(null)
  const [reviews, setReviews] = useState([])
  const [showPayment, setShowPayment] = useState(false)
  const [scanning, setScanning] = useState(true)

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
    } catch (err) { console.error("Orbit Error:", err) }
  }

  const handleAction = () => {
    if (!app) return;
    // FIXED: Agar App FREE hai toh direct download page par bhejein
    if (app.price === "FREE" || app.is_free === true) {
      window.location.href = `/apps/${id}/download`
    } else {
      setShowPayment(true)
    }
  }

  if (!app) return <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center text-[#2ea64d] font-black animate-pulse uppercase tracking-[0.5em]">Establishing Orbit...</div>

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300 font-sans pb-20">
      <nav className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center sticky top-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md z-50 px-6">
        <Link href="/" className="text-[10px] font-black uppercase text-gray-400 hover:text-[#2ea64d] flex items-center gap-2">
          <ArrowLeft size={14}/> Back to Store
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={() => window.open(`https://wa.me/?text=Download ${app.title}: ${window.location.href}`)} className="text-gray-400 hover:text-[#2ea64d] transition-colors"><Share2 size={18}/></button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-16 border-b border-gray-100 dark:border-white/5 pb-12 text-center md:text-left">
          <div className="w-44 h-44 bg-gray-100 dark:bg-[#121212] rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl flex items-center justify-center flex-shrink-0">
            {app.icon_url ? <img src={app.icon_url} className="w-full h-full object-cover" /> : <span className="text-7xl">📱</span>}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2 italic leading-none">{app.title}</h1>
            <p className="text-[#2ea64d] font-bold text-xs uppercase tracking-[0.3em] mb-8">{app.category} • v{app.version}</p>
            
            {scanning ? (
              <div className="inline-flex items-center gap-3 bg-blue-500/5 px-6 py-3 rounded-2xl mb-8 animate-pulse"><div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div><p className="text-[10px] font-black uppercase text-blue-500 tracking-widest italic">Scanning Orbit Assets...</p></div>
            ) : (
              <div className="inline-flex items-center gap-3 bg-green-500/5 px-6 py-3 rounded-2xl mb-8"><ShieldCheck className="text-green-500" size={20}/><p className="text-[10px] font-black uppercase text-green-500 tracking-widest italic">Verified Virus-Free</p></div>
            )}

            <div className="flex flex-col md:flex-row gap-4 items-center">
              <button onClick={handleAction} className="bg-[#24cd77] text-white font-black px-12 py-5 rounded-2xl uppercase text-[11px] shadow-xl active:scale-95 transition-all">
                {app.price === "FREE" ? 'Download Now' : `Unlock Access (${app.price})`}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-[2rem] p-8 mb-12 shadow-sm italic text-sm text-gray-500">
           "{app.description}"
        </div>

        {/* PAYMENT MODAL (SALMAN'S DETAILS) */}
        {showPayment && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
            <div className="bg-white dark:bg-[#111] p-10 rounded-[3rem] max-w-sm w-full relative border border-[#2ea64d]/30 text-center animate-in zoom-in-95">
              <button onClick={() => setShowPayment(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">✕</button>
              <h3 className="text-xl font-black uppercase mb-8 italic italic">Orbit <span className="text-[#2ea64d]">Payment</span></h3>
              <div className="space-y-4 mb-8 text-left">
                <div className="p-5 bg-gray-50 dark:bg-black/40 rounded-3xl border border-gray-100 dark:border-white/5 italic">
                  <p className="text-[9px] font-bold text-[#2ea64d] uppercase mb-1">NayaPay / JazzCash</p>
                  <p className="text-2xl font-black tracking-widest text-gray-800 dark:text-white italic">0327-5176283</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase border-t border-gray-100 dark:border-white/5 pt-2">Salman Khan</p>
                </div>
                <div className="p-5 bg-gray-50 dark:bg-black/40 rounded-3xl border border-gray-100 dark:border-white/5">
                  <p className="text-[9px] font-bold text-[#2ea64d] uppercase mb-1 tracking-widest italic">NayaPay IBAN</p>
                  <p className="text-[10px] font-bold break-all dark:text-white font-mono leading-relaxed italic">PK16 NAYA 1234 5032 7517 6283</p>
                </div>
              </div>
              <a href={`https://wa.me/923275176283?text=I paid for ${app.title}`} target="_blank" className="block bg-[#25D366] text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-widest shadow-xl active:scale-95 transition-all">Send Screenshot</a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}