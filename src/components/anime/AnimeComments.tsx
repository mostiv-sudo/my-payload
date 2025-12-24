'use client'

import { useEffect, useState, useCallback } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/Auth'
import { ThumbsUp, CornerDownLeft, Info, MessageCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

function timeAgo(dateString: string) {
  const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  if (diff < 60) return `${diff} секунд назад`
  if (diff < 3600) return `${Math.floor(diff / 60)} минут назад`
  if (diff < 86400) return `${Math.floor(diff / 3600)} часов назад`
  return `${Math.floor(diff / 86400)} дней назад`
}

type Comment = {
  id: string
  content: string
  authorName: string
  authorEmail?: string
  createdAt: string
  likes?: number
  replyTo?: string
}

type AnimeCommentsProps = {
  animeId: String
}

export function AnimeComments({ animeId }: AnimeCommentsProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(async () => {
    setFetching(true)
    setError(null)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/comments?where[anime][equals]=${animeId}&depth=1&sort=-createdAt`,
      )
      if (!res.ok) throw new Error('Не удалось загрузить комментарии')
      const data = await res.json().catch(() => null)
      setComments(
        (data?.docs || []).map((c: any) => ({
          id: c.id,
          content: c.content,
          authorName: c.author?.username || c.author?.name || 'Аноним',
          authorEmail: c.author?.email,
          createdAt: c.createdAt,
          likes: c.likes || 0,
          replyTo: c.replyTo || null,
        })),
      )
    } catch (err: any) {
      console.error('Error fetching comments:', err)
      setError('Не удалось загрузить комментарии.')
    } finally {
      setFetching(false)
    }
  }, [animeId])

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchComments()
    }, 300) // небольшая задержка для плавности
    return () => clearTimeout(timer)
  }, [fetchComments])

  const submitComment = async () => {
    if (!content.trim() || !user?.id) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anime: animeId,
          content,
          author: user.id,
        }),
        credentials: 'include',
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.message || 'Не удалось отправить комментарий.')
      setContent('')
      await fetchComments()
    } catch (err: any) {
      console.error('Error submitting comment:', err)
      setError(err.message || 'Не удалось отправить комментарий.')
    } finally {
      setLoading(false)
    }
  }

  const renderTime = (date: string) => `• ${timeAgo(date)}`

  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&rounded=true&size=48`
  }

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-2xl font-bold text-primary">Комментарии</h2>

      {/* Форма */}
      {user ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={getAvatarUrl(user.username || user.email || 'User')}
              alt={user.username || user.email}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-sm text-primary font-medium">{user.username || user.email}</span>
          </div>
          <Textarea
            placeholder="Напишите комментарий..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            className="w-full min-h-[80px] p-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 ease-in-out resize-none shadow-sm hover:shadow-md"
          />

          <Button
            onClick={submitComment}
            disabled={loading || !content.trim()}
            className="w-full sm:w-auto px-6 py-2 font-medium"
          >
            {loading ? 'Отправка...' : 'Отправить'}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center p-4 bg-transparent border border-yellow-400/80 rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <Info className="text-yellow-500 w-5 h-5" />
            <p className="text-sm ">
              Чтобы оставить комментарий,{' '}
              <span className="font-medium hover:underline cursor-pointer text-yellow-500">
                войдите в аккаунт
              </span>{' '}
              или{' '}
              <span className="font-medium hover:underline cursor-pointer text-yellow-500">
                зарегистрируйтесь
              </span>
            </p>
          </div>

          <div className="flex justify-center gap-3 mt-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Войти</Link>
            </Button>
            <Button asChild variant="default" size="sm">
              <Link href="/create-account">Регистрация</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Статусы */}
      {fetching && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Список комментариев */}
      {!fetching && comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((c) => {
            const replyComment = c.replyTo ? comments.find((com) => com.id === c.replyTo) : null
            return (
              <div
                key={c.id}
                className="rounded-xl border border-border/60 p-4 bg-background/50 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={getAvatarUrl(c.authorName)}
                      alt={c.authorName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary">{c.authorName}</span>
                      <span className="text-sm text-muted-foreground break-words">
                        {c.authorEmail}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground mt-1 sm:mt-0">
                    {renderTime(c.createdAt)}
                  </span>
                </div>

                {replyComment && (
                  <div className="pl-4 border-l-2 border-border/40 mb-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold">
                      <CornerDownLeft size={16} /> {replyComment.authorName}
                    </span>
                    <span className="ml-5">{renderTime(replyComment.createdAt)}</span>
                    <p className="mt-1 ml-5">{replyComment.content}</p>
                  </div>
                )}

                <p className="text-base text-foreground mt-2">{c.content}</p>

                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-3">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                    <ThumbsUp size={16} /> {c.likes || 0}
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                    <CornerDownLeft size={16} /> Ответить
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!fetching && comments.length === 0 && (
        <div className="flex items-center justify-center gap-2 p-4 bg-background/50 border border-border/40 rounded-lg text-sm text-muted-foreground h-[15vh]">
          <MessageCircle className="w-5 h-5 text-muted-foreground" />
          <span>Комментариев 0</span>
        </div>
      )}
    </div>
  )
}
