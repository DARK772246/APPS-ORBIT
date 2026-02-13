"use client"
import { useEffect, useState, use } from 'react'
import { supabase } from '../../../supabase'
import Link from 'next/link'
import { ArrowLeft, PenTool } from 'lucide-react'
// ThemeToggle import removed (Final Cleanup)

export default function BlogPost({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const slug = params.slug
  const [article, setArticle] = useState(null)
  const [moreArticles, setMoreArticles] = useState([])

  useEffect(() => {
    async function fetchArticle() {
      const { data } = await supabase.from('articles').select('*').eq('slug', slug).single()
      if (data) {
        setArticle(data)
        document.title = `${data.title} - Salman AppOrbit`
        const { data: more } = await supabase.from('articles').select('*').neq('id', data.id).limit(3)
        setMoreArticles(more || [])
      }
    }
    fetchArticle()
  }, [slug])

  if (!article) return <div className="min-h-screen bg-black flex items-center justify-center text-[#2ea64d] font-bold animate-pulse uppercase tracking-widest">Syncing with Orbit...</div>

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-gray-900 dark:text-white font-sans transition-colors pb-20">
      
      {/* NAVBAR */}
      <nav className="p-4 border-b border-gray-100 dark:border-white/5 sticky top-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md z-50 px-6 flex justify-between">
        <Link href="/" className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-2 hover:text-[#2ea64d]"><ArrowLeft size={14}/> Back</Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* ARTICLE HEADER */}
        {article.image_url && (
          <div className="w-full aspect-video rounded-[3rem] overflow-hidden shadow-2xl border dark:border-white/5 mb-12 bg-gray-200 dark:bg-[#111]">
            <img src={article.image_url} alt="" className="w-full h-full object-cover shadow-inner" />
          </div>
        )}

        {/* --- AD SLOT: Orbit_Blog_Ad (ID: 8880580760) --- */}
        <div className="my-8 w-full flex justify-center">
             <div className="min-h-[100px] w-full bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center overflow-hidden">
                 <ins 
                    className="adsbygoogle"
                    style={{ display: 'block', width: '100%' }}
                    data-ad-client="ca-pub-6036065566084740" 
                    data-ad-slot="8880580760" 
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                  />
                 <script dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }} />
             </div>
        </div>
        {/* ------------------------------------------ */}

        <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-400">
          <span className="bg-[#2ea64d]/10 text-[#2ea64d] px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic"><PenTool size={12} className="inline mr-2"/> {article.author}</span>
          <span className="text-[10px] font-black uppercase tracking-widest italic">{new Date(article.created_at).toLocaleDateString()}</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-12 leading-tight dark:text-white text-gray-800">
          {article.title}
        </h1>
        
        {/* MAIN CONTENT */}
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed font-serif italic text-lg whitespace-pre-wrap border-l-2 border-[#2ea64d] pl-6 mb-20">
          {article.content}
        </div>

        {/* RELATED ARTICLES */}
        {moreArticles.length > 0 && (
          <section className="mt-32 pt-16 border-t dark:border-white/5">
            <h3 className="text-xl font-black uppercase italic text-[#2ea64d] mb-10 tracking-widest border-l-4 border-[#2ea64d] pl-4">More Tech Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {moreArticles.map(m => (
                <Link key={m.id} href={`/blog/${m.slug}`} className="group flex flex-col bg-white dark:bg-[#111] p-4 rounded-3xl border dark:border-white/5 hover:border-[#2ea64d] transition-all">
                  <div className="aspect-video rounded-2xl overflow-hidden mb-4 relative bg-black/20 shadow-sm">
                    {m.image_url && <img src={m.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />}
                  </div>
                  <h4 className="font-black uppercase text-[13px] leading-tight group-hover:text-[#2ea64d] transition-colors">{m.title}</h4>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}