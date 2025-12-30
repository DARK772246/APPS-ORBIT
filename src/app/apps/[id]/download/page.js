"use client"
import { useEffect, useState, use } from 'react'
import { supabase } from '../../../supabase' // Sahi rasta: app/apps/[id] se src/ tak
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, Share2, Info, Star, Smartphone, 
  AlertTriangle, Scale, CheckCircle, Copy, Bell, ArrowLeft 
} from 'lucide-react'
import ThemeToggle from '../../../../components/ThemeToggle' // Sahi rasta

export default function AppDetail({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const id = params.id
  const [app, setApp] = useState(null)
  const [reviews, setReviews] = useState([]) // Khali array default
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
        const lastUpdate = new Date(appData.updated_at || appData.created_at)
        const diff = (new Date() - lastUpdate) / (1000 * 60 * 60)
        if (diff < 48) setIsRecentlyUpdated(true)
      }
      const { data: revData } = await supabase.from('reviews').select('*').eq('app_id', id).order('created_at', { ascending: false })
      if (revData) setReviews(revData)
    } catch (err) {
      console.error("Orbit Error:", err)
    }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('reviews').insert([{ ...newReview, app_id: id }])
    if (!error) {
      setNewReview({ user_name: '', rating: 5, comment: '' })
      fetchData()
    }
  }

  if (!app) return <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center text-[#24cd77] font-black animate-pulse uppercase tracking-[0.5em]">Establishing Connection...</div>

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300 font-sans">
      <nav className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center sticky top-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md z-50 px-6">
        <Link href="/" className="text-[10px] font-black uppercase text-gray-400 hover:text-[#24cd77] flex items-center gap-2">
          <ArrowLeft size={14}/> Back to Store
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link Copied!"); }} className="text-gray-400 hover:text-blue-500"><Copy size={18}/></button>
          <button onClick={() => window.open(`https://wa.me/?text=Download ${app.title}: ${window.location.href}`)} className="text-gray-400 hover:text-[#24cd77]"><Share2 size={18}/></button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        
        {isRecentlyUpdated && (
          <div className="bg-blue-600 text-white p-4 rounded-2xl mb-8 flex items-center gap-3 shadow-lg">
            <Bell className="animate-bounce" size={20}/>
            <p className="text-[10px] font-black uppercase tracking-widest text-white">New Update: v{app.version} is now live!</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-16 border-b border-gray-100 dark:border-white/5 pb-12">
          <div className="w-44 h-44 bg-gray-100 dark:bg-[#121212] rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl flex items-center justify-center flex-shrink-0">
            {app.icon_url ? <img src={app.icon_url} className="w-full h-full object-cover" /> : <span className="text-7xl">📱</span>}
          </div>
          <div className="flex-1 text-center md:text-left w-full">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 italic leading-none">{app.title}</h1>
            <p className="text-[#24cd77] font-bold text-xs uppercase tracking-[0.3em] mb-8">{app.category} • v{app.version}</p>
            
            {scanning ? (
              <div className="inline-flex items-center gap-3 bg-blue-500/5 px-6 py-3 rounded-2xl mb-8 animate-pulse">
                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest italic">Scanning...</p>
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 bg-green-500/5 px-6 py-3 rounded-2xl mb-8">
                <ShieldCheck className="text-green-500" size={20}/>
                <p className="text-[10px] font-black uppercase text-green-500 tracking-widest">Verified Safe</p>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4">
              <button 
                onClick={() => app.is_free ? window.location.href=`/apps/${id}/download` : setShowPayment(true)} 
                className="bg-[#24cd77] text-white font-black px-12 py-5 rounded-2xl uppercase text-[11px] shadow-xl active:scale-95 transition-all"
              >
                {app.is_free ? 'Download Now' : `Buy Access (${app.price})`}
              </button>
            </div>
          </div>
        </div>

        {/* TECHNICAL SPECS TABLE */}
        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 mb-12 shadow-sm">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              {[
                { l: 'File Size', v: app.size || 'Varies' },
                { l: 'Android Required', v: app.min_android || '8.0+' },
                { l: 'Last Updated', v: new Date(app.updated_at || app.created_at).toLocaleDateString(), c: 'text-blue-500' },
                { l: 'Status', v: 'Working ✅', c: 'text-[#24cd77]' }
              ].map((row, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-gray-50 dark:border-white/5 text-[11px] font-bold uppercase tracking-widest">
                   <span className="text-gray-400">{row.l}</span>
                   <span className={row.c || 'text-gray-800 dark:text-gray-200'}>{row.v}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="max-w-3xl mb-20">
              <h3 className="text-sm font-black uppercase mb-6 text-gray-400 tracking-widest italic flex items-center gap-2"><Info size={16}/> Overview</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm font-serif italic whitespace-pre-wrap">"{app.description}"</p>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 dark:bg-[#121212] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 h-fit">
                <h3 className="text-[10px] font-black uppercase mb-6 text-[#24cd77]">Submit Feedback</h3>
                <form onSubmit={submitReview} className="space-y-3">
                  <input required className="w-full bg-white dark:bg-black border border-gray-100 dark:border-white/10 p-3 rounded-xl text-xs outline-none" placeholder="Name" value={newReview.user_name} onChange={e => setNewReview({...newReview, user_name:e.target.value})} />
                  <textarea required className="w-full bg-white dark:bg-black border border-gray-100 dark:border-white/10 p-3 rounded-xl text-xs outline-none italic" rows="2" placeholder="Experience..." value={newReview.comment} onChange={e => setNewReview({...newReview, comment:e.target.value})} />
                  <button className="w-full bg-black dark:bg-white text-white dark:text-black font-black py-3 rounded-xl text-[10px] uppercase">Post Review</button>
                </form>
              </div>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {reviews && reviews.map(rev => (
                  <div key={rev.id} className="p-4 border-l-2 border-[#24cd77] bg-gray-50 dark:bg-white/5 rounded-r-xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase">{rev.user_name}</span>
                      <span className="text-[8px]">{"⭐".repeat(rev.rating)}</span>
                    </div>
                    <p className="text-xs text-gray-500 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
        </div>

        {/* PAYMENT MODAL (REMAINS SAME) */}
        {showPayment && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <div className="bg-white dark:bg-[#111] p-10 rounded-[3rem] max-w-sm w-full relative border border-[#24cd77]/30 text-center animate-in zoom-in-95">
              <button onClick={() => setShowPayment(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">✕</button>
              <h3 className="text-xl font-black uppercase mb-8 italic italic text-gray-800 dark:text-white">Orbit <span className="text-[#24cd77]">Payment</span></h3>
              <div className="space-y-4 mb-8">
                <div className="p-5 bg-gray-50 dark:bg-black/40 rounded-3xl border border-gray-100 dark:border-white/5 text-left italic">
                  <p className="text-[9px] font-bold text-[#24cd77] uppercase mb-1">NayaPay / JazzCash</p>
                  <p className="text-2xl font-black tracking-widest text-gray-800 dark:text-white italic">0327-5176283</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase border-t border-gray-100 dark:border-white/5 pt-2 italic">Salman Khan</p>
                </div>
                <div className="p-5 bg-gray-50 dark:bg-black/40 rounded-3xl border border-gray-100 dark:border-white/5 text-left italic">
                  <p className="text-[9px] font-bold text-[#24cd77] uppercase mb-1 tracking-widest italic">NayaPay IBAN</p>
                  <p className="text-[10px] font-bold dark:text-white text-gray-800 break-all font-mono italic">PK16 NAYA 1234 5032 7517 6283</p>
                </div>
              </div>
              <a href={`https://wa.me/923275176283?text=I paid for ${app.title} v${app.version}`} className="block bg-[#25D366] text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-widest shadow-xl shadow-green-500/20 active:scale-95 transition-all">Send Screenshot</a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}