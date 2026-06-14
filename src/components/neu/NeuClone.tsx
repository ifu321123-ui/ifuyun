import { useEffect, useRef, useState } from "react"
import { useLenis } from "lenis/react"
import NeuNav, { type NeuSection } from "./NeuNav"
import NeuHero from "./NeuHero"
import NeuMarquee from "./NeuMarquee"
import NeuPixel from "./NeuPixel"
import NeuAbout from "./NeuAbout"
import NeuService from "./NeuService"
import NeuFooter from "./NeuFooter"
import "./neu.css"

const NAV_LINE = 56 // 判定线：导航栏中心大致 y 值

export default function NeuClone() {
  const root = useRef<HTMLDivElement>(null)
  const lenis = useLenis()
  const [active, setActive] = useState<NeuSection>("top")
  const [onDark, setOnDark] = useState(false)
  const frame = useRef(0)

  useEffect(() => {
    const el = root.current
    if (!el) return

    const update = () => {
      frame.current = 0
      const darkEls = el.querySelectorAll<HTMLElement>("[data-neu-dark]")
      let dark = false
      darkEls.forEach((d) => {
        const r = d.getBoundingClientRect()
        if (r.top <= NAV_LINE && r.bottom >= NAV_LINE) dark = true
      })
      setOnDark(dark)

      const sectionEls = el.querySelectorAll<HTMLElement>("[data-neu-section]")
      let current: NeuSection = "top"
      const line = window.innerHeight * 0.38
      sectionEls.forEach((s) => {
        if (s.getBoundingClientRect().top <= line) {
          current = (s.dataset.neuSection as NeuSection) ?? current
        }
      })
      setActive(current)
    }

    const onScroll = () => {
      if (frame.current) return
      frame.current = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  const onJump = (id: NeuSection) => {
    const target = root.current?.querySelector<HTMLElement>(`[data-neu-section="${id}"]`)
    if (!target) return
    if (lenis) {
      lenis.scrollTo(target, { offset: -10 })
    } else {
      target.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="neu-root" ref={root}>
      <NeuNav active={active} onDark={onDark} onJump={onJump} />
      <NeuHero />
      <NeuMarquee />
      <NeuAbout />
      <NeuPixel />
      <NeuService />
      <NeuFooter />
    </div>
  )
}
