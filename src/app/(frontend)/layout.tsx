import React from 'react'
import './styles.css'
import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/providers/Auth'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Здесь оборачиваем Header */}
            <Suspense fallback={<div>Loading header…</div>}>
              <Header />
            </Suspense>

            <main className="pt-20 mx-auto">{children}</main>

            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
