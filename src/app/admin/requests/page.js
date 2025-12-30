"use client"
import { useEffect, useState } from 'react'
import { supabase } from '../../../supabase'
import { CheckCircle, Clock, Trash2, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminRequests() {
  const [reqs, setReqs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchReqs() }, [])

  async function fetchReqs() {
    setLoading(true)
    const { data } = await supabase.from('requests').select('*').order('created_at', { ascending: false })
    if (data) setReqs(data)
    setLoading(false)
  }

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase.from('requests').update({ status: newStatus }).eq('id', id)
    if (!error) fetchReqs()
  }

  const deleteReq = async (id) => {
    if(confirm("Delete request?")) {
      await supabase.from('requests').delete().eq('id', id)
      fetchReqs()
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black uppercase italic text-[#2ea64d]">Request Manager</h1>
          <Link href="/admin" className="text-xs font-bold flex items-center gap-2 text-gray-500 hover:text-white transition-all"><ArrowLeft size={14}/> Back to Control Center</Link>
        </div>

        {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#2ea64d]" /></div> : (
          <div className="space-y-4">
            {reqs.map(r => (
              <div key={r.id} className="bg-[#111] p-6 rounded-[2rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 group hover:border-[#2ea64d]/30 transition-all">
                <div className="text-center md:text-left">
                  <h3 className="font-black uppercase text-sm tracking-tight">{r.app_name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase mt-1">Requested by: <span className="text-gray-300">{r.user_name}</span></p>
                  <div className={`inline-block mt-3 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${r.status === 'Added ✅' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    Status: {r.status}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(r.id, 'Added ✅')} className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all" title="Mark as Added"><CheckCircle size={18}/></button>
                  <button onClick={() => updateStatus(r.id, 'Searching...')} className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all" title="Mark as Searching"><Clock size={18}/></button>
                  <button onClick={() => deleteReq(r.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}