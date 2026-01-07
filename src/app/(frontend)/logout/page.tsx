// app/logout/page.tsx
import LogoutClient from './LogoutClient'
import { Suspense } from 'react'

export default function LogoutPageWrapper() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <LogoutClient />
    </Suspense>
  )
}
