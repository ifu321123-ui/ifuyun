import { useEffect, useRef, type CSSProperties } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"
import {
  JUNNI_SLICE_COUNT,
  JUNNI_STAGE_VH,
  junniHero,
} from "./junniData"

gsap.registerPlugin(ScrollTrigger)

const SLICE_COUNT = JUNNI_SLICE_COUNT
const TAG_LAYOUT = [
  { x: 0, y: 0 },
  { x: -12, y: 8 },
  { x: 18, y: -6 },
] as const

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function map(p: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = clamp((p - inMin) / (inMax - inMin), 0, 1)
  return outMin + (outMax - outMin) * t
}

function HeroPanelContent() {
  return (
    <div className="junni-hero-panel">
      <span className="junni-hero-menu">Menu</span>
      <div className="junni-hero-body">
        <h1 className="junni-hero-logo">{junniHero.logo}</h1>
        <div className="junni-hero-manifesto">
          {junniHero.manifesto.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <span className="junni-hero-about">{junniHero.aboutCta}</span>
      </div>
    </div>
  )
}

interface JunniHeroProps {
  onInZoneChange?: (inJunniZone: boolean) => void
}

export default function JunniHero({ onInZoneChange }: JunniHeroProps) {
  const stageRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const sliceRefs = useRef<(HTMLDivElement | null)[]>([])
  const lenis = useLenis()

  const marqueeRepeat = Array.from({ length: 8 }, (_, i) => (
    <span key={i}>{junniHero.marquee}</span>
  ))

  useEffect(() => {
    const stage = stageRef.current
    const scene = sceneRef.current
    if (!stage || !scene) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const slices = sliceRefs.current.filter(Boolean) as HTMLDivElement[]

    const apply = (p: number) => {
      const flipStart = 0.08
      const flipEnd = 0.88
      const staggerSpan = 0.55

      slices.forEach((inner, i) => {
        const sliceDelay = (i / Math.max(SLICE_COUNT - 1, 1)) * staggerSpan
        const local = map(p, flipStart + sliceDelay * (flipEnd - flipStart), flipEnd, 0, 1)
        const rotateX = local * -88
        const opacity = 1 - local
        inner.style.transform = `rotateX(${rotateX.toFixed(2)}deg)`
        inner.style.opacity = opacity.toFixed(4)
      })

      const revealCopy = map(p, 0.42, 0.78, 0, 1)
      const revealTitle = map(p, 0.5, 0.86, 0, 1)
      const marqueeFade = map(p, 0.12, 0.45, 0, 1)
      const tagDrift = map(p, 0, 1, 0, 1)

      scene.style.setProperty("--junni-reveal-copy", revealCopy.toFixed(4))
      scene.style.setProperty("--junni-reveal-title", revealTitle.toFixed(4))
      scene.style.setProperty("--junni-marquee-fade", marqueeFade.toFixed(4))

      junniHero.tags.forEach((_, i) => {
        const layout = TAG_LAYOUT[i] ?? TAG_LAYOUT[0]
        const x = layout.x + tagDrift * (i % 2 === 0 ? 24 : -18)
        const y = layout.y + tagDrift * (i % 2 === 0 ? -16 : 22)
        scene.style.setProperty(`--junni-tag-x-${i}`, x.toFixed(1))
        scene.style.setProperty(`--junni-tag-y-${i}`, y.toFixed(1))
        scene.style.setProperty(`--junni-tag-opacity-${i}`, (1 - map(p, 0.35, 0.7, 0, 1)).toFixed(4))
      })
    }

    if (reducedMotion) {
      apply(1)
      return
    }

    const state = { progress: 0 }
    const tween = gsap.to(state, {
      progress: 1,
      ease: "none",
      onUpdate: () => apply(state.progress),
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.45,
        invalidateOnRefresh: true,
        onRefresh: (self) => apply(self.progress),
      },
    })

    const sentinel = stage.querySelector(".junni-exit-sentinel")

    const updateNavZone = () => {
      if (!sentinel) return
      const stageRect = stage.getBoundingClientRect()
      const sentinelRect = sentinel.getBoundingClientRect()
      const passed = sentinelRect.top <= window.innerHeight * 0.92
      const inZone = stageRect.top <= 4 && !passed
      onInZoneChange?.(inZone)
    }

    const updateScrollTrigger = () => {
      ScrollTrigger.update()
      updateNavZone()
    }
    lenis?.on("scroll", updateScrollTrigger)

    apply(0)
    updateNavZone()
    ScrollTrigger.refresh()

    return () => {
      lenis?.off("scroll", updateScrollTrigger)
      tween.scrollTrigger?.kill()
      tween.kill()
      for (const name of [
        "--junni-reveal-copy",
        "--junni-reveal-title",
        "--junni-marquee-fade",
        ...junniHero.tags.map((_, i) => `--junni-tag-x-${i}`),
        ...junniHero.tags.map((_, i) => `--junni-tag-y-${i}`),
        ...junniHero.tags.map((_, i) => `--junni-tag-opacity-${i}`),
      ]) {
        scene.style.removeProperty(name)
      }
    }
  }, [lenis, onInZoneChange])

  return (
    <section
      ref={stageRef}
      className="junni-hero-stage"
      style={{ "--junni-stage-vh": JUNNI_STAGE_VH } as CSSProperties}
      aria-label="JUNNI Hero"
    >
      <div ref={sceneRef} className="junni-hero-scene">
        <div className="junni-hero-reveal">
          <div className="junni-hero-reveal__copy">
            {junniHero.manifestoExtended.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <h2 className="junni-hero-reveal__headline">
            <span>{junniHero.revealTitle}</span>
            <span>{junniHero.revealSubtitle}</span>
          </h2>
        </div>

        <div className="junni-hero-tags" aria-hidden>
          {junniHero.tags.map((tag, i) => (
            <span key={tag} className={`junni-hero-tag junni-hero-tag--${i}`}>
              {tag}
            </span>
          ))}
        </div>

        <div className="junni-hero-marquee" aria-hidden>
          <div className="junni-hero-marquee__track">{marqueeRepeat}</div>
        </div>

        <div className="junni-hero-slices">
          {Array.from({ length: SLICE_COUNT }, (_, i) => (
            <div
              key={i}
              className="junni-slice"
              style={
                {
                  "--slice-i": i,
                  "--slice-n": SLICE_COUNT,
                } as React.CSSProperties
              }
            >
              <div
                className="junni-slice-inner"
                ref={(el) => {
                  sliceRefs.current[i] = el
                }}
              >
                <div
                  className="junni-slice-fill"
                  style={
                    {
                      "--slice-i": i,
                      "--slice-n": SLICE_COUNT,
                    } as CSSProperties
                  }
                >
                  <HeroPanelContent />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="junni-exit-sentinel" aria-hidden />
    </section>
  )
}
