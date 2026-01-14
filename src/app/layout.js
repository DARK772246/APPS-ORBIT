import './globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
import Footer from '../components/Footer'
import InstallPrompt from '../components/InstallPrompt'
import Script from 'next/script' // Zaroori import

export const metadata = {
  title: 'Salman AppOrbit | Professional Android Solutions',
  description: 'Verified premium Android programs and tech insights by Salman Khan.',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 1. GOOGLE ADSENSE META TAG */}
        <meta name="google-adsense-account" content="ca-pub-6036065566084740" />

        {/* 2. GOOGLE ADSENSE SCRIPT */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6036065566084740"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        <meta name="theme-color" content="#24cd77" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>

      <body className="antialiased bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">{children}</main>
            <InstallPrompt />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}