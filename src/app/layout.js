import './globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
import Footer from '../components/Footer'
import InstallPrompt from '../components/InstallPrompt'
import Script from 'next/script'

export const metadata = {
  title: 'Salman AppOrbit | Premium Store',
  description: 'Verified Android programs by Salman Khan.',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-60360655566084740" crossorigin="anonymous" strategy="afterInteractive" />
      </head>
      <body className="antialiased bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300">
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