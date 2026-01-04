import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Star, Bookmark as BookmarkIcon, Eye } from 'lucide-react'

type Props = {
  anime: {
    slug: string
    title: string
    poster_url?: string
  }
  category: 'ratings' | 'bookmarks'
  rating?: number
  status?: 'planned' | 'completed'
  comment?: string
  createdAt?: string
}

export function AccountAnimeCard({ anime, category, rating, status, comment, createdAt }: Props) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      <Link href={`/anime/${anime.slug}`} className="flex gap-4 p-4">
        {/* POSTER */}
        <div className="relative w-20 h-28 flex-shrink-0 rounded-md overflow-hidden bg-muted">
          {anime.poster_url ? (
            <Image
              src={anime.poster_url}
              alt={anime.title}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted animate-pulse" />
          )}
        </div>

        {/* CONTENT */}
        <div className="flex flex-col gap-1 flex-1">
          <h3 className="font-semibold leading-tight line-clamp-2">{anime.title}</h3>

          {/* RATING */}
          {category === 'ratings' && rating !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{rating}</span>
            </div>
          )}

          {/* BOOKMARK STATUS */}
          {category === 'bookmarks' && status && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {status === 'planned' ? (
                <>
                  <BookmarkIcon className="w-4 h-4" /> Запланировано
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" /> Просмотрено
                </>
              )}
            </div>
          )}

          {/* COMMENT */}
          {comment && <p className="text-xs text-muted-foreground line-clamp-2">{comment}</p>}

          {/* DATE */}
          {createdAt && (
            <span className="text-xs text-muted-foreground mt-auto">
              {new Date(createdAt).toLocaleDateString('ru-RU')}
            </span>
          )}
        </div>
      </Link>
    </Card>
  )
}
