"use client"
import { useEffect, useState, use } from 'react'
import { supabase } from '../../../../supabase'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldCheck, Download, Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import ThemeToggle from '../../../../components/ThemeToggle'

export default function DownloadPage({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const id = params.id
  const [app, setApp] = useState(null)
  const [timer, setTimer] = useState(10)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function fetchApp() {
      const { data } = await supabase.from('apps').select('*').eq('id', id).single()
      if (data) setApp(data)
    }
    fetchApp()
  }, [id])

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer(t => t - 1), 1000)
      return () => clearInterval(countdown)
    } else { setReady(true) }
  }, [timer])

  if (!app) return <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center text-[#2ea64d] font-black animate-pulse">CONNECTING ORBIT...</div>

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300 font-sans pb-20">
      <nav className="p-4 border-b border-gray-200 dark:border-white/5 flex justify-between items-center bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md sticky top-0 z-50">
        <Link href={`/apps/${id}`} className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-2 hover:text-[#2ea64d]"><ArrowLeft size={14}/> Back</Link>
        <ThemeToggle />
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12 text-center">
        {/* ADS SLOT 1 */}
        <div className="mb-10 p-4 border-2 border-dashed border-gray-200 dark:border-white/5 rounded-2xl bg-gray-50 dark:bg-[#111] text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Place Google Ad Here</div>

        <div className="w-24 h-24 bg-white dark:bg-[#111] rounded-3xl mx-auto mb-6 border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl flex items-center justify-center">
          <img src={app.icon_url} className="w-full h-full object-cover" alt="" />
        </div>
        
        <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Generating Secure Link</h1>
        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-10 italic">Initializing Encrypted Connection for {app.title}</p>

        {/* ANIMATED COUNTDOWN BOX */}
        <div className="bg-white dark:bg-[#111] p-12 rounded-[4rem] border border-gray-100 dark:border-white/5 mb-8 shadow-xl relative overflow-hidden group">
          {!ready ? (
            <div className="flex flex-col items-center">
               <div className="relative w-24 h-24 mb-6">
                 <svg className="w-full h-full rotate-[-90deg]">
                   <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-white/5" />
                   <motion.circle cx="48" cy="48" r="40" stroke="#2ea64d" strokeWidth="8" fill="transparent" strokeDasharray="251" initial={{ strokeDashoffset: 251 }} animate={{ strokeDashoffset: 251 - (251 * (10 - timer)) / 10 }} />
                 </svg>
                 <span className="absolute inset-0 flex items-center justify-center text-3xl font-black text-[#2ea64d]">{timer}s</span>
               </div>
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest animate-pulse flex items-center gap-2"><ShieldCheck size={14} className="text-[#2ea64d]"/> Security Scan in Progress</p>
            </div>
          ) : (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-4">
               <p className="text-[#2ea64d] font-black mb-6 uppercase tracking-widest text-sm flex items-center justify-center gap-2 italic">Verification Successful!</p>
               <a href={app.download_url} target="_blank" rel="noopener noreferrer" className="block bg-[#2ea64d] hover:bg-[#268a40] text-white font-black py-5 rounded-2xl uppercase text-[11px] shadow-xl shadow-green-500/20 active:scale-95 transition-all">Download Now</a>
            </motion.div>
          )}
        </div>

        {/* ADS SLOT 2 */}
        <div className="mt-10 p-4 border-2 border-dashed border-gray-200 dark:border-white/5 rounded-2xl bg-gray-50 dark:bg-[#111] text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Place Google Ad Here</div>

        <div className="mt-12 bg-[#2ea64d]/5 p-6 rounded-2xl border border-dashed border-[#2ea64d]/30 flex items-start gap-4 text-left italic">
           <AlertCircle className="text-[#2ea64d] flex-shrink-0" size={20} />
           <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">If your download doesn't start automatically, please refresh the page or disable your ad-blocker. All Salman AppOrbit files are verified virus-free.</p>
        </div>
      </main>
    </div>
  )
}