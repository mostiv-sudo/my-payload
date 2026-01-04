import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Props = {
  title: string
  icon: React.ReactNode
  emptyText: string
  viewAllHref: string
  children: React.ReactNode
  count: number
}

export function AccountSection({ title, icon, emptyText, viewAllHref, children, count }: Props) {
  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {icon}
          {title}
          <span className="text-sm text-muted-foreground font-normal">({count})</span>
        </h2>

        {count > 0 && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={viewAllHref}>Смотреть все →</Link>
          </Button>
        )}
      </header>

      {count === 0 ? <p className="text-sm text-muted-foreground">{emptyText}</p> : children}
    </section>
  )
}
