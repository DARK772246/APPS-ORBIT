import './globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
import Footer from '../components/Footer'
import InstallPrompt from '../components/InstallPrompt'
import Script from 'next/script'
import { MessageCircle } from 'lucide-react'

// SEO aur PWA Metadata
export const metadata = {
  title: 'Salman AppOrbit | Premium App Store',
  description: 'Verified Android Mods by Salman Khan. Fast, Secure, and Affordable.',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Salman AppOrbit',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 1. NEW GOOGLE SEARCH CONSOLE VERIFICATION (HTTPS Version) */}
        <meta name="google-site-verification" content="NhPDdeUA4e58lgelt3il5KTAcy-yNYUK88xRZlo8l9k" />

        {/* 2. GOOGLE ADSENSE META TAG */}
        <meta name="google-adsense-account" content="ca-pub-60360655566084740" />

        {/* 3. GOOGLE ADSENSE SCRIPT */}
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-60360655566084740"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {/* 4. PWA & Theme Settings */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#24cd77" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        
        {/* 5. PWA Service Worker Registration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `
        }} />
      </head>

      <body className="antialiased bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex flex-col min-h-screen">
            
            {/* Main Website Pages Content */}
            <main className="flex-grow">
              {children}
            </main>
            
            {/* Floating Install App Prompt (PWA) */}
            <InstallPrompt />

            {/* Professional Footer with Links */}
            <Footer />

            {/* Floating WhatsApp Support Button */}
            <a 
              href="https://wa.me/923275176283" 
              target="_blank" 
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-[200] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center gap-2 group"
            >
              <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-[10px] font-black uppercase whitespace-nowrap px-1 text-white">Support</span>
              <MessageCircle size={24}/>
            </a>

          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}