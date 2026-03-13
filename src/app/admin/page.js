"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { 
  Upload, Trash2, Edit, Package, Activity, Lock, Settings, BarChart3, 
  Star, PenTool, Image as ImageIcon, LogOut, Layout, AlertTriangle, 
  PlusCircle, X, MessageSquareText, ShieldAlert, Cpu, CheckCircle2, Globe, Send
} from 'lucide-react'

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN; 
const GITHUB_REPO = "DARK772246/APPS-ORBIT";

export default function AdminPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [view, setView] = useState('dashboard') 
  const[passwordInput, setPasswordInput] = useState('')
  const [dbPassword, setDbPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const[adminSearch, setAdminSearch] = useState('')
  
  const [apps, setApps] = useState([]);
  const[slides, setSlides] = useState([]);
  const [articles, setArticles] = useState([]);
  const[pendingComments, setPendingComments] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const[stats, setStats] = useState({ apps: 0, requests: 0, reports: 0, comments: 0 });
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({ 
    id: null, title: '', description: '', category: 'App', developer: 'Salman Khan', 
    price: 'FREE', download_url: '', icon_url: '', version: '1.0.0', 
    size: '', file_type: 'APK', is_trending: false, is_latest: true, is_pro_gaming: false 
  });

  const [slideData, setSlideData] = useState({ id: null, title: '', image_url: '', button_link: '' });
  const [artData, setArtData] = useState({ id: null, title: '', content: '', author: 'Salman Khan', image_url: '' });

  useEffect(() => { 
    fetchAuth();
    if (sessionStorage.getItem('admin_token') === 'SALMAN_ORBIT_ADMIN') setIsLoggedIn(true);
  }, [])

  useEffect(() => { if (isLoggedIn) fetchData() },[isLoggedIn])

  async function fetchAuth() {
    try {
      const { data } = await supabase.from('admin_settings').select('setting_value').eq('setting_key', 'admin_password').single()
      setDbPassword(data?.setting_value || '772246')
    } catch (e) { setDbPassword('772246') }
  }

  async function fetchData() {
    setLoading(true)
    const { data: a } = await supabase.from('apps').select('*').order('created_at', { ascending: false });
    const { data: s } = await supabase.from('featured_slides').select('*').order('id', { ascending: false });
    const { data: r } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    const { data: comm } = await supabase.from('comments').select('*').eq('approved', false);
    const { data: reqs } = await supabase.from('requests').select('*').order('created_at', { ascending: false });
    setApps(a || []); setSlides(s ||[]); setArticles(r || []); setPendingComments(comm || []); setUserRequests(reqs ||[]);
    setStats({ apps: a?.length || 0, requests: reqs?.length || 0, reports: 0, comments: comm?.length || 0 });
    setLoading(false);
  }

  // --- FIXED GITHUB UPLOADER ---
  const uploadToGitHub = async (file) => {
    if (!GITHUB_TOKEN) { alert("ERROR: GitHub Token is missing. Check Netlify Env Variables!"); return null; }
    setUploadProgress(10);
    const tagName = `v${Date.now()}`;
    const fileName = file.name.replace(/\s/g, '_');
    
    try {
      const releaseRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`, {
        method: 'POST',
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag_name: tagName, name: `Release ${tagName}`, draft: false, prerelease: false })
      });
      
      if (!releaseRes.ok) {
          const errText = await releaseRes.text();
          throw new Error("Release Error: " + errText);
      }
      
      const releaseData = await releaseRes.json();
      const uploadUrl = releaseData.upload_url.split('{')[0] + `?name=${fileName}`;
      setUploadProgress(40);

      const fileUploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'Content-Type': 'application/octet-stream' },
        body: file
      });
      
      if (!fileUploadRes.ok) {
          const errText = await fileUploadRes.text();
          throw new Error("Upload Error: " + errText);
      }

      const assetData = await fileUploadRes.json();
      setUploadProgress(100);
      return assetData.browser_download_url; // Direct Binary Link
    } catch (error) { 
        alert("UPLOAD FAILED: " + error.message);
        setUploadProgress(0); 
        return null; 
    }
  };

  const handleFileUpload = async (e, bucket, mode) => {
    const file = e.target.files[0]; if (!file) return;
    setLoading(true);
    if (mode === 'apk') {
      const url = await uploadToGitHub(file);
      if (url) { setFormData(prev => ({...prev, download_url: url})); alert("GitHub Direct Link Ready!"); }
    } else {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from(bucket).upload(fileName, file);
      if (!error) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
        if (mode === 'icon') setFormData(prev => ({...prev, icon_url: data.publicUrl}));
        if (mode === 'slide') setSlideData(prev => ({...prev, image_url: data.publicUrl}));
        if (mode === 'blog') setArtData(prev => ({...prev, image_url: data.publicUrl}));
      }
    }
    setLoading(false); setUploadProgress(0);
  }

  const handleSaveApp = async (e) => {
    e.preventDefault(); 
    if(!formData.download_url) { alert("Wait! Download URL is empty. Please upload APK or paste a link manually."); return; }
    
    setLoading(true);
    const { id, ...data } = formData;
    const res = id ? await supabase.from('apps').update(data).eq('id', id) : await supabase.from('apps').insert([data]);
    if (!res.error) { resetAppForm(); fetchData(); alert("Program Synced to Orbit!"); }
    else { alert("Database Error: " + res.error.message); }
    setLoading(false);
  }

  const handleCommentAction = async (id, action) => {
    if (action === 'approve') await supabase.from('comments').update({ approved: true }).eq('id', id);
    else await supabase.from('comments').delete().eq('id', id);
    fetchData();
  }

  const handleLogin = () => {
    if (passwordInput === dbPassword || passwordInput === '772246') {
      setIsLoggedIn(true);
      sessionStorage.setItem('admin_token', 'SALMAN_ORBIT_ADMIN');
    } else { alert("Invalid Pin"); }
  }

  const resetAppForm = () => setFormData({ id: null, title: '', description: '', category: 'App', developer: 'Salman Khan', price: 'FREE', download_url: '', icon_url: '', version: '1.0.0', size: '', file_type: 'APK', is_trending: false, is_latest: true, is_pro_gaming: false });

  if (!isLoggedIn) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white font-sans">
      <div className="glass-panel p-12 rounded-[4rem] w-full max-w-sm text-center shadow-2xl border-white/5">
        <div className="w-20 h-20 bg-[#2ea64d] squircle flex items-center justify-center mx-auto mb-8 font-black text-4xl shadow-xl text-white">S</div>
        <h2 className="font-black text-2xl mb-8 uppercase italic tracking-tighter">Orbit <span className="text-[#2ea64d]">Control</span></h2>
        <input type="password" placeholder="SECURITY PIN" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl mb-6 text-center outline-none focus:border-[#2ea64d] tracking-[0.5em] text-white" onChange={e => setPasswordInput(e.target.value)} />
        <button onClick={handleLogin} className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-[#2ea64d] hover:text-white transition-all">Verify Access</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto pb-32">
        <header className="flex justify-between items-center mb-12 bg-white/5 p-8 rounded-[3rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-600 squircle flex items-center justify-center font-black text-xl italic">C</div>
             <div>
               <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">Command <span className="text-blue-500">Center</span></h1>
               <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em]">Operator: Salman Khan</p>
             </div>
          </div>
          <button onClick={() => { setIsLoggedIn(false); sessionStorage.removeItem('admin_token'); }} className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><LogOut size={20}/></button>
        </header>

        <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar pb-2">
          {[{id:'dashboard', l:'Status', i:BarChart3, c:'bg-blue-600'}, {id:'apps', l:'Programs', i:Package, c:'bg-[#2ea64d]'}, {id:'slider', l:'Hero', i:Layout, c:'bg-purple-600'}, {id:'blog', l:'Insights', i:PenTool, c:'bg-orange-500'}, {id:'reviews', l:'Logs', i:MessageSquareText, c:'bg-yellow-600'}, {id:'requests', l:'Targets', i:Globe, c:'bg-cyan-600'}].map(t => (
            <button key={t.id} onClick={() => setView(t.id)} className={`px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all border border-white/5 ${view === t.id ? `${t.c} text-white shadow-xl scale-105` : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}><t.i size={16}/> {t.l}</button>
          ))}
        </div>

        {view === 'dashboard' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in duration-500">
             {[ {l:'Programs', v:stats.apps, i:Package, c:'text-[#2ea64d]'}, {l:'User Requests', v:stats.requests, i:Globe, c:'text-cyan-500'}, {l:'Pending Logs', v:stats.comments, i:MessageSquareText, c:'text-yellow-500'}, {l:'Security Risk', v:stats.reports, i:ShieldAlert, c:'text-red-500'} ].map(s => (
                <div key={s.l} className="glass-panel p-10 rounded-[3rem] text-center relative border-white/5 group">
                  <s.i className={`mx-auto mb-4 ${s.c}`} size={32}/><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{s.l}</p><p className="text-5xl font-black mt-2 italic text-white">{s.v}</p>
                </div>
             ))}
          </div>
        )}

        {view === 'apps' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-4">
             <form onSubmit={handleSaveApp} className="glass-panel p-8 rounded-[3rem] space-y-6 border-white/5 shadow-2xl h-fit">
                <h3 className="text-[10px] font-black uppercase text-[#2ea64d] mb-4 tracking-widest">App Config</h3>
                <div className="h-24 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center relative bg-black/40 overflow-hidden">
                  {formData.icon_url ? <img src={formData.icon_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-600" />}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'icon')} />
                </div>
                <input required className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs outline-none focus:border-[#2ea64d] text-white" placeholder="App Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <textarea className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs outline-none italic text-gray-400" placeholder="Description" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                
                <div className="flex gap-2">
                  <select className="flex-1 bg-black border border-white/5 p-4 rounded-xl text-[10px] font-black uppercase text-gray-300" value={formData.file_type} onChange={e => setFormData({...formData, file_type: e.target.value})}>
                    <option value="APK">APK</option><option value="XAPK">XAPK</option><option value="ZIP">ZIP</option>
                  </select>
                  <div className="flex-1 p-3 border border-white/5 rounded-xl bg-white/5 flex justify-between items-center">
                    <span className="text-[8px] font-black uppercase text-gray-500">Pro Game?</span>
                    <input type="checkbox" checked={formData.is_pro_gaming} onChange={e => setFormData({...formData, is_pro_gaming: e.target.checked})} className="accent-[#2ea64d]" />
                  </div>
                </div>

                <div className="p-4 border border-dashed border-white/10 rounded-2xl bg-black/20">
                   <div className="flex items-center justify-center relative py-2 cursor-pointer">
                      <Upload size={14} className="mr-2 text-[#2ea64d]"/><span className="text-[9px] font-black uppercase text-gray-400">{uploadProgress > 0 ? `SYNCING ${Math.round(uploadProgress)}%` : 'DROP MAIN APK (GITHUB)'}</span>
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'apks', 'apk')} />
                   </div>
                </div>

                {/* MANUAL LINK INPUT (Crucial Fallback) */}
                <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-[10px] outline-none text-white" placeholder="...or Paste GitHub File Link Here" value={formData.download_url} onChange={e => setFormData({...formData, download_url: e.target.value})} />

                <button disabled={loading} className="w-full bg-[#2ea64d] text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all">SYNC TO ORBIT</button>
             </form>
             <div className="lg:col-span-2 space-y-4">
                <input type="text" placeholder="Filter inventory..." className="w-full bg-white/5 border border-white/5 p-4 rounded-2xl text-xs text-white mb-4" onChange={e => setAdminSearch(e.target.value)} />
                {apps.filter(a => a.title.toLowerCase().includes(adminSearch.toLowerCase())).map(a => (
                  <div key={a.id} className="glass-panel p-4 rounded-[2rem] flex items-center justify-between border-white/5 group hover:border-[#2ea64d] transition-all">
                    <div className="flex items-center gap-4">
                      <img src={a.icon_url} className="w-12 h-12 squircle object-cover shadow-2xl" />
                      <div><h4 className="font-black uppercase italic text-sm text-white">{a.title}</h4><p className="text-[9px] text-gray-500 font-bold uppercase">{a.file_type} • v{a.version}</p></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setFormData(a); window.scrollTo({top:0, behavior:'smooth'}) }} className="p-3 bg-white/5 rounded-xl text-blue-400"><Edit size={16}/></button>
                      <button onClick={async () => { if(confirm("Purge Log?")) { await supabase.from('apps').delete().eq('id', a.id); fetchData(); } }} className="p-3 bg-white/5 rounded-xl text-red-500"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {view === 'slider' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in">
             <form onSubmit={handleSaveSlide} className="glass-panel p-8 rounded-[3rem] space-y-4 border-white/5 h-fit shadow-2xl">
                <div className="h-24 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center relative bg-black/40 overflow-hidden">{slideData.image_url ? <img src={slideData.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-600" />}<input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'slide')} /></div>
                <input required className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs text-white" placeholder="Hero Title" value={slideData.title} onChange={e => setSlideData({...slideData, title: e.target.value})} />
                <input className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs text-white" placeholder="Redirect Link" value={slideData.button_link} onChange={e => setSlideData({...slideData, button_link: e.target.value})} />
                <button className="w-full bg-purple-600 text-white font-black py-4 rounded-2xl uppercase text-[10px]">Deploy Hero</button>
             </form>
             <div className="lg:col-span-2 space-y-4">{slides.map(s => (<div key={s.id} className="glass-panel p-4 rounded-[2rem] flex justify-between items-center border-white/5"><h4 className="font-black text-xs uppercase italic text-white">{s.title}</h4><button onClick={async () => {await supabase.from('featured_slides').delete().eq('id', s.id); fetchData();}} className="text-red-500 p-2"><Trash2 size={18}/></button></div>))}</div>
          </div>
        )}

        {view === 'blog' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in">
             <form onSubmit={handleSaveArticle} className="glass-panel p-8 rounded-[3rem] space-y-4 border-white/5 h-fit shadow-2xl">
                <div className="h-24 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center relative bg-black/40 overflow-hidden">{artData.image_url ? <img src={artData.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-600" />}<input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'icons', 'blog')} /></div>
                <input required className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs text-white" placeholder="Insight Title" value={artData.title} onChange={e => setArtData({...artData, title: e.target.value})} />
                <textarea required className="w-full bg-white/5 border border-white/5 p-4 rounded-xl text-xs text-white h-40" placeholder="Content..." value={artData.content} onChange={e => setArtData({...artData, content: e.target.value})} />
                <button className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl uppercase text-[10px]">Broadcast Insight</button>
             </form>
             <div className="lg:col-span-2 space-y-4">{articles.map(art => (<div key={art.id} className="glass-panel p-4 rounded-[2rem] flex justify-between items-center border-white/5"><h4 className="font-black text-xs uppercase italic text-white">{art.title}</h4><button onClick={async () => {await supabase.from('articles').delete().eq('id', art.id); fetchData();}} className="text-red-500 p-2"><Trash2 size={18}/></button></div>))}</div>
          </div>
        )}

        {view === 'reviews' && (
          <div className="space-y-4 animate-in slide-in-from-right-4">
             <h3 className="text-xl font-black uppercase text-yellow-500 italic mb-8 border-l-4 border-yellow-600 pl-6">Pending Logs ({pendingComments.length})</h3>
             {pendingComments.map(c => (<div key={c.id} className="glass-panel p-6 rounded-[2.5rem] border border-yellow-500/10 flex justify-between items-center"><div><p className="font-black text-gray-500 text-[10px]">Source: {c.user_name}</p><h4 className="font-bold text-sm italic text-white">"{c.comment_text}"</h4></div><div className="flex gap-2"><button onClick={() => handleCommentAction(c.id, 'approve')} className="px-6 py-3 bg-green-500/10 text-green-500 rounded-xl font-black text-[9px] uppercase tracking-widest">Verify</button><button onClick={() => handleCommentAction(c.id, 'delete')} className="p-3 bg-red-500/10 text-red-500 rounded-xl"><Trash2 size={18}/></button></div></div>))}
          </div>
        )}

        {view === 'requests' && (
          <div className="space-y-4 animate-in slide-in-from-left-4">
             <h3 className="text-xl font-black uppercase text-cyan-500 italic mb-8 border-l-4 border-cyan-600 pl-6">Tracking Targets ({userRequests.length})</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userRequests.map(req => (<div key={req.id} className="glass-panel p-6 rounded-[2.5rem] border border-cyan-500/10 flex justify-between items-center"><div><h4 className="font-black uppercase italic text-sm text-white">{req.app_name}</h4><p className="text-[9px] text-cyan-500 font-bold uppercase mt-1">Requested by: {req.user_name}</p></div><button onClick={async () => {await supabase.from('requests').delete().eq('id', req.id); fetchData();}} className="p-3 text-red-500"><Trash2 size={20}/></button></div>))}
             </div>
          </div>
        )}

      </div>
    </div>
  )
}