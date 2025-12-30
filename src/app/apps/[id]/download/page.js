"use client"
import { useEffect, useState, use } from 'react'
import { supabase } from '../../../../supabase'
import Link from 'next/link'
import AdSlot from '../../../../components/AdSlot'

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

  if (!app) return <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center text-[#24cd77] font-bold italic">Fetching Server...</div>

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">
      <nav className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
        <Link href={`/apps/${id}`} className="text-xs font-bold uppercase text-gray-500">← Back</Link>
        <span className="text-[#24cd77] font-black uppercase text-xs">Salman AppOrbit</span>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-[#121212] rounded-3xl mx-auto mb-6 flex items-center justify-center border border-gray-200 dark:border-white/10 overflow-hidden shadow-xl">
          <img src={app.icon_url} className="w-full h-full object-cover" />
        </div>
        
        <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Downloading {app.title}</h1>
        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-10 italic">Please wait while we generate your secure link</p>

        <AdSlot />

        <div className="bg-gray-50 dark:bg-[#121212] p-10 rounded-[3rem] border border-gray-200 dark:border-white/5 mb-8">
          {!ready ? (
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 border-4 border-[#24cd77] border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="text-3xl font-black text-[#24cd77]">{timer}s</p>
               <p className="text-[10px] font-bold text-gray-500 uppercase mt-4 tracking-widest">Scanning for Security...</p>
            </div>
          ) : (
            <div className="animate-in zoom-in-95 duration-500">
               <p className="text-green-500 font-black mb-6 uppercase tracking-widest text-sm">Your file is ready!</p>
               <a 
                 href={app.download_url} 
                 target="_blank" 
                 className="block bg-[#24cd77] hover:bg-[#1eb96a] text-white font-black py-5 rounded-2xl uppercase text-xs shadow-xl shadow-green-500/30 transition-all active:scale-95"
               >
                 Click here to Download
               </a>
            </div>
          )}
        </div>

        <AdSlot label="Recommended for you" />
        
        <p className="text-[10px] text-gray-400 leading-relaxed max-w-sm mx-auto italic">
          Tip: If your download doesn't start automatically, please disable your ad-blocker and refresh the page.
        </p>
      </main>
    </div>
  )
}