import { useEffect, useState } from "react"
import { notebookNav } from "@/data"
import { cn } from "@/lib/utils"
import { navigate, useRoute, type PageId } from "@/hooks/useRoute"

function Smiley() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="text-[#f2e3cf]">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M8 9.5c.5.6 1.3.6 1.8 0" />
        <path d="M14.2 9.5c.5.6 1.3.6 1.8 0" />
        <path d="M8.5 14c1.8 1.8 5.2 1.8 7 0" />
      </g>
    </svg>
  )
}

const ROUTE_BY_NAV: Record<string, PageId> = {
  about: "home",
  work: "experience",
  project: "projects",
  thinking: "thinking",
  connect: "contact",
}

export default function Navbar() {
  const active = useRoute()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const onNavClick = (id: (typeof notebookNav)[number]["id"]) => {
    if (id === "about") {
      const el = document.getElementById("about")
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      } else {
        navigate("home")
      }
      return
    }
    navigate(ROUTE_BY_NAV[id])
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/80 py-3 backdrop-blur-md"
          : "border-b border-transparent py-5",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-center gap-10 px-6">
        <Smiley />
        {notebookNav.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavClick(item.id)}
            aria-current={active === ROUTE_BY_NAV[item.id] ? "page" : undefined}
            className={cn(
              "font-gochi text-[22px] text-[#f2e3cf] transition-opacity hover:opacity-70",
              active === ROUTE_BY_NAV[item.id] ? "opacity-100" : "opacity-80",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
