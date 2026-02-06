"use client" // <--- ADDED TO MAKE IT A CLIENT COMPONENT

import Link from 'next/link'
import { ArrowLeft, Shield, Zap, HelpCircle, Smartphone } from 'lucide-react'
// import ThemeToggle from '../../components/ThemeToggle' // <-- IMPORT IS REMOVED
import { useEffect, useState } from 'react' // <-- HOOKS ARE NOW ALLOWED

export default function InstallationGuide() {
  
    // State for ThemeToggle cleanup (if it was rendering something)
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // Ab kyunki theme lock hai, hum toggle nahi kar sakte, par state/effect safe hain.

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-gray-900 dark:text-white font-sans transition-colors pb-20">
      
      <nav className="p-4 border-b border-gray-100 dark:border-white/5 sticky top-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md z-50 px-6 flex justify-between items-center">
        <Link href="/" className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-2 hover:text-[#2ea64d]"><ArrowLeft size={14}/> Back to Orbit</Link>
        {/* ThemeToggle component is NOT rendered here, so no error */}
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        
        {/* IMPORTANT NOTES SECTION (from your screenshot) */}
        <div className="bg-red-500/10 border-l-4 border-red-500 p-8 rounded-[2rem] mb-12 shadow-sm">
          <h2 className="text-xl font-black uppercase italic mb-6 text-red-500 flex items-center gap-3"><Shield size={20} /> Important Notes</h2>
          <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <li className='flex items-start gap-3'><Zap size={16} className="text-red-500 flex-shrink-0 mt-1"/> <span>Google tries to block apps that aren't from the Play Store. To install these apps, temporarily turn off Play Protect in your phone settings.</span></li>
            <li className='flex items-start gap-3'><Smartphone size={16} className="text-red-500 flex-shrink-0 mt-1"/> <span>How to install games & apps from XAPK, APKS, APK: Click <Link href="/guide" className='text-[#2ea64d] font-bold italic'>Here</Link> (On this page, for now).</span></li>
            <li className='flex items-start gap-3'><HelpCircle size={16} className="text-red-500 flex-shrink-0 mt-1"/> <span>Any issues related to Download, please read FAQs on <Link href="/faq" className='text-[#2ea64d] font-bold italic'>Orbit FAQ</Link>.</span></li>
          </ul>
        </div>

        {/* INSTALLATION NOTE SECTION (from your screenshot) */}
        <div className="bg-blue-500/10 border-l-4 border-blue-500 p-8 rounded-[2rem] shadow-sm">
            <h2 className="text-xl font-black uppercase italic mb-6 text-blue-500 flex items-center gap-3"><Smartphone size={20}/> Installation Note</h2>
            <ol className="space-y-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed list-decimal pl-5">
                <li>Download the APK file from the download link provided on the app page.</li>
                <li>Go to Settings &gt; Security &gt; Enable "Unknown Sources" (or "Install unknown apps").</li>
                <li>Find the downloaded APK file in your notification bar or File Manager and tap to install.</li>
                <li>Follow the installation prompts carefully.</li>
                <li>Once installed, enjoy the game/app!</li>
            </ol>
        </div>

      </main>
    </div>
  )
}