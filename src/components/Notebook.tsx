import { useEffect, useRef, useState } from "react"
import { notebook, notebookNav } from "@/data"
import { navigate } from "@/hooks/useRoute"

const SIDE_DOODLES = [
  "/notebook/navie1.png",
  "/notebook/navie2.png",
  "/notebook/navie3.png",
  "/notebook/navie4.png",
  "/notebook/navie5.png",
]

const CANVAS_DOODLES = [
  { src: "/notebook/juicebox.png", className: "notebook-doodle--juice" },
  { src: "/notebook/fish.svg", className: "notebook-doodle--fish" },
  { src: "/notebook/godzilla.png", className: "notebook-doodle--zilla" },
  { src: "/notebook/noodle.png", className: "notebook-doodle--noodle" },
]

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

function RibbonLeft() {
  return (
    <svg className="notebook-ribbon-left" viewBox="0 0 88.5 40.5" aria-hidden>
      <path
        d="M 88.5 0 L 37.5 8 L 0 28.5 L 8.5 32.5 L 8.5 40.5 L 43 23 L 88.5 17 Z"
        fill="var(--notebook-ribbon)"
      />
    </svg>
  )
}

function RibbonRight() {
  return (
    <svg className="notebook-ribbon-right" viewBox="0 0 46.5 93" aria-hidden>
      <path
        d="M 0 23 L 41.5 52 L 46.5 72.5 L 23.5 85.5 L 0 93 L 0 75.5 L 18 69.5 L 28 62.5 L 21 21 L 0 0 Z"
        fill="var(--notebook-ribbon)"
      />
    </svg>
  )
}

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

function SideStrip({ side }: { side: "left" | "right" }) {
  const items = [...SIDE_DOODLES, ...SIDE_DOODLES, ...SIDE_DOODLES]
  return (
    <div
      className={`notebook-side-strip notebook-side-strip--${side} hidden xl:flex`}
      aria-hidden
    >
      {items.map((src, i) => (
        <img key={`${side}-${i}`} src={src} alt="" className="notebook-side-icon" />
      ))}
    </div>
  )
}

function BeliefNote({
  text,
  paper,
  font,
  className,
}: (typeof notebook.beliefs)[number]) {
  const fontClass =
    font === "hand"
      ? "font-gochi"
      : font === "mono"
        ? "font-mono"
        : "font-serif italic"

  return (
    <div className={`notebook-note ${className}`}>
      <img src={paper} alt="" className="notebook-note-paper" />
      <p className={`notebook-note-text ${fontClass}`}>{text}</p>
    </div>
  )
}

export default function Notebook() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const [hover, setHover] = useState<"about" | "work" | null>(null)
  const [wordIdx, setWordIdx] = useState(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const id = setInterval(
      () => setWordIdx((i) => (i + 1) % notebook.rotatingEmphasis.length),
      2600,
    )
    return () => clearInterval(id)
  }, [])

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty("--nb-mx", String((e.clientX - r.left) / r.width - 0.5))
    el.style.setProperty("--nb-my", String((e.clientY - r.top) / r.height - 0.5))
  }

  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--nb-mx", "0")
    e.currentTarget.style.setProperty("--nb-my", "0")
  }

  const onNavClick = (id: (typeof notebookNav)[number]["id"]) => {
    if (id === "about") {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
    } else if (id === "work") {
      navigate("projects")
    } else {
      navigate("contact")
    }
  }

  return (
    <section
      ref={sectionRef}
      className={`notebook-section ${inView ? "notebook-in" : ""}`}
      aria-label="Jackie Zhang portfolio notebook"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <SideStrip side="left" />
      <SideStrip side="right" />

      {CANVAS_DOODLES.map((d) => (
        <img key={d.src} src={d.src} alt="" className={`notebook-doodle ${d.className}`} />
      ))}

      <nav className="notebook-nav">
        {NAV_DOODLES.about.map((d) => (
          <HoverDoodle key={d.src} src={d.src} show={hover === "about"} {...d} />
        ))}
        {NAV_DOODLES.work.map((d) => (
          <HoverDoodle key={d.src} src={d.src} show={hover === "work"} {...d} />
        ))}

        <Smiley />
        {notebookNav.map((item) => (
          <button
            key={item.id}
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
        ))}
      </nav>

      {/* 📖 Book container — 上 / 中 / 下 三段 Framer 结构 */}
      <div className="notebook-scene">
        <div
          className="notebook-book"
          style={{
            transform:
              "rotateX(calc(var(--nb-my,0) * -4deg)) rotateY(calc(var(--nb-mx,0) * 6deg))",
            transition: "transform .4s ease-out",
          }}
        >
          {/* —— ① Top page container (rim light) —— */}
          <div className="notebook-top-rim">
            <div className="notebook-top-wrap">
              <RibbonLeft />
              <RibbonRight />
              <div className="notebook-leather notebook-leather--top" aria-hidden />

              <div className="notebook-page-stack" aria-hidden>
                <div className="notebook-stack-sheet" />
                <div className="notebook-stack-sheet" />
              </div>

              {/* ✍️ Paper Page — perspective(4105px) rotateX(-5deg) */}
              <div className="notebook-paper notebook-paper--top">
                <div className="notebook-paper-vfx" aria-hidden>
                  <div className="notebook-paper-gradient" />
                  <div className="notebook-paper-grid" />
                </div>

                <div className="notebook-top-inner">
                  <div className="notebook-intro">
                    <p className="notebook-name font-gochi">{notebook.nameScript}</p>

                    <div className="notebook-role" aria-label={notebook.role}>
                      {notebook.role.split("").map((ch, i) => (
                        <span key={`${ch}-${i}`} className="notebook-role-char">
                          {ch}
                        </span>
                      ))}
                    </div>

                    <div className="notebook-headline-block">
                      <p className="notebook-headline-main">{notebook.headlineMain}</p>
                      <div className="notebook-headline-row">
                        <span className="notebook-headline-feel">{notebook.headlineFeel}</span>
                        <span key={wordIdx} className="notebook-headline-emphasis font-gochi animate-fade-up">
                          {notebook.rotatingEmphasis[wordIdx]}
                        </span>
                      </div>
                    </div>

                    <p className="notebook-location">{notebook.location}</p>
                  </div>

                  <div className="notebook-hero-wrap">
                    <img src="/notebook/bud.png" alt="" className="notebook-slice-decor" />
                    <img
                      src="/notebook/hero.png"
                      alt="Hand-drawn illustration of a person at a browser window"
                      className="notebook-hero-img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* —— ② Binder —— */}
          <div className="notebook-binder" aria-hidden />

          {/* —— ③ Bottom Page — perspective(3310px) rotateX(-1.11deg) —— */}
          <div className="notebook-bottom-outer">
            <div className="notebook-leather notebook-leather--bottom" aria-hidden />
            <div className="notebook-paper notebook-paper--bottom">
              <div className="notebook-paper-vfx notebook-paper-vfx--plain" aria-hidden>
                <div className="notebook-paper-gradient" />
              </div>

              <p className="notebook-beliefs-title">{notebook.beliefsTitle}</p>

              <div className="notebook-notes">
                {notebook.beliefs.map((belief) => (
                  <BeliefNote key={belief.text} {...belief} />
                ))}
              </div>

              <img src="/notebook/bud.png" alt="" className="notebook-slice-decor notebook-slice-decor--bottom" />
              <img src="/notebook/plant.png" alt="" className="notebook-corner notebook-corner--plant" />
              <img src="/notebook/stump.png" alt="" className="notebook-corner notebook-corner--stump" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
