import type { ReactNode } from 'react'

import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <div className="min-h-[70vh]">
      <div className="container mx-auto pt-24 pb-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* SIDEBAR */}
          {user && (
            <aside
              className="
                w-full lg:w-64 shrink-0
                rounded-2xl
                border border-border/60
                bg-background/70
                backdrop-blur-md
                supports-[backdrop-filter]:bg-background/50
                shadow-sm
                p-5
                h-fit
              "
            >
              <h2 className="text-sm font-semibold text-muted-foreground mb-4">Меню</h2>

              {/* AccountNav */}
              <nav className="flex flex-col gap-2">
                {/* сюда подключишь AccountNav */}
                <span className="text-sm text-muted-foreground">AccountNav</span>
              </nav>
            </aside>
          )}

          {/* CONTENT */}
          <main className="flex-1">
            <div
              className="
                rounded-2xl
                border border-border/60
                bg-background/70
                backdrop-blur-md
                supports-[backdrop-filter]:bg-background/50
                shadow-sm
                p-4 sm:p-6
              "
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
