import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AccountPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect(
      `/login?warning=${encodeURIComponent('Please login to access your account settings.')}`,
    )
  }

  return (
    <div className="container mx-auto max-w-2xl pt-24 pb-20">
      <Card className="border-border bg-card/60 backdrop-blur-md shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Настройки аккаунта</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-medium">{user.id}</span>
            </div>

            <Separator />

            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{user.email}</span>
            </div>

            {user.username && (
              <>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Username:</span>
                  <span className="font-medium">{user.username}</span>
                </div>
              </>
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" asChild>
              <Link href="/">← На главную</Link>
            </Button>

            <Button variant="destructive" asChild>
              <Link href="/logout">Выйти</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
