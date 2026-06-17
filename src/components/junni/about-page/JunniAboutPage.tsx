import { CSSProperties, useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"
import { navigate } from "@/hooks/useRoute"
import JunniCircleCursor from "./JunniCircleCursor"
import {
  ABOUT_CHARACTER,
  ABOUT_COPYRIGHT,
  ABOUT_FOOTER_LINKS,
  ABOUT_MISSION,
  ABOUT_OUTLINE,
  ABOUT_PAGE_TITLE,
  ABOUT_VALUE_SUBTITLE,
  ABOUT_VALUES,
  ABOUT_VISION,
  JUNNI_ABOUT_ASSETS,
  spaceLetters,
  spacedPageTitle,
} from "./junniAboutPageData"
import "./JunniAboutPage.css"

gsap.registerPlugin(ScrollTrigger)

const SHIFT_LAYERS = 7
const PAGE_TITLE_CHARS = spacedPageTitle(ABOUT_PAGE_TITLE)

function ShiftLayers({ className }: { className: string }) {
  return (
    <div className={`jap__shift ${className}`} aria-hidden="true">
      {Array.from({ length: SHIFT_LAYERS }, (_, i) => (
        <span key={i} className={`jap__shift-layer ${className}-layer`} />
      ))}
    </div>
  )
}

interface SectionTitleProps {
  en: string
  ja: string
  type?: "white" | "black"
  first?: boolean
  visible?: boolean
}

function SectionTitle({ en, ja, type = "white", first = false, visible = false }: SectionTitleProps) {
  const spaced = spaceLetters(en)
  return (
    <div
      className="jap__section-title"
      data-type={type}
      data-first={first || undefined}
      data-anime={visible || undefined}
    >
      <h2 className="jap__section-title-en" aria-label={en}>
        {Array.from(spaced).map((ch, i) => (
          <span
            key={i}
            className="jap__section-title-en-char"
            style={{ "--char-i": i } as CSSProperties}
            translate="no"
          >
            {ch === " " ? "\u00a0" : ch}
          </span>
        ))}
      </h2>
      <p className="jap__section-title-ja">{ja}</p>
    </div>
  )
}

function useScrollAnime(ref: React.RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setActive(true)
      el.setAttribute("data-anime", "true")
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(true)
            el.setAttribute("data-anime", "true")
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])

  return active
}

function bindShiftReveal(section: HTMLElement | null, layerSelector: string) {
  if (!section) return null
  const layerEls = section.querySelectorAll<HTMLElement>(layerSelector)
  if (!layerEls.length) return null

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduce) {
    gsap.set(layerEls, { scaleY: 1 })
    return null
  }

  gsap.set(layerEls, { scaleY: 0, transformOrigin: "top center" })

  return ScrollTrigger.create({
    trigger: section,
    start: "bottom 95%",
    end: "bottom 15%",
    scrub: 0.35,
    onUpdate: (self) => {
      layerEls.forEach((layer, i) => {
        const threshold = i / layerEls.length
        const local = gsap.utils.clamp(0, 1, (self.progress - threshold * 0.45) / 0.55)
        layer.style.transform = `scaleY(${local})`
      })
    },
  })
}

export default function JunniAboutPage() {
  const missionRef = useRef<HTMLElement>(null)
  const missionPinRef = useRef<HTMLDivElement>(null)
  const missionTextRef = useRef<HTMLDivElement>(null)
  const visionRef = useRef<HTMLElement>(null)
  const valueRef = useRef<HTMLElement>(null)
  const outlineRef = useRef<HTMLElement>(null)
  const characterRef = useRef<HTMLElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const lenis = useLenis()

  const [ready, setReady] = useState(false)
  const [pageHead, setPageHead] = useState(false)
  const [cursorVariant, setCursorVariant] = useState<"scroll_down_front" | "scroll_down_back">(
    "scroll_down_front",
  )
  const [copyrightDark, setCopyrightDark] = useState(false)

  const visionActive = useScrollAnime(visionRef)
  const valueActive = useScrollAnime(valueRef)
  const characterActive = useScrollAnime(characterRef)
  const outlineActive = useScrollAnime(outlineRef)

  useEffect(() => {
    setReady(true)
    const t = window.requestAnimationFrame(() => setPageHead(true))
    return () => window.cancelAnimationFrame(t)
  }, [])

  useEffect(() => {
    const syncChrome = () => {
      const visionEl = visionRef.current
      if (!visionEl) return
      const vr = visionEl.getBoundingClientRect()
      const onLight = vr.top < window.innerHeight * 0.5
      setCopyrightDark(onLight)
      setCursorVariant(onLight ? "scroll_down_back" : "scroll_down_front")
    }

    syncChrome()
    const onScroll = () => {
      ScrollTrigger.update()
      syncChrome()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    lenis?.on("scroll", onScroll)

    const triggers: ScrollTrigger[] = []

    const mission = missionRef.current
    const pinWrap = missionPinRef.current
    const textEl = missionTextRef.current

    if (mission && pinWrap && textEl) {
      const shiftLayers = mission.querySelectorAll<HTMLElement>(".jap__mission-shift-layer")
      const bodyChars = textEl.querySelectorAll<HTMLElement>(".jap__mission-body-char")
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (reduce) {
        gsap.set(shiftLayers, { scaleY: 1 })
        gsap.set(bodyChars, { color: "#f7f7f7", opacity: 1 })
      } else {
        gsap.set(shiftLayers, { scaleY: 0, transformOrigin: "top center" })
        gsap.set(bodyChars, { color: "#f7f7f7", opacity: 1 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinWrap,
            start: "top top",
            end: "+=120%",
            pin: true,
            pinSpacing: true,
            scrub: 0.4,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })

        tl.to(bodyChars, {
          color: "#777777",
          opacity: 0.3,
          stagger: { each: 0.006, from: "start" },
          ease: "none",
          duration: 0.5,
        }).to(
          shiftLayers,
          {
            scaleY: 1,
            stagger: 0.05,
            ease: "none",
            duration: 0.4,
          },
          0.3,
        )

        if (tl.scrollTrigger) triggers.push(tl.scrollTrigger)
      }
    }

    const visionShift = bindShiftReveal(visionRef.current, ".jap__vision-shift-layer")
    const valueShift = bindShiftReveal(valueRef.current, ".jap__value-shift-layer")
    const outlineShift = bindShiftReveal(outlineRef.current, ".jap__outline-shift-layer")
    ;[visionShift, valueShift, outlineShift].forEach((st) => {
      if (st) triggers.push(st)
    })

    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      window.removeEventListener("scroll", onScroll)
      lenis?.off("scroll", onScroll)
      triggers.forEach((st) => st.kill())
    }
  }, [lenis])

  const scrollToTop = () => {
    if (lenis) lenis.scrollTo(0, { immediate: false })
    else window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="jap" data-transitioned={ready} data-pagehead={pageHead}>
      <aside className="jap__copyright" aria-hidden="true" data-dark={copyrightDark || undefined}>
        <small className="jap__copyright-text">{ABOUT_COPYRIGHT}</small>
      </aside>

      <header className="jap__head">
        <h1 className="jap__head-title" aria-label={ABOUT_PAGE_TITLE}>
          {PAGE_TITLE_CHARS.split("").map((char, i) => (
            <span
              key={i}
              className="jap__head-char"
              style={{ "--char-i": i } as CSSProperties}
            >
              {char === " " ? "\u00a0" : char}
            </span>
          ))}
        </h1>
      </header>

      <div ref={missionPinRef} className="jap__mission-pin">
        <section ref={missionRef} className="jap__mission" aria-label="MISSION">
          <SectionTitle
            en={ABOUT_MISSION.title}
            ja={ABOUT_MISSION.subtitle}
            type="white"
            first
            visible={pageHead}
          />

          <div
            className="jap__mission-theme is-scroll-anime"
            data-first-visible={pageHead || undefined}
          >
            {ABOUT_MISSION.lead.map((line) => (
              <div key={line} className="jap__mission-theme-item">
                <span className="jap__mission-theme-text">{line}</span>
              </div>
            ))}
          </div>

          <div ref={missionTextRef} className="jap__mission-text">
            {ABOUT_MISSION.body.map((paragraph, pi) => (
              <p key={pi} className="jap__mission-text-item">
                {paragraph.map((line, li) => (
                  <span key={line}>
                    {Array.from(line).map((char, ci) => (
                      <span
                        key={`${pi}-${li}-${ci}`}
                        className="jap__mission-body-char"
                        translate="no"
                      >
                        {char}
                      </span>
                    ))}
                    {li < paragraph.length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
            ))}
          </div>

          <ShiftLayers className="jap__mission-shift" />
        </section>
      </div>

      <section
        ref={visionRef}
        className="jap__vision is-scroll-anime"
        aria-label="VISION"
        data-anime={visionActive || undefined}
      >
        <SectionTitle
          en={ABOUT_VISION.title}
          ja={ABOUT_VISION.subtitle}
          type="black"
          visible={visionActive}
        />

        <div className="jap__vision-theme">
          <img src={JUNNI_ABOUT_ASSETS.vision} alt="" loading="lazy" decoding="async" />
        </div>

        <div className="jap__vision-desc">
          {ABOUT_VISION.desc.map((line) => (
            <div key={line} className="jap__vision-desc-item">
              <span className="jap__vision-desc-text">{line}</span>
            </div>
          ))}
        </div>

        <div className="jap__vision-text">
          <p className="jap__vision-text-item">
            {ABOUT_VISION.body.map((line, i) => (
              <span key={line}>
                {Array.from(line).map((char, ci) => (
                  <span key={ci} className="jap__vision-text-char" translate="no">
                    {char}
                  </span>
                ))}
                {i < ABOUT_VISION.body.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        </div>

        <ShiftLayers className="jap__vision-shift" />
      </section>

      <section
        ref={valueRef}
        className="jap__value is-scroll-anime"
        aria-label="VALUE"
        data-anime={valueActive || undefined}
      >
        <SectionTitle en="VALUE" ja={ABOUT_VALUE_SUBTITLE} type="white" visible={valueActive} />

        <ol className="jap__value-list">
          {ABOUT_VALUES.map((item) => (
            <li key={item.num} className="jap__value-item is-scroll-anime">
              <div className="jap__value-item-inner">
                <span className="jap__value-item-num">{item.num}</span>
                <div className="jap__value-item-heading">
                  <p className="jap__value-item-heading-ja">{item.ja}</p>
                  <p className="jap__value-item-heading-en" aria-label={item.en}>
                    {item.en.split("").map((ch, i) => (
                      <span key={i} className="jap__value-item-heading-en-char" translate="no">
                        {ch}
                      </span>
                    ))}
                  </p>
                  <p className="jap__value-item-sub">{item.sub}</p>
                </div>
                <p className="jap__value-item-detail">{item.detail}</p>
                <div className="jap__value-item-illust" aria-hidden="true">
                  <div className="jap__value-item-illust-placeholder" data-num={item.num} />
                </div>
              </div>
            </li>
          ))}
        </ol>

        <ShiftLayers className="jap__value-shift" />
      </section>

      <section
        ref={outlineRef}
        className="jap__outline is-scroll-anime"
        aria-label="OUTLINE"
        data-anime={outlineActive || undefined}
      >
        <SectionTitle
          en={ABOUT_OUTLINE.title}
          ja={ABOUT_OUTLINE.subtitle}
          type="black"
          visible={outlineActive}
        />

        <div className="jap__outline-inner">
          <div className="jap__outline-graphic" aria-hidden="true">
            <img src={JUNNI_ABOUT_ASSETS.outline} alt="" loading="lazy" decoding="async" />
          </div>

          <dl className="jap__outline-list">
            {ABOUT_OUTLINE.rows.map((row) => (
              <div key={row.term} className="jap__outline-item">
                <dt className="jap__outline-term">{row.term}</dt>
                <dd className="jap__outline-desc">
                  {row.term === "所在地" ? (
                    <>
                      {row.desc.split("\n").map((line, i, arr) => (
                        <span key={i}>
                          {line}
                          {i < arr.length - 1 ? <br /> : null}
                        </span>
                      ))}
                      <a
                        className="jap__outline-map"
                        href={ABOUT_OUTLINE.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="jap__outline-map-icon" />
                        <span className="jap__outline-map-text">Googlemap</span>
                      </a>
                    </>
                  ) : (
                    row.desc.split("\n").map((line, i, arr) => (
                      <span key={i}>
                        {line}
                        {i < arr.length - 1 ? <br /> : null}
                      </span>
                    ))
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <ShiftLayers className="jap__outline-shift" />
      </section>

      <section
        ref={characterRef}
        className="jap__character is-scroll-anime"
        aria-label="CHARACTER"
        data-anime={characterActive || undefined}
      >
        <SectionTitle
          en={ABOUT_CHARACTER.title}
          ja={ABOUT_CHARACTER.subtitle}
          type="white"
          visible={characterActive}
        />

        <div className="jap__character-baku-wrap">
          <div className="jap__character-baku" aria-hidden="true">
            <img src={JUNNI_ABOUT_ASSETS.outline} alt="" loading="lazy" decoding="async" />
          </div>
        </div>

        <p className="jap__character-name">
          <span className="jap__character-name-term">{ABOUT_CHARACTER.nameLabel}</span>
          <span className="jap__character-name-desc">{ABOUT_CHARACTER.name}</span>
        </p>

        <div className="jap__character-text">
          {ABOUT_CHARACTER.paragraphs.map((paragraph, pi) => (
            <p key={pi} className="jap__character-text-item">
              {paragraph.map((line, li) => (
                <span key={line}>
                  {line}
                  {li < paragraph.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>
          ))}
        </div>
      </section>

      <JunniCircleCursor variant={cursorVariant} />

      <footer className="jap__footer" ref={footerRef}>
        <div className="jap__footer-inner">
          <ul className="jap__footer-menu">
            {ABOUT_FOOTER_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  className="jap__footer-menu-link"
                  data-active={link.active ?? false}
                  onClick={() => !link.active && navigate(link.id)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="jap__footer-brand">
            <p className="jap__footer-logo" aria-label="JUNNI">
              JUNNI
            </p>
            <p className="jap__footer-tagline">自由に、ユニークに。</p>
          </div>
          <button type="button" className="jap__footer-pagetop" aria-label="PAGE TOP" onClick={scrollToTop}>
            <span className="jap__footer-pagetop-arrow">↑</span>
            <span className="jap__footer-pagetop-text">PAGE TOP</span>
          </button>
        </div>
      </footer>
    </div>
  )
}
