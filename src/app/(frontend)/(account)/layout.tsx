import type { ReactNode } from 'react'

import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  return (
    <div>
      <div className="container">RenderParams</div>

      <div className="container mt-16 pb-8 flex gap-8">
        {user && 'AccountNav '}

        <div className="flex flex-col gap-12 grow">{children}</div>
      </div>
    </div>
  )
}
