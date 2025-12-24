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
      <div className="container mx-auto pb-16">
        {/* CONTENT */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
