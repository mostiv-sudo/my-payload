import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      className="
        px-3 lg:container 
        
      "
    >
      <div
        className=" px-8 py-8 lg:mb-6 mb-3 lg:mx-auto  rounded-2xl
        border border-border/60
        bg-background/70
        backdrop-blur-md
        supports-[backdrop-filter]:bg-background/60
        shadow-sm
        hover:shadow-md"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* LOGO */}
          <Link href="/" className="text-2xl font-bold text-foreground">
            Аниме
          </Link>

          {/* NAV */}
          <nav>
            <ul className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <li>
                <Link href="/anime" className="hover:text-foreground transition">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/film" className="hover:text-foreground transition">
                  Фильмы
                </Link>
              </li>
              <li>
                <Link href="/tv" className="hover:text-foreground transition">
                  Сериалы
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-foreground transition">
                  Поиск
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <hr className="my-6 border-border/60" />

        {/* COPYRIGHT */}
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Аниме. Все права защищены.
        </p>
      </div>
    </footer>
  )
}
