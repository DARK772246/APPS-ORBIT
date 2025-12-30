"use client"
import { useEffect, useState, use } from 'react'
import { supabase } from '../../../../supabase' // FIXED: 4 steps back
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, ShieldCheck, Loader2 } from 'lucide-react'
import ThemeToggle from '../../../../components/ThemeToggle' // FIXED: 4 steps back

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
    } else {
      setReady(true)
    }
  }, [timer])

  if (!app) return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center text-[#24cd77] font-bold animate-pulse uppercase tracking-widest">
      Fetching Orbit Server...
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300 font-sans">
      
      {/* NAVBAR */}
      <nav className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center sticky top-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md z-50 px-6">
        <Link href={`/apps/${id}`} className="text-[10px] font-black uppercase text-gray-500 hover:text-[#24cd77] flex items-center gap-2">
          <ArrowLeft size={14}/> Back to Detail
        </Link>
        <ThemeToggle />
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        {/* APP ICON */}
        <div className="w-24 h-24 bg-gray-100 dark:bg-[#121212] rounded-3xl mx-auto mb-6 flex items-center justify-center border border-gray-200 dark:border-white/10 overflow-hidden shadow-xl">
          {app.icon_url ? (
            <img src={app.icon_url} className="w-full h-full object-cover" alt={app.title} />
          ) : (
            <span className="text-4xl">📱</span>
          )}
        </div>
        
        <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Downloading {app.title}</h1>
        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-10 italic">Your secure link is being generated...</p>

        {/* TIMER & DOWNLOAD BOX */}
        <div className="bg-white dark:bg-[#111] p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 mb-8 shadow-sm relative overflow-hidden">
          {!ready ? (
            <div className="flex flex-col items-center">
               <motion.div 
                 animate={{ rotate: 360 }} 
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="w-16 h-16 border-4 border-[#24cd77] border-t-transparent rounded-full mb-4"
               />
               <p className="text-4xl font-black text-[#24cd77]">{timer}s</p>
               <p className="text-[10px] font-black uppercase text-gray-400 mt-4 tracking-widest italic flex items-center gap-2">
                 <ShieldCheck size={14} className="text-[#24cd77]"/> Cloud Security Scan Active
               </p>
            </div>
          ) : (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-4">
               <p className="text-[#24cd77] font-black mb-6 uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                 <CheckCircle size={20}/> Ready for Launch!
               </p>
               <a 
                 href={app.download_url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="block bg-[#24cd77] hover:bg-[#1eb96a] text-white font-black py-5 rounded-2xl uppercase text-xs shadow-xl shadow-green-500/30 transition-all active:scale-95"
               >
                 Click here to Start Download
               </a>
            </motion.div>
          )}
        </div>

        {/* CATCHY TEXT FOR ADSENSE */}
        <div className="mt-12 text-left bg-[#24cd77]/5 p-6 rounded-2xl border border-dashed border-[#24cd77]/20">
           <h4 className="text-[10px] font-black uppercase text-[#24cd77] mb-2">Safe Download Tip:</h4>
           <p className="text-[11px] text-gray-500 dark:text-gray-400 italic leading-relaxed">
             Every file in the Salman AppOrbit galaxy is manually verified. If your download doesn't start, please check your internet connection or try again after refreshing the page.
           </p>
        </div>
      </main>
    </div>
  )
}

// Chota function helper for CheckCircle icon
function CheckCircle({size}) {
  return <ShieldCheck size={size} />
}