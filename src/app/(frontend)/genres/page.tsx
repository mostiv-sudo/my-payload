// app/genres/page.tsx
import Link from 'next/link'
import { getGenres } from '@/lib/getGenres'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

export default async function GenresPage() {
  const genres = await getGenres()

  return (
    <div className="py-8 px-4 md:px-8 container">
      <h1 className="text-3xl font-bold mb-6">Жанры</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {genres.map((genre: any) => (
          <Link key={genre.id} href={`/genres/${genre.slug}`} className="group">
            <Card className="hover:scale-105 transform transition duration-300 ease-out cursor-pointer shadow-md">
              <CardHeader>
                <CardTitle className="text-lg truncate">{genre.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-between">
                {genre.description && (
                  <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                    {genre.description}
                  </CardDescription>
                )}
                <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
