"use client"
import { useState, useEffect } from 'react'
import { DownloadCloud, X } from 'lucide-react'

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    })

    // Agar app pehle se installed hai toh hide kardo
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert("Click on your browser menu (3 dots) and select 'Install App' or 'Add to Home Screen'")
      return
    }
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[300] animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-[#2ea64d] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/20">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <DownloadCloud size={24} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-tight">Install Salman AppOrbit</h4>
            <p className="text-[10px] opacity-90 font-medium">Get the full experience on your home screen!</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleInstall}
            className="bg-white text-[#2ea64d] px-4 py-2 rounded-lg text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all"
          >
            Install
          </button>
          <button onClick={() => setShowPrompt(false)} className="p-1 opacity-50">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}