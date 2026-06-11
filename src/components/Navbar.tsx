import { useEffect, useState } from "react"
import { Command, Menu, X } from "lucide-react"
import { navItems, profile } from "@/data"
import { cn } from "@/lib/utils"
import { navigate, useRoute, type PageId } from "@/hooks/useRoute"

function useClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  )
  useEffect(() => {
    const id = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      )
    }, 10_000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function Navbar() {
  const active = useRoute()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState<"中" | "EN">("中")
  const time = useClock()

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
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-border bg-background/80 py-2.5 backdrop-blur-md"
          : "border-transparent py-4",
      )}
    >
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6">
        {/* 左：品牌 wordmark + 点缀圆点 */}
        <button
          onClick={() => go("home")}
          className="flex items-center text-base font-extrabold tracking-tight"
        >
          <span>{profile.name}</span>
          <span className="ml-0.5 size-1.5 translate-y-1.5 rounded-full bg-brand" />
        </button>

        {/* 中：水平居中的文字导航 */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={cn(
                "relative text-sm transition-colors",
                active === id
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
              {active === id && (
                <span className="absolute -bottom-1.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-foreground" />
              )}
            </button>
          ))}
        </div>

        {/* 右：工具区 */}
        <div className="flex items-center gap-2">
          {/* 时间 */}
          <span className="hidden items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground lg:inline-flex">
            <span className="size-1.5 rounded-full bg-foreground/70" />
            {time}
          </span>
          {/* ⌘K */}
          <span className="hidden items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground lg:inline-flex">
            <Command className="size-3" />K
          </span>
          {/* 语言切换 */}
          <div className="hidden items-center rounded-full border border-border p-0.5 text-xs font-semibold sm:flex">
            {(["中", "EN"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  "rounded-full px-2 py-0.5 transition-colors",
                  lang === l
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          {/* 邮箱按钮 */}
          <a
            href={`mailto:${profile.email}`}
            className="hidden rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition-opacity hover:opacity-90 md:inline-block"
          >
            {profile.email}
          </a>

          {/* 移动端按钮 */}
          <button
            className="grid size-9 place-items-center rounded-lg border border-border md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="菜单"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* 移动端菜单 */}
      {open && (
        <div className="mx-6 mt-3 overflow-hidden rounded-2xl border border-border bg-background p-2 shadow-lg md:hidden">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={cn(
                "block w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                active === id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
          <a
            href={`mailto:${profile.email}`}
            className="mt-1 block rounded-xl px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {profile.email}
          </a>
        </div>
      )}
    </header>
  )
}
