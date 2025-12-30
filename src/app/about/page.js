"use client"
import Link from 'next/link'
import { ShieldCheck, Users, Target, Zap, Globe, MessageCircle } from 'lucide-react'
import ThemeToggle from '../../components/ThemeToggle'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* NAVBAR */}
      <nav className="bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-white/5 sticky top-0 z-50 px-4 h-16 flex items-center shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-[#2ea64d] text-white px-2 py-1 rounded-lg font-black text-xl italic shadow-lg">SAO</div>
            <span className="font-black text-lg uppercase hidden sm:block italic">Salman <span className="text-[#2ea64d]">AppOrbit</span></span>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16">
        
        {/* HERO SECTION */}
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-6">
            Empowering the <span className="text-[#2ea64d]">Community</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed italic">
            "At Salman AppOrbit, we believe that premium technology should be accessible to everyone, regardless of their budget."
          </p>
        </section>

        {/* CORE MISSION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white dark:bg-[#111] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="w-12 h-12 bg-[#2ea64d]/10 rounded-xl flex items-center justify-center text-[#2ea64d] mb-6">
              <Target size={28} />
            </div>
            <h3 className="text-xl font-black uppercase mb-4 tracking-tight italic">Our Mission</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium font-serif">
              Salman AppOrbit was founded by Salman Khan with a single goal: To create a transparent and secure platform for Android enthusiasts. We bridge the gap between high-end premium features and affordability by providing verified programs at community-friendly prices.
            </p>
          </div>

          <div className="bg-white dark:bg-[#111] p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-6">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-black uppercase mb-4 tracking-tight italic">The Security Standard</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium font-serif">
              Safety is our top priority. Every software package listed on Salman AppOrbit undergoes a manual multi-stage verification process. We ensure all files are free from malware, intrusive trackers, and unnecessary permissions, providing you a clean digital experience.
            </p>
          </div>
        </div>

        {/* DETAILED CONTENT SECTION (FOR GOOGLE BOT) */}
        <section className="prose dark:prose-invert max-w-none mb-20">
          <h2 className="text-2xl font-black uppercase italic mb-8 border-l-4 border-[#2ea64d] pl-4">Who is Salman Khan?</h2>
          <p className="text-gray-500 dark:text-gray-400 leading-loose mb-6 italic">
            Salman Khan is a dedicated developer and tech enthusiast based in Pakistan. With years of experience in Android optimization, Salman recognized the struggle of many students and professionals who cannot afford expensive monthly subscriptions. Salman AppOrbit is his personal commitment to the community to provide a safer alternative for premium software access.
          </p>

          <h2 className="text-2xl font-black uppercase italic mb-8 border-l-4 border-[#2ea64d] pl-4">Our Verification Process</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
            {[
              { t: 'Manual Installation', d: 'Each app is installed and tested on multiple physical devices.' },
              { t: 'Malware Scan', d: 'Files are scanned through professional security tools for zero-day threats.' },
              { t: 'Feature Unlock', d: 'We verify that all premium features are operational and optimized.' },
              { t: 'Performance Check', d: 'Ensuring the app runs smoothly without battery drain or overheating.' }
            ].map((step, i) => (
              <li key={i} className="bg-gray-50 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                <span className="text-[#2ea64d] font-black uppercase text-[10px] block mb-2">Step 0{i+1}</span>
                <h4 className="font-bold text-sm mb-1">{step.t}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{step.d}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* CONTACT CALL TO ACTION */}
        <section className="bg-[#2ea64d] rounded-[3rem] p-12 text-center text-white shadow-xl shadow-green-500/20">
          <h2 className="text-3xl font-black uppercase italic mb-4">Join the Orbit</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto text-sm font-medium">Have questions or need a specific app? Reach out directly to Salman Khan. We are always here to help our community grow.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/923275176283" className="bg-white text-[#2ea64d] font-black px-8 py-3 rounded-full text-[10px] uppercase shadow-lg hover:scale-105 transition-all">WhatsApp Support</a>
            <a href="https://www.instagram.com/salman_orakxi/" className="bg-black/20 backdrop-blur-md text-white font-black px-8 py-3 rounded-full text-[10px] uppercase border border-white/30 hover:bg-black/30 transition-all">Follow Instagram</a>
          </div>
        </section>

      </main>
    </div>
  )
}