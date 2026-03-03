"use client"
import { useEffect, useState, use } from 'react'
import { supabase } from '../../../supabase'
import Link from 'next/link'
import { ArrowLeft, PenTool, Calendar, Share2, Sparkles } from 'lucide-react'
import Navbar from '../../../components/Navbar'

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
        document.title = `${data.title} - Orbit Insights`;
        const { data: more } = await supabase.from('articles').select('*').neq('id', data.id).limit(3)
        setMoreArticles(more || [])
      }
    }
    fetchArticle()
  }, [slug])

  if (!article) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-[#2ea64d] font-black animate-pulse italic uppercase tracking-[0.5em]">Syncing Insight...</div>

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-32">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 lg:pt-40">
        
        {/* ARTICLE HEADER CARD */}
        <div className="glass-panel p-4 rounded-[3rem] shadow-2xl mb-12 overflow-hidden relative group">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-transparent to-orange-500"></div>
           
           {article.image_url && (
             <div className="w-full aspect-video rounded-[2.5rem] overflow-hidden mb-8 shadow-inner">
               <img src={article.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
             </div>
           )}

           <div className="px-4 pb-4">
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-orange-500/10 text-orange-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic flex items-center gap-2 border border-orange-500/20">
                  <PenTool size={12}/> {article.author}
                </span>
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                  <Calendar size={12}/> {new Date(article.created_at).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-8 text-white">
                {article.title}
              </h1>

              {/* INTEGRATED AD SLOT */}
              <div className="my-10 w-full glass-panel min-h-[100px] rounded-[2rem] flex flex-col items-center justify-center p-4 border-dashed border-white/10">
                 <ins className="adsbygoogle" style={{ display: 'block', width: '100%' }} data-ad-client="ca-pub-6036065566084740" data-ad-slot="8880580760" data-ad-format="auto" data-full-width-responsive="true" />
                 <script dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }} />
              </div>

              {/* ARTICLE CONTENT */}
              <div className="prose prose-invert max-w-none text-gray-400 leading-relaxed font-medium italic text-lg whitespace-pre-wrap border-l-2 border-[#2ea64d] pl-8">
                {article.content}
              </div>
           </div>
        </div>

        {/* RELATED ARTICLES */}
        {moreArticles.length > 0 && (
          <section className="mt-32">
            <h3 className="text-2xl font-black uppercase italic text-white mb-10 tracking-widest border-l-4 border-orange-500 pl-6 flex items-center gap-3">
              More <span className="text-orange-500">Tech Logs</span> <Sparkles size={20} className="text-orange-500"/>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {moreArticles.map(m => (
                <Link key={m.id} href={`/blog/${m.slug}`} className="group glass-panel p-4 rounded-[2rem] hover:border-[#2ea64d] transition-all">
                  <div className="aspect-video rounded-2xl overflow-hidden mb-4 relative bg-white/5">
                    {m.image_url && <img src={m.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />}
                  </div>
                  <h4 className="font-black uppercase text-[12px] leading-tight dark:text-white group-hover:text-[#2ea64d] transition-colors">{m.title}</h4>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}