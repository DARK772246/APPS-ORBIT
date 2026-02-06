export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-800 dark:text-gray-300 p-8 md:p-20 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-[#2ea64d] mb-8 uppercase italic italic">About Salman AppOrbit</h1>
        <p className="text-lg leading-relaxed mb-6">
          Welcome to <span className="font-bold text-[#2ea64d]">Salman AppOrbit</span>, your number one source for all premium and verified Android applications. We're dedicated to giving you the very best of mobile software, with a focus on security, performance, and community support.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          Founded in 2025 by <span className="font-bold text-blue-500">Salman Khan</span>, Salman AppOrbit has come a long way from its beginnings in Pakistan. When Salman first started out, his passion for providing affordable premium tech drove him to build a secure ecosystem so that everyone can enjoy high-quality apps without high costs.
        </p>
        <div className="bg-gray-100 dark:bg-white/5 p-8 rounded-3xl border-l-8 border-[#2ea64d] mt-10">
          <h3 className="font-black uppercase mb-2">Our Mission</h3>
          <p className="italic font-medium">"To empower the Android community by providing manually verified, safe, and high-performance software versions for educational and professional use."</p>
        </div>
      </div>
    </div>
  )
}