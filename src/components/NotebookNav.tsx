import { useState } from "react"
import { notebookNav } from "@/data"
import { navigate } from "@/hooks/useRoute"

const NAV_DOODLES = {
  about: [
    { src: "/notebook/navie1.png", className: "-top-9 left-[18%]", w: "34px" },
    { src: "/notebook/navie2.png", className: "-top-7 left-[32%]", w: "30px", delay: 40 },
    { src: "/notebook/navie3.png", className: "-bottom-8 left-[24%]", w: "30px", delay: 80 },
  ],
  work: [
    { src: "/notebook/navie4.png", className: "-top-24 left-[44%]", w: "60px" },
    { src: "/notebook/navie5.png", className: "-bottom-9 left-[56%]", w: "26px", delay: 60 },
  ],
} as const

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

function HoverDoodle({
  src,
  show,
  className,
  w,
  delay = 0,
}: {
  src: string
  show: boolean
  className: string
  w: string
  delay?: number
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      className={`pointer-events-none absolute select-none ${className}`}
      style={{
        width: w,
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0) scale(1)" : "translateY(6px) scale(0.7)",
        transition: `opacity .28s ease, transform .35s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    />
  )
}

export default function NotebookNav() {
  const [hover, setHover] = useState<"about" | "work" | null>(null)

  const onNavClick = (id: (typeof notebookNav)[number]["id"]) => {
    if (id === "about") {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
    } else if (id === "work") {
      navigate("experience")
    } else if (id === "project") {
      navigate("projects")
    } else if (id === "thinking") {
      navigate("thinking")
    } else {
      navigate("contact")
    }
  }

  return (
    <nav className="notebook-nav notebook-nav--top">
      <Smiley />
      {notebookNav.map((item) => (
        <span key={item.id} className="relative inline-flex">
          {item.id === "about" &&
            NAV_DOODLES.about.map((d) => (
              <HoverDoodle key={d.src} show={hover === "about"} {...d} />
            ))}
          {item.id === "work" &&
            NAV_DOODLES.work.map((d) => (
              <HoverDoodle key={d.src} show={hover === "work"} {...d} />
            ))}
          <button
            onMouseEnter={() => {
              if (item.id === "about") setHover("about")
              else if (item.id === "work") setHover("work")
            }}
            onMouseLeave={() => setHover(null)}
            onClick={() => onNavClick(item.id)}
            className="font-gochi text-[22px] text-[#f2e3cf] transition-opacity hover:opacity-70"
          >
            {item.label}
          </button>
        </span>
      ))}
    </nav>
  )
}
