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

        {/* 4. ERROR PROTECTION MESSAGE (Optional but added for safety) */}
        <Script id="ad-error-protection" strategy="afterInteractive">
          {`
            (function(){'use strict';function aa(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}}var ba=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,b,c){if(a==Array.prototype||a==Object.prototype)return a;a[b]=c.value;return a};function ca(a){a=["object"==typeof globalThis&&globalThis,a,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global];for(var b=0;b<a.length;++b){var c=a[b];if(c&&c.Math==Math)return c}throw Error("Cannot find global object");}var da=ca(this);function l(a,b){if(b)a:{var c=da;a=a.split(".");for(var d=0;d<a.length-1;d++){var e=a[d];if(!(e in c))break a;c=c[e]}a=a[a.length-1];d=c[a];b=b(d);b!=d&&b!=null&&ba(c,a,{configurable:!0,writable:!0,value:b})}}})();
            window.__h82AlnkH6D91__("WyJwdWItNjAzNjA2NTU2NjA4NDc0MCIsW251bGwsbnVsbCxudWxsLCJodHRwczovL2Z1bmRpbmdjaG9pY2VzbWVzc2FnZXMuZ29vZ2xlLmNvbS9iL3B1Yi02MDM2MDY1NTY2MDg0NzQwIl0sbnVsbCxudWxsLCJodHRwczovL2Z1bmRpbmdjaG9pY2VzbWVzc2FnZXMuZ29vZ2xlLmNvbS9lbC9BR1NLV3hXSkczdHpWaEc4Z3kwSmR1cktoVXQ5VXZyZlp3dXhkdlo2MTNmbWpqQjlhMHN4eUpRdU1MaFE3MUVuQl9BejVFVmFjTUxkd2ZTaUQ5RUtIbkhsM1d1NGpnXHUwMDNkXHUwMDNkP3RlXHUwMDNkVE9LRU5fRVhQT1NFRCIsImh0dHBzOi8vZnVuZGluZ2Nob2ljZXNtZXNzYWdlcy5nb29nbGUuY29tL2VsL0FHU0tXeFVjYTBxelFaVkhmS0ZYVkdnNF9lc0k5TzlhT0JhNGxUZmNQdTl6R0ZBSXpUNy0wUDNrLWgwMlZ2NE0wY082bV9Xek1neUQxRGUwQndDRXp4cml4c2NxTGdcdTAwM2RcdTAwM2Q/YWJcdTAwM2QxXHUwMDI2c2JmXHUwMDNkMSIsImh0dHBzOi8vZnVuZGluZ2Nob2ljZXNtZXNzYWdlcy5nb29nbGUuY29tL2VsL0FHU0tXeFZ2RGV3UUo5SmZubFJ5aDB2SGt5cmlPZ29jM1ZhOVg5bkVHNGFoRUx2LW1hV2tDMEc5LWdFMVhhTDZYSXQyN25GbnA4T1UzMEpFaUhTVzA4aWpXV2ExYUFcdTAwM2RcdTAwM2Q/YWJcdTAwM2QyXHUwMDI2c2JmXHUwMDNkMSIsImh0dHBzOi8vZnVuZGluZ2Nob2ljZXNtZXNzYWdlcy5nb29nbGUuY29tL2VsL0FHU0tXeFVUUy1hcERUZkl2a2tVcmpLY19zYjY3WW5pQ3JnWGI2VnZKV1RLMHpjQlFiR2JDOTRzNkRwMlNZRTY4cjIzalExTmRWcFU4SlJ2dl9QeE1mWGRiNGRkQndcdTAwM2RcdTAwM2Q/c2JmXHUwMDNkMiIsImRpdi1ncHQtYWQiLDIwLDEwMCwiY0hWaUxUWXdNell3TmpVMU5qWXdPRFEzTkRBXHUwMDNkIixbbnVsbCxudWxsLG51bGwsImh0dHBzOi8vd3d3LmdzdGF0aWMuY29tLzBlbW4vZi9wL3B1Yi02MDM2MDY1NTY2MDg0NzQwLmpzP3VzcXBcdTAwM2RDQTgiXSwiaHR0cHM6Ly9mdW5kaW5nY2hvaWNlc21lc3NhZ2VzLmdvb2dsZS5jb20vZWwvQUdTS1d4V0gzOUlpZ1VFR3BVZzlKRjRFdXFWdy0zcU9oTl82NXBCU2dOQ3Ntd294dC1SS21YcHE4a25JNklIcmFBTmtIcW5NbVM4TTduOW9iQ2k5VktLZWQ4blNNUVx1MDAzZFx1MDAzZCJd");
          `}
        </Script>

        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#24cd77" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>

      <body className="antialiased bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex flex-col min-h-screen">
            
            <main className="flex-grow">
              {children}
            </main>
            
            <InstallPrompt />
            <Footer />

            <a 
              href="https://wa.me/923275176283" 
              target="_blank" 
              rel="noopener noreferrer"
              className="fixed bottom-6 right-6 z-[200] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center gap-2 group border border-white/20"
            >
              <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-[10px] font-black uppercase whitespace-nowrap px-1">Support</span>
              <MessageCircle size={24}/>
            </a>

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
