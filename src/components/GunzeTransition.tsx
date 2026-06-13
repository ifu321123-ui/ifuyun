import { useEffect, useMemo, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"

const ASSET = "/gunze/"
const MOVIE_TOTAL = 16

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function map(p: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = clamp((p - inMin) / (inMax - inMin), 0, 1)
  return outMin + (outMax - outMin) * t
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

const SVG_RATIO = 1440 / 1316
const HOOK_VH = 1.25
const DOT_WIDTH_RATIO = 0.175
const DOT_ASPECT = 1.424
const TIP_Y_RATIO = 0.998
const TIP_X_RATIO = 0.492
const GAP_RATIO = 0.05

const REVEAL_END = 0.56
const FLOOD_END = 0.86
const MSG_START = 0.62
const MSG_END = 0.88

gsap.registerPlugin(ScrollTrigger)

const movieSlides = Array.from({ length: MOVIE_TOTAL }, (_, index) => {
  const n = index + 1
  return {
    id: `movie${String(n).padStart(2, "0")}`,
    image: n <= 12 ? `movie-main${String(n).padStart(2, "0")}.jpg` : "movie-comingsoon.jpg",
    youtube:
      [
        "NjUicrVbPMk",
        "Thlk14RTGt4",
        "m45fz2bPrJg",
        "SevGvarMK3s",
        "wrxHanrWW9c",
        "zYwMByE5q_k",
        "jDyhiEiLN40",
        "hXitcTdwcTs",
        "P97K2JSEpLQ",
        "gN6tTNm6amg",
        "ZpBe4LizZPE",
        "EV5nOu4yCEA",
      ][index] ?? null,
  }
})

function Eyes({ className = "" }: { className?: string }) {
  return (
    <div className={`gunze-eyes ${className}`} aria-hidden>
      {[0, 1].map((i) => (
        <div key={i} className="gunze-eye">
          <img className="gunze-eye__base" src={`${ASSET}eye-base-border.svg`} alt="" />
          <img className="gunze-eye__white" src={`${ASSET}eye-shirome.svg`} alt="" />
          <img className="gunze-eye__blink" src={`${ASSET}eye-mabataki.svg`} alt="" />
          <div className="gunze-eye__pupil">
            <img className="gunze-eye__circle" src={`${ASSET}eye-base-circle.svg`} alt="" />
            <img className="gunze-eye__star" src={`${ASSET}eye-star.svg`} alt="" />
          </div>
        </div>
      ))}
    </div>
  )
}

function SvgSprite() {
  return (
    <svg className="gunze-sprite" aria-hidden>
      <symbol id="gunze-arrow" viewBox="0 0 27 26">
        <path d="M3 13h19M14 5l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="gunze-play" viewBox="0 0 43 50">
        <path d="M41 25 2 47V3l39 22Z" fill="currentColor" />
      </symbol>
      <symbol id="gunze-close" viewBox="0 0 75 75">
        <path d="m18 18 39 39M57 18 18 57" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      </symbol>
    </svg>
  )
}

function MovieSection() {
  const [current, setCurrent] = useState(0)
  const [modal, setModal] = useState<string | null>(null)

  const visible = useMemo(() => {
    return [-2, -1, 0, 1, 2].map((offset) => {
      const index = (current + offset + movieSlides.length) % movieSlides.length
      return { ...movieSlides[index], index, offset }
    })
  }, [current])

  const activeMovie = modal ? movieSlides.find((item) => item.id === modal) : null

  return (
    <section className="gunze-movie" id="movie">
      <hgroup className="gunze-title-group">
        <h2 className="gunze-section-title">Movie</h2>
        <p className="gunze-title-jp">130周年纪念视频</p>
      </hgroup>

      <div className="gunze-movie-slider" aria-label="130周年纪念视频列表">
        <div className="gunze-movie-track">
          {visible.map((slide) => {
            const isActive = slide.offset === 0
            const canOpen = Boolean(slide.youtube)
            const body = (
              <>
                <img src={`${ASSET}${slide.image}`} alt="" />
                {canOpen && (
                  <span className="gunze-movie-play">
                    <svg viewBox="0 0 43 50">
                      <use href="#gunze-play" />
                    </svg>
                  </span>
                )}
              </>
            )

            return canOpen ? (
              <button
                key={`${slide.id}-${slide.offset}`}
                type="button"
                className={`gunze-movie-card is-offset-${slide.offset} ${isActive ? "is-active" : ""}`}
                onClick={() => setModal(slide.id)}
              >
                {body}
              </button>
            ) : (
              <div
                key={`${slide.id}-${slide.offset}`}
                className={`gunze-movie-card is-offset-${slide.offset} ${isActive ? "is-active" : ""}`}
              >
                {body}
              </div>
            )
          })}
        </div>

        <div className="gunze-movie-controller">
          <button
            type="button"
            className="gunze-arrow-btn is-prev"
            aria-label="上一个视频"
            onClick={() => setCurrent((value) => (value - 1 + MOVIE_TOTAL) % MOVIE_TOTAL)}
          >
            <svg viewBox="0 0 27 26">
              <use href="#gunze-arrow" />
            </svg>
          </button>
          <div className="gunze-progress">
            <span>{String(current + 1).padStart(2, "0")}</span>
            <div className="gunze-progress__bar">
              <div style={{ transform: `scaleX(${(current + 1) / MOVIE_TOTAL})` }} />
            </div>
            <span>{MOVIE_TOTAL}</span>
          </div>
          <button
            type="button"
            className="gunze-arrow-btn is-next"
            aria-label="下一个视频"
            onClick={() => setCurrent((value) => (value + 1) % MOVIE_TOTAL)}
          >
            <svg viewBox="0 0 27 26">
              <use href="#gunze-arrow" />
            </svg>
          </button>
        </div>
      </div>

      {modal && (
        <div className="gunze-modal" role="dialog" aria-modal="true">
          <button type="button" className="gunze-modal__bg" aria-label="关闭弹窗" onClick={() => setModal(null)} />
          <div className={`gunze-modal__body ${activeMovie ? "is-vertical" : ""}`}>
            <iframe
              src={`https://www.youtube.com/embed/${
                activeMovie?.youtube ??
                (modal === "webcm02" ? "NJPwkBNe9U8" : "LYVMJH47z84")
              }`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <button type="button" className="gunze-modal__close" aria-label="关闭弹窗" onClick={() => setModal(null)}>
              <svg viewBox="0 0 75 75">
                <use href="#gunze-close" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function CeoSection() {
  const onMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5)
    const y = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5)
    event.currentTarget.style.setProperty("--eye-x", `${x * 28}px`)
    event.currentTarget.style.setProperty("--eye-y", `${y * 16}px`)
  }

  const onLeave = (event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--eye-x", "0px")
    event.currentTarget.style.setProperty("--eye-y", "0px")
  }

  return (
    <section className="gunze-ceo" id="ceo" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="gunze-ceo__inner">
        <hgroup className="gunze-title-group gunze-title-group--ceo">
          <h2 className="gunze-section-title">From CEO</h2>
          <p className="gunze-title-jp">总裁致辞</p>
        </hgroup>

        <div className="gunze-ceo__main">
          <figure className="gunze-ceo__photo">
            <div className="gunze-ceo__photo-main">
              <img className="is-default" src={`${ASSET}ceo-img.jpg`} alt="" />
              <div className="is-hover">
                <img src={`${ASSET}ceo-img-mouseon.jpg`} alt="" />
                <Eyes className="gunze-eyes--ceo" />
              </div>
            </div>
            <figcaption>
              郡志株式会社社长兼代表董事
              <br />
              佐口俊康
            </figcaption>
          </figure>

          <div className="gunze-ceo__copy">
            <p className="gunze-ceo__catch">难以理解 = 有趣</p>
            <p>
              即使拥有130年的经验，未来依然难以预测。
              <br />
              但“不可预测的未来”本身就充满魅力。
              <br />
              “GUNZE，不可预测”也同样令人着迷。
              <br />
              敬请期待接下来的发展。
            </p>
            <a href="https://www.gunze.co.jp/recruit/media/article013/" target="_blank" rel="noreferrer" className="gunze-btn">
              首席执行官面试
              <svg viewBox="0 0 27 26">
                <use href="#gunze-arrow" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function GunzeTransition() {
  const stageRef = useRef<HTMLElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    const stage = stageRef.current
    const dot = dotRef.current
    if (!stage) return

    const root = document.documentElement

    const apply = (progress: number) => {
      const p = clamp(progress, 0, 1)
      const vw = window.innerWidth
      const vh = window.innerHeight
      const centerX = vw * 0.5
      const centerY = vh * 0.5

      const hookH = vh * HOOK_VH
      const hookW = hookH * SVG_RATIO
      const dotW = hookW * DOT_WIDTH_RATIO
      const dotH = dotW / DOT_ASPECT
      const offsetToTail = hookH * TIP_Y_RATIO + hookH * GAP_RATIO + dotH / 2
      const tailX = centerX + hookW * (TIP_X_RATIO - 0.5)

      const qY0 = 0
      const qYatCenter = centerY - offsetToTail
      const qYend = -(hookH + vh * 0.35)
      const qY = p <= REVEAL_END
        ? lerp(qY0, qYatCenter, map(p, 0, REVEAL_END, 0, 1))
        : lerp(qYatCenter, qYend, map(p, REVEAL_END, 1, 0, 1))
      const dotCenterY = p <= REVEAL_END ? qY + offsetToTail : centerY

      const flood = map(p, REVEAL_END, FLOOD_END, 0, 1)
      const diag = Math.hypot(vw, vh)
      const maxScale = (diag * 1.7) / dotW

      if (dot) {
        dot.style.width = `${dotW.toFixed(1)}px`
        dot.style.height = `${dotH.toFixed(1)}px`
      }

      root.style.setProperty("--gunze-q-height", `${hookH.toFixed(1)}px`)
      root.style.setProperty("--gunze-q-y", `${qY.toFixed(2)}px`)
      root.style.setProperty("--gunze-body-opacity", (1 - map(p, REVEAL_END, 0.8, 0, 0.85)).toFixed(4))
      root.style.setProperty("--gunze-dot-left", `${tailX.toFixed(2)}px`)
      root.style.setProperty("--gunze-dot-top", `${dotCenterY.toFixed(2)}px`)
      root.style.setProperty("--gunze-dot-scale", (1 + flood * (maxScale - 1)).toFixed(4))
      root.style.setProperty("--gunze-message-alpha", map(p, MSG_START, MSG_END, 0, 1).toFixed(4))
      root.style.setProperty("--gunze-message-y", `${map(p, MSG_START, 1, 58, -75).toFixed(2)}vh`)
      root.style.setProperty("--gunze-mv-alpha", (1 - map(p, 0.08, 0.56, 0, 1)).toFixed(4))
      root.style.setProperty("--gunze-mv-y", `${map(p, 0, 0.56, 0, -120).toFixed(2)}px`)
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
        scrub: 0.85,
        invalidateOnRefresh: true,
        onRefresh: (self) => apply(self.progress),
      },
    })

    const updateScrollTrigger = () => ScrollTrigger.update()
    lenis?.on("scroll", updateScrollTrigger)

    apply(0)
    ScrollTrigger.refresh()

    return () => {
      lenis?.off("scroll", updateScrollTrigger)
      tween.scrollTrigger?.kill()
      tween.kill()
      for (const name of [
        "--gunze-q-height",
        "--gunze-q-y",
        "--gunze-body-opacity",
        "--gunze-dot-left",
        "--gunze-dot-top",
        "--gunze-dot-scale",
        "--gunze-message-alpha",
        "--gunze-message-y",
        "--gunze-mv-alpha",
        "--gunze-mv-y",
      ]) {
        root.style.removeProperty(name)
      }
    }
  }, [lenis])

  return (
    <>
      <SvgSprite />
      <section ref={stageRef} className="gunze-stage" aria-label="GUNZE 130th transition">
        <div className="gunze-scene">
          <div className="gunze-question-layer">
            <img
              src={`${ASSET}mv-question-body.svg`}
              className="gunze-question-body"
              alt=""
              width={1440}
              height={1316}
              loading="eager"
              decoding="async"
            />
            <Eyes className="gunze-eyes--mv" />
          </div>

          <div className="gunze-message-bg" aria-hidden>
            <div ref={dotRef} className="gunze-message-dot" />
          </div>

          <div className="gunze-message-preview">
            <div className="gunze-message-inner gunze-message-preview__inner">
              <h2 className="gunze-section-title">Message</h2>
              <div className="gunze-message-text">
                <p>
                  它的发音是“郡士”。
                  <br />
                  事实上，他们将在2026年庆祝成立130周年。
                </p>
                <p>
                  从纱线到内衣、
                  <br />
                  塑料和医疗用品，
                  <br />
                  我们不断拓展挑战，
                  <br />
                  提供各种“舒适”体验。
                </p>
                <p>
                  即使成立130年后，
                  <br />
                  这家公司仍然充满未知，
                  <br />
                  并且正在认真地尝试改变未来。
                </p>
                <p>
                  不仅仅是名字难以辨认，
                  <br />
                  更在于它所代表的未来可能性。
                  <br />
                  它创造着尚未显现的价值，
                  <br />
                  一种目前世上尚不存在的“舒适感”。
                </p>
                <p>
                  无法辨认，GUNZE。
                  <br />
                  这是我们对未来的宣言，
                  <br />
                  我们将迎接未来130年的挑战。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <MovieSection />
      <CeoSection />
    </>
  )
}
