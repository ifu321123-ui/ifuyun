import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { navItems } from "@/data"
import { cn } from "@/lib/utils"
import { navigate, useRoute, type PageId } from "@/hooks/useRoute"

export default function Navbar() {
  const active = useRoute()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const go = (id: string) => {
    navigate(id as PageId)
    setOpen(false)
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <button
          onClick={() => go("home")}
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="grid size-7 place-items-center rounded-lg bg-accent text-accent-foreground font-bold">
            P
          </span>
          <span className="hidden sm:block">Portfolio</span>
        </button>

        {/* 桌面导航 */}
        <div
          className={cn(
            "hidden items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-300 md:flex",
            scrolled && "glass-strong",
          )}
        >
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                active === id
                  ? "text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active === id && (
                <span className="absolute inset-0 rounded-full bg-accent" />
              )}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => go("contact")}
          className="hidden rounded-full border border-border-strong px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted md:block"
        >
          下载简历
        </button>

        {/* 移动端按钮 */}
        <button
          className="grid size-9 place-items-center rounded-lg glass md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="菜单"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* 移动端菜单 */}
      {open && (
        <div className="mx-6 mt-3 overflow-hidden rounded-2xl glass-strong p-2 md:hidden">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={cn(
                "block w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                active === id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}
