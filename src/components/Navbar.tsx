import { useEffect, useState } from "react"
import { notebookNav } from "@/data"
import { cn } from "@/lib/utils"
import { navigate, useRoute, type PageId } from "@/hooks/useRoute"

const ROUTE_BY_NAV: Record<string, PageId> = {
  about: "home",
  work: "experience",
  project: "projects",
  connect: "contact",
}

interface NavbarProps {
  hidden?: boolean
}

export default function Navbar({ hidden = false }: NavbarProps) {
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
        "fixed inset-x-0 top-0 z-50 flex justify-center px-6 transition-all duration-300",
        scrolled ? "py-3" : "py-5",
        hidden && "pointer-events-none translate-y-[-120%] opacity-0",
      )}
    >
      <nav
        className="flex items-center gap-1 rounded-lg bg-white p-1 shadow-[0_10px_30px_-18px_rgba(29,1,254,0.45)]"
        style={{ fontFamily: '"Figtree", sans-serif' }}
      >
        {notebookNav.map((item) => {
          const isActive = active.page === ROUTE_BY_NAV[item.id]
          return (
            <button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              aria-current={isActive ? "page" : undefined}
              style={{ fontWeight: 600, lineHeight: 1 }}
              className={cn(
                "rounded-md px-[1.05rem] py-[0.55rem] text-[1.05rem] transition-colors duration-300",
                isActive
                  ? "bg-[#1b00f6] text-white"
                  : "text-[#1d01fe] hover:bg-[#1d01fe]/10",
              )}
            >
              {item.label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
