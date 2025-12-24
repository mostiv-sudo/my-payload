'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

type Props = {
  animeId: string
}

export function AnimeRatingDialog({ animeId }: Props) {
  const [value, setValue] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('/api/users/me', { credentials: 'include' })
        if (!res.ok) return
        const data = await res.json()
        if (data.user?.id) setUserId(data.user.id)
      } catch {}
    }
    loadUser()
  }, [])

  useEffect(() => {
    if (!userId) return
    const loadRating = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/ratings?where[user][equals]=${userId}&where[anime][equals]=${animeId}&limit=1`,
          { credentials: 'include' },
        )
        const data = await res.json()
        if (data?.docs?.length) setValue(data.docs[0].rating)
      } catch {}
    }
    loadRating()
  }, [userId, animeId])

  const submitRating = async (rating: number) => {
    if (!userId) return alert('Сначала войдите в аккаунт')
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/ratings?where[user][equals]=${userId}&where[anime][equals]=${animeId}&limit=1`,
        { credentials: 'include' },
      )
      const data = await res.json()

      if (data.docs.length > 0) {
        await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/ratings/${data.docs[0].id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating }),
        })
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/ratings`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ anime: animeId, user: userId, rating }),
        })
      }
      setValue(rating)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const deleteRating = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/ratings?where[user][equals]=${userId}&where[anime][equals]=${animeId}&limit=1`,
        { credentials: 'include' },
      )
      const data = await res.json()
      if (data.docs.length > 0) {
        await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/ratings/${data.docs[0].id}`, {
          method: 'DELETE',
          credentials: 'include',
        })
      }
      setValue(null)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const getTextColor = (n: number) => {
    if (value === n) {
      if (n <= 3) return 'text-red-500 dark:text-red-600'
      if (n <= 6) return 'text-yellow-400 dark:text-yellow-500'
      return 'text-green-500 dark:text-green-600'
    }
    return 'text-muted-foreground dark:text-muted-foreground/70'
  }

  const getHoverColor = (n: number) => {
    if (n <= 3) return 'hover:text-red-500 dark:hover:text-red-600'
    if (n <= 6) return 'hover:text-yellow-400 dark:hover:text-yellow-500'
    return 'hover:text-green-500 dark:hover:text-green-600'
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        variant={value ? 'default' : 'outline'}
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 transition-all transform hover:scale-105 hover:shadow-lg"
      >
        <Star className="w-4 h-4 text-yellow-400" />
        {value ? `Ваша оценка: ${value}` : 'Оценить'}
      </Button>

      <AlertDialogContent className="max-w-xl  w-full p-6 sm:p-8 rounded-2xl bg-background/95 dark:bg-background/90 backdrop-blur-lg shadow-xl animate-fade-in">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg sm:text-xl font-bold text-foreground dark:text-foreground/90">
            {value ? 'Изменить оценку' : 'Оцените аниме'}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="mt-4 grid grid-cols-5 sm:grid-cols-10 gap-4 justify-center items-center">
          {Array.from({ length: 10 }).map((_, i) => {
            const n = i + 1
            return (
              <button
                key={n}
                disabled={loading}
                onClick={() => submitRating(n)}
                aria-label={`Оценка ${n}`}
                className={cn(
                  'w-full sm:w-12 h-12 sm:h-12 flex items-center hover:border justify-center rounded-full font-bold text-2xl transition-all transform hover:scale-110',
                  getTextColor(n),
                  getHoverColor(n),
                )}
              >
                {n}
              </button>
            )
          })}
        </div>

        {value && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
            <Button
              variant="destructive"
              onClick={deleteRating}
              disabled={loading}
              className="w-full sm:w-auto transition-transform hover:scale-105"
            >
              Удалить оценку
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="w-full sm:w-auto transition-transform hover:scale-105"
            >
              Отмена
            </Button>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
