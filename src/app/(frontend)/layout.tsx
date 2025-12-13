import React from 'react'
import './styles.css'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/providers/Auth'

export const metadata = {
  title: 'Payload Blank Template',
  description: 'A blank template using Payload in a Next.js app.',
}

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background text-foreground antialiased font-sans',
          fontSans.variable,
        )}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />

            <main className="pt-20 container mx-auto">{children}</main>

            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
