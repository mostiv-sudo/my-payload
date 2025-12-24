'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Bookmark, Eye } from 'lucide-react'

type Props = {
  animeId: string
}

type BookmarkStatus = 'planned' | 'completed'

export function AnimeBookmark({ animeId }: Props) {
  const [userId, setUserId] = useState<string | null>(null)
  const [bookmarkId, setBookmarkId] = useState<string | null>(null)
  const [status, setStatus] = useState<BookmarkStatus | null>(null)
  const [loading, setLoading] = useState(false)

  // Получаем текущего пользователя
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

  // Загружаем текущую закладку
  useEffect(() => {
    if (!userId) return
    const loadBookmark = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/bookmarks?where[user][equals]=${userId}&where[anime][equals]=${animeId}&limit=1`,
          { credentials: 'include' },
        )
        const data = await res.json()
        if (data?.docs?.length) {
          setBookmarkId(data.docs[0].id)
          setStatus(data.docs[0].status)
        }
      } catch {}
    }
    loadBookmark()
  }, [userId, animeId])

  const toggleBookmark = async (clickedStatus: BookmarkStatus) => {
    if (!userId) return alert('Сначала войдите в аккаунт')
    setLoading(true)

    try {
      if (status === clickedStatus && bookmarkId) {
        // Нажали на активную — удаляем
        await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/bookmarks/${bookmarkId}`, {
          method: 'DELETE',
          credentials: 'include',
        })
        setBookmarkId(null)
        setStatus(null)
      } else if (bookmarkId) {
        // Обновляем существующую закладку
        await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/bookmarks/${bookmarkId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: clickedStatus }),
        })
        setStatus(clickedStatus)
      } else {
        // Создаём новую
        const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/bookmarks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ anime: animeId, user: userId, status: clickedStatus }),
        })
        const data = await res.json()
        setBookmarkId(data?.doc?.id || null)
        setStatus(clickedStatus)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3 mx-4">
      <Button
        variant={status === 'planned' ? 'default' : 'outline'}
        onClick={() => toggleBookmark('planned')}
        disabled={loading}
        className="flex items-center gap-1 transition-transform transform hover:scale-105"
        title="Запланировано"
      >
        <Bookmark className="w-5 h-5" />
      </Button>

      <Button
        variant={status === 'completed' ? 'default' : 'outline'}
        onClick={() => toggleBookmark('completed')}
        disabled={loading}
        className="flex items-center gap-1 transition-transform transform hover:scale-105"
        title="Просмотрено"
      >
        <Eye className="w-5 h-5" />
      </Button>
    </div>
  )
}
