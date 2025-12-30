"use client"
import { useEffect, useState, use } from 'react'
import { supabase } from '../../../supabase'
import Link from 'next/link'
import { ShieldCheck, Share2, Info, Star, Smartphone, AlertTriangle, Scale, CheckCircle, Copy, Bell } from 'lucide-react'
import ThemeToggle from '../../../components/ThemeToggle'

export default function AppDetail({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const id = params.id
  const [app, setApp] = useState(null)
  const [reviews, setReviews] = useState([])
  const [showPayment, setShowPayment] = useState(false)
  const [newReview, setNewReview] = useState({ user_name: '', rating: 5, comment: '' })
  const [isRecentlyUpdated, setIsRecentlyUpdated] = useState(false)

  useEffect(() => {
    fetchData()
  }, [id])

  async function fetchData() {
    const { data: appData } = await supabase.from('apps').select('*').eq('id', id).single()
    if (appData) {
      setApp(appData)
      document.title = `${appData.title} v${appData.version} Download - Salman AppOrbit`
      
      // Check if updated in last 48 hours
      const lastUpdate = new Date(appData.updated_at)
      const now = new Date()
      const diff = (now - lastUpdate) / (1000 * 60 * 60)
      if (diff < 48) setIsRecentlyUpdated(true)
    }
    const { data: revData } = await supabase.from('reviews').select('*').eq('app_id', id).order('created_at', { ascending: false })
    if (revData) setReviews(revData)
  }

  if (!app) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#2ea64d] font-black animate-pulse">Establishing Connection...</div>

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300 font-sans">
      <nav className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center sticky top-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md z-50 px-6">
        <Link href="/" className="text-[10px] font-black uppercase text-gray-500 hover:text-[#2ea64d]">← Store Orbit</Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link Copied!") }} className="text-gray-400 hover:text-blue-500"><Copy size={18}/></button>
          <button onClick={() => window.open(`https://wa.me/?text=Download ${app.title} Premium: ${window.location.href}`)} className="text-gray-400 hover:text-[#2ea64d]"><Share2 size={18}/></button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        
        {/* RECENT UPDATE NOTIFICATION */}
        {isRecentlyUpdated && (
          <motion.div initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} className="bg-blue-600 text-white p-4 rounded-2xl mb-8 flex items-center gap-3 shadow-lg shadow-blue-500/20">
            <Bell className="animate-bounce" size={20}/>
            <p className="text-xs font-black uppercase tracking-widest">New Update Alert: v{app.version} is now live! Please reinstall for new features.</p>
          </motion.div>
        )}

        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-16 border-b border-gray-100 dark:border-white/5 pb-12">
          <div className="w-48 h-48 bg-gray-50 dark:bg-[#121212] rounded-[3rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl flex items-center justify-center flex-shrink-0">
            {app.icon_url ? <img src={app.icon_url} className="w-full h-full object-cover" /> : <span className="text-7xl">📱</span>}
          </div>
          <div className="flex-1 text-center md:text-left w-full">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2 italic leading-none">{app.title}</h1>
            <p className="text-[#2ea64d] font-bold text-xs uppercase tracking-[0.3em] mb-8">Professional Edition • v{app.version}</p>
            
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <button onClick={() => app.is_free ? window.location.href=`/apps/${id}/download` : setShowPayment(true)} className="w-full md:w-auto bg-[#2ea64d] hover:bg-[#268a40] text-white font-black px-12 py-5 rounded-2xl uppercase text-[11px] shadow-xl active:scale-95 transition-all">
                {app.is_free ? 'Secure Download' : `Unlock Access (${app.price})`}
              </button>
              <button onClick={async () => {const r = prompt("Issue?"); if(r) await supabase.from('reports').insert([{app_id:id, app_name:app.title, issue_type:r}]); alert("Reported to Salman.");}} className="text-[10px] font-black uppercase text-red-500 hover:underline">Report Issue</button>
            </div>
          </div>
        </div>

        {/* TECHNICAL SPECS TABLE (AN1 STYLE) */}
        <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 mb-12 shadow-sm">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
              {[
                { l: 'App Version', v: app.version },
                { l: 'File Size', v: app.size || 'Varies' },
                { l: 'Android Required', v: app.min_android || '8.0+' },
                { l: 'Last Updated', v: new Date(app.updated_at).toLocaleDateString(), c: 'text-blue-500' },
                { l: 'Status', v: 'Verified & Working', c: 'text-[#2ea64d]' }
              ].map((row, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-gray-50 dark:border-white/5 text-xs font-bold uppercase tracking-widest">
                   <span className="text-gray-400">{row.l}</span>
                   <span className={row.c || 'text-gray-800 dark:text-gray-200'}>{row.v}</span>
                </div>
              ))}
           </div>
        </div>

        {/* WHATS NEW SECTION */}
        {app.whats_new && (
          <div className="mb-12 p-8 bg-[#2ea64d]/5 border-l-4 border-[#2ea64d] rounded-r-[2.5rem]">
             <h3 className="text-[10px] font-black uppercase text-[#2ea64d] mb-4 flex items-center gap-2 tracking-[0.2em]"><Zap size={14}/> What's New in this Version</h3>
             <p className="text-sm text-gray-500 dark:text-gray-300 italic leading-relaxed whitespace-pre-wrap">"{app.whats_new}"</p>
          </div>
        )}

        {/* DESCRIPTION */}
        <div className="max-w-3xl mb-20">
           <h3 className="text-sm font-black uppercase mb-6 text-gray-400 tracking-widest italic">Product Intel</h3>
           <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm font-serif italic whitespace-pre-wrap">"{app.description}"</p>
        </div>

        {/* PAYMENT MODAL (REMAINS SAME WITH SALMAN DETAILS) */}
        {showPayment && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <div className="bg-white dark:bg-[#111] p-10 rounded-[3rem] max-w-sm w-full relative border border-[#2ea64d]/30 text-center animate-in zoom-in-95">
              <button onClick={() => setShowPayment(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">✕</button>
              <h3 className="text-xl font-black uppercase mb-8 italic tracking-tighter italic">Orbit <span className="text-[#2ea64d]">Payment</span></h3>
              <div className="space-y-4 mb-8">
                <div className="p-5 bg-gray-50 dark:bg-black/40 rounded-3xl border border-gray-100 dark:border-white/5 text-left italic">
                  <p className="text-[9px] font-bold text-[#2ea64d] uppercase mb-1">NayaPay / JazzCash</p>
                  <p className="text-2xl font-black tracking-widest text-gray-800 dark:text-white">0327-5176283</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase border-t border-gray-100 dark:border-white/5 pt-2">Salman Khan</p>
                </div>
                <div className="p-5 bg-gray-50 dark:bg-black/40 rounded-3xl border border-gray-100 dark:border-white/5 text-left italic">
                  <p className="text-[9px] font-bold text-[#2ea64d] uppercase mb-1">NayaPay IBAN</p>
                  <p className="text-[10px] font-bold break-all font-mono">PK16 NAYA 1234 5032 7517 6283</p>
                </div>
              </div>
              <a href={`https://wa.me/923275176283?text=I paid for ${app.title} v${app.version}`} target="_blank" className="block bg-[#25D366] text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-widest shadow-xl shadow-green-500/20 active:scale-95 transition-all">Send Screenshot</a>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}