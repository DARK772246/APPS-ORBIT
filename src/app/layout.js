import './globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
import Footer from '../components/Footer'
// Import InstallPrompt is removed because the component was deleted
import Script from 'next/script'
import { MessageCircle } from 'lucide-react'
// import BottomNav from '../components/BottomNav' // <-- IMPORT REMOVED

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
    // THEME LOCKED TO DARK MODE
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <meta name="google-site-verification" content="NhPDdeUA4e58lgelt3il5KTAcy-yNYUK88xRZlo8l9k" />
        <meta name="google-adsense-account" content="ca-pub-6036065566084740" />
        
        {/* 1. MAIN GOOGLE ADSENSE SCRIPT */}
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6036065566084740"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {/* 2. AD BLOCKING RECOVERY SCRIPT */}
        <Script 
          async 
          src="https://fundingchoicesmessages.google.com/i/pub-6036065566084740?ers=1" 
          strategy="afterInteractive"
        />

        {/* 3. AD BLOCKING SIGNAL & INITIALIZATION */}
        <Script id="ad-block-signal" strategy="afterInteractive">
          {`
            (function() {
              function signalGooglefcPresent() {
                if (!window.frames['googlefcPresent']) {
                  if (document.body) {
                    const iframe = document.createElement('iframe');
                    iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';
                    iframe.style.display = 'none';
                    iframe.name = 'googlefcPresent';
                    document.body.appendChild(iframe);
                  } else {
                    setTimeout(signalGooglefcPresent, 0);
                  }
                }
              }
              signalGooglefcPresent();
            })();
          `}
        </Script>

        {/* 4. INTERSTITIAL/OVERLAY AD SCRIPT (FOR MAX EARNING) */}
        <Script
          id="adsense-interstitial"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6036065566084740"
          strategy="afterInteractive"
        >
          {`
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "ca-pub-6036065566084740",
              enable_page_level_ads: true,
              overlays: { bottom: true } 
            });
          `}
        </Script>


        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#24cd77" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>

      <body className="antialiased bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="flex flex-col min-h-screen">
            
            <main className="flex-grow">
              {children}
            </main>
            
            <Footer />
            
            {/* --- Custom Install Button --- */}
            <button 
              id="install-app-button" 
              style={{ display: 'none' }} 
              className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[205] bg-white text-[#2ea64d] px-8 py-3 rounded-full text-[10px] font-black uppercase shadow-2xl border-2 border-[#2ea64d] hover:scale-105 active:scale-95 transition-transform hidden lg:flex items-center gap-2"
            >
                💾 Install AppOrbit PWA {/* ICON REPLACED WITH EMOJI */}
            </button>
            {/* --- END NEW BUTTON --- */}

            <a 
              href="https://wa.me/923275176283" 
              target="_blank" 
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-[200] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center gap-2 group border border-white/20"
            >
              <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-[10px] font-black uppercase whitespace-nowrap px-1">Support</span>
              <MessageCircle size={24}/>
            </a>

            {/* NEW PWA INSTALL LOGIC SCRIPT */}
            <Script id="pwa-installer" strategy="afterInteractive">
              {`
                let deferredPrompt;
                const installButton = document.getElementById('install-app-button');

                window.addEventListener('beforeinstallprompt', (e) => {
                  e.preventDefault();
                  deferredPrompt = e;
                  if (installButton) {
                    installButton.style.display = 'flex'; // Show Custom Button
                  }
                });

                if (installButton) {
                  installButton.addEventListener('click', async () => {
                    if (deferredPrompt) {
                      deferredPrompt.prompt();
                      const { outcome } = await deferredPrompt.userChoice;
                      console.log('User response to the install prompt:', outcome);
                      deferredPrompt = null;
                      installButton.style.display = 'none'; 
                    }
                  });
                }
              `}
            </Script>

            {/* PWA Service Worker Registration */}
            <Script id="pwa-sw" strategy="afterInteractive">
              {`
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js');
                  });
                }
              `}
            </Script>

          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}