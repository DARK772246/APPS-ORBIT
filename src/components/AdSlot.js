"use client"
export default function AdSlot({ label = "Advertisement" }) {
  return (
    <div className="w-full my-8 p-4 bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center min-h-[150px]">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">{label}</span>
      {/* Jab AdSense approve ho jaye, toh uska code yahan ayega */}
      <div className="text-gray-500 italic text-xs uppercase font-bold opacity-30">Place Your Ad Here</div>
    </div>
  )
}