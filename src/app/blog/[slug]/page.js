"use client"
import { useEffect, useState, use } from 'react'
import { supabase } from '../../../supabase'
import Link from 'next/link'
import { ArrowLeft, User, Calendar, PenTool, Globe } from 'lucide-react'
import ThemeToggle from '../../../components/ThemeToggle'

export default function BlogPost({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const slug = params.slug
  const [article, setArticle] = useState(null)

  useEffect(() => {
    async function fetchArticle() {
      const { data } = await supabase.from('articles').select('*').eq('slug', slug).single()
      if (data) setArticle(data)
    }
    fetchArticle()
  }, [slug])

  if (!article) return <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center text-[#2ea64d] font-black animate-pulse">Establishing Connection...</div>

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300 font-sans pb-20">
      <nav className="p-4 border-b border-gray-100 dark:border-white/5 sticky top-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md z-50 px-6 flex justify-between">
        <Link href="/" className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-2 hover:text-[#2ea64d]"><ArrowLeft size={14}/> Back to Store</Link>
        <ThemeToggle />
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        {article.image_url && (
          <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border dark:border-white/5 mb-12 bg-gray-200 dark:bg-[#111]">
            <img src={article.image_url} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <span className="bg-[#2ea64d]/10 text-[#2ea64d] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic">{article.author}</span>
          <span className="text-[9px] font-black text-gray-400 uppercase">{new Date(article.created_at).toLocaleDateString()}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-10 leading-tight dark:text-white text-gray-800">{article.title}</h1>
        
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed font-serif italic text-lg whitespace-pre-wrap">
          {article.content}
        </div>
      </main>
    </div>
  )
}