import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"
import { junniHero } from "./junniData"

gsap.registerPlugin(ScrollTrigger)

const ABOUT_INK = "#111111"
const ABOUT_HIDDEN = "#cbea41"

/**
 * home_about：荧光绿底 + 黑字大段日文文案 + ABOUT JUNNI 按钮。
 * 翻面完成后自然滚入的下一层（独立区块，非翻转露出的底层）。
 */
export default function JunniAbout() {
  const sectionRef = useRef<HTMLElement>(null)
  const charRefs = useRef<HTMLSpanElement[]>([])
  const lenis = useLenis()

  charRefs.current = []

  useEffect(() => {
    const section = sectionRef.current
    const chars = charRefs.current
    if (!section || chars.length === 0) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reducedMotion) {
      gsap.set(chars, { color: ABOUT_INK })
      return
    }

    gsap.set(chars, { color: ABOUT_HIDDEN })

    const tween = gsap.to(chars, {
      color: ABOUT_INK,
      ease: "none",
      stagger: {
        each: 0.018,
      },
      scrollTrigger: {
        trigger: section,
        start: "top 60%",
        end: "bottom 60%",
        scrub: 0.4,
        invalidateOnRefresh: true,
      },
    })

    const onScroll = () => ScrollTrigger.update()
    lenis?.on("scroll", onScroll)
    ScrollTrigger.refresh()

    return () => {
      lenis?.off("scroll", onScroll)
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [lenis])

  const setCharRef = (el: HTMLSpanElement | null) => {
    if (el) charRefs.current.push(el)
  }

  return (
    <section ref={sectionRef} className="junni-about" data-menu-bg="light" aria-label="ABOUT JUNNI">
      <div className="junni-about__inner">
        <div className="junni-about__copy" aria-label={[...junniHero.manifesto, ...junniHero.manifestoExtended].join("")}>
          {junniHero.aboutParagraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex} className="junni-about__text">
              {paragraph.map((line, lineIndex) => (
                <span key={line}>
                  {Array.from(line).map((char, charIndex) => (
                    <span
                      key={`${paragraphIndex}-${lineIndex}-${charIndex}`}
                      ref={setCharRef}
                      className="junni-about__char"
                      translate="no"
                      data-char=""
                    >
                      {char}
                    </span>
                  ))}
                  {lineIndex < paragraph.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>
          ))}
        </div>
        <button type="button" className="junni-about__cta" aria-label={junniHero.aboutCta}>
          <span className="junni-about__cta-text">{junniHero.aboutCta}</span>
        </button>
      </div>
    </section>
  )
}
