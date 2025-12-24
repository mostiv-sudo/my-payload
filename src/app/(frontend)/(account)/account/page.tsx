import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'

import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { User, Mail, LogOut, ArrowLeft, Star, Bookmark as BookmarkIcon, Eye } from 'lucide-react'

export default async function AccountPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user }: any = await payload.auth({ headers })

  if (!user) return null

  // Получаем закладки пользователя
  const bookmarks = await payload.find({
    collection: 'bookmarks',
    where: { user: { equals: user.id } },
    depth: 1,
  })

  // Получаем оценки пользователя
  const ratings = await payload.find({
    collection: 'ratings',
    where: { user: { equals: user.id } },
    depth: 1,
  })

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* USER INFO */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-bold mb-2">Информация о пользователе</h2>
        <InfoRow icon={<User size={16} />} label="ID пользователя" value={user.id.toString()} />
        <Separator />
        <InfoRow icon={<Mail size={16} />} label="Email" value={user.email} />
        {user.username && (
          <>
            <Separator />
            <InfoRow icon={<User size={16} />} label="Имя пользователя" value={user.username} />
          </>
        )}
      </Card>

      {/* RATINGS */}
      <Card className="border-none shadow-none p-0 bg-transparent">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Star size={20} /> Ваши оценки
        </h2>
        {ratings.docs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Вы ещё не оценивали аниме.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ratings.docs.map((r: any) => (
              <Card key={r.id} className="p-4 flex flex-col gap-2">
                <Link href={`/anime/${r.anime?.slug}`}>
                  <h3 className="font-semibold hover:underline">{r.anime?.title}</h3>
                </Link>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 w-4 h-4" />
                  <span>{r.rating}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* BOOKMARKS */}
      <Card className="border-none shadow-none p-0 bg-transparent">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <BookmarkIcon size={20} /> Ваши закладки
        </h2>
        {bookmarks.docs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Вы ещё не добавляли аниме в закладки.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.docs.map((b: any) => (
              <Card key={b.id} className="p-4 flex flex-col gap-2">
                <Link href={`/anime/${b.anime?.slug}`}>
                  <h3 className="font-semibold hover:underline">{b.anime?.title}</h3>
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {b.status === 'planned' && (
                    <>
                      <BookmarkIcon className="w-4 h-4" /> Запланировано
                    </>
                  )}
                  {b.status === 'completed' && (
                    <>
                      <Eye className="w-4 h-4" /> Просмотрено
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Button variant="outline" asChild className="gap-2">
          <Link href="/">
            <ArrowLeft size={16} />
            На главную
          </Link>
        </Button>

        <Button variant="destructive" asChild className="gap-2">
          <Link href="/logout">
            <LogOut size={16} />
            Выйти
          </Link>
        </Button>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
