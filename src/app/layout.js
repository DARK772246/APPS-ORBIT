import './globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
import Footer from '../components/Footer'
import InstallPrompt from '../components/InstallPrompt'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            <InstallPrompt />
            {/* AIK HI GLOBAL FOOTER */}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}