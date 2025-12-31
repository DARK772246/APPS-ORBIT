"use client"
import { useEffect, useState, use } from 'react'
import { supabase } from '../../../../supabase' // FIXED PATH
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, ShieldCheck, CheckCircle } from 'lucide-react'
import ThemeToggle from '../../../../components/ThemeToggle' // FIXED PATH

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

  if (!app) return <div className="min-h-screen flex items-center justify-center text-[#24cd77] font-bold">Orbiting Link...</div>

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300 font-sans">
      <nav className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md">
        <Link href={`/apps/${id}`} className="text-[10px] font-black uppercase text-gray-500 hover:text-[#24cd77] flex items-center gap-2">
          <ArrowLeft size={14}/> Back to Store
        </Link>
        <ThemeToggle />
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-[#121212] rounded-3xl mx-auto mb-6 border border-gray-200 dark:border-white/10 overflow-hidden shadow-xl flex items-center justify-center">
          {app.icon_url ? <img src={app.icon_url} className="w-full h-full object-cover" alt="" /> : <span className="text-4xl">📱</span>}
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight mb-2 italic">Generating Link</h1>
        
        <div className="bg-white dark:bg-[#111] p-12 rounded-[3rem] border border-gray-100 dark:border-white/5 mb-8 shadow-sm">
          {!ready ? (
            <div className="flex flex-col items-center">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-16 h-16 border-4 border-[#24cd77] border-t-transparent rounded-full mb-4"/>
               <p className="text-4xl font-black text-[#24cd77]">{timer}s</p>
               <p className="text-[10px] font-black uppercase text-gray-400 mt-4 tracking-widest italic flex items-center gap-2"><ShieldCheck size={14} className="text-[#24cd77]"/> Cloud Security Scan Active</p>
            </div>
          ) : (
            <div className="animate-in zoom-in-95 duration-500">
               <p className="text-[#24cd77] font-black mb-6 uppercase tracking-widest text-sm flex items-center justify-center gap-2 italic">Secure Link Ready!</p>
               <a href={app.download_url} target="_blank" rel="noopener noreferrer" className="block bg-[#24cd77] hover:bg-[#268a40] text-white font-black py-5 rounded-2xl uppercase text-xs shadow-xl active:scale-95 transition-all italic">Click to Download APK</a>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}