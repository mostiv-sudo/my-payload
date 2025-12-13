import { AnimeCardSkeleton } from './AnimeCardSkeleton'

export function AnimeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  )
}
