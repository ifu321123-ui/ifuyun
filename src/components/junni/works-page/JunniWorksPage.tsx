import { CSSProperties, useCallback, useEffect, useRef, useState } from "react"

import { createPortal } from "react-dom"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLenis } from "lenis/react"

import JunniWorksDrumroll, {
  getDrumrollImagesGonePhase,
  getDrumrollPhaseMax,
} from "./JunniWorksDrumroll"

import {

  WORKS_PAGE_ABOUT_IMAGES,

  WORKS_PAGE_ABOUT_TEXT,

  WORKS_PAGE_DATA,

  WORKS_PAGE_TOTAL,

} from "./junniWorksPageData"

import "./JunniWorksPage.css"

gsap.registerPlugin(ScrollTrigger)

/** Map drumroll scroll progress → phase (browse → exit → nav hold). */
function scrollProgressToPhase(progress: number, itemCount: number) {
  const p = Math.min(1, Math.max(0, progress))
  const worksEnd = Math.max(0, itemCount - 1)
  const imagesGone = getDrumrollImagesGonePhase(itemCount)
  const phaseMax = getDrumrollPhaseMax(itemCount)
  const browseEnd = 0.68
  const exitEnd = 0.88

  if (p <= browseEnd) return (p / browseEnd) * worksEnd
  if (p <= exitEnd) {
    const t = (p - browseEnd) / (exitEnd - browseEnd)
    return worksEnd + t * (imagesGone - worksEnd)
  }
  const t = (p - exitEnd) / (1 - exitEnd)
  return imagesGone + t * (phaseMax - imagesGone)
}



const PAGE_TITLE = "MY PROJECT"

type ViewMode = "drumroll" | "list"

const PORTFOLIO_VIEW_KEY = "jwp-view-mode"

function readPortfolioView(): ViewMode {
  if (typeof window === "undefined") return "list"
  return sessionStorage.getItem(PORTFOLIO_VIEW_KEY) === "drumroll" ? "drumroll" : "list"
}

/** Desktop: 3 columns × 3 marquee tracks per side (matches原站 min-md structure). */

function AboutSliderDesktop({ side, images }: { side: "left" | "right"; images: string[] }) {

  const half = Math.ceil(images.length / 2)

  const slice = side === "left" ? images.slice(0, half) : images.slice(half)

  const chunk = Math.ceil(slice.length / 3) || 1

  const columns = [

    slice.slice(0, chunk),

    slice.slice(chunk, chunk * 2),

    slice.slice(chunk * 2),

  ].filter((col) => col.length > 0)



  return (

    <div className="jwp__about-slider jwp__about-slider--desktop" data-side={side} aria-hidden="true">

      {columns.map((col, colIdx) => (

        <div key={colIdx} className="jwp__about-slider-list">

          <div className="jwp__about-slider-block">

            <div className="jwp__about-slider-item">

              {[...col, ...col].map((src, i) => (

                <div key={`${side}-${colIdx}-${i}`} className="jwp__about-slide">

                  <img src={src} alt="" loading="lazy" decoding="async" />

                </div>

              ))}

            </div>

          </div>

        </div>

      ))}

    </div>

  )

}



/** Mobile: simplified single-track sliders. */

function AboutSliderMobile({ side, images }: { side: "left" | "right"; images: string[] }) {

  const half = Math.ceil(images.length / 2)

  const slice = side === "left" ? images.slice(0, half) : images.slice(half)

  const doubled = [...slice, ...slice]



  return (

    <div className="jwp__about-slider jwp__about-slider--mobile" data-side={side} aria-hidden="true">

      <div className="jwp__about-slider-list">

        <div className="jwp__about-slider-item">

          {doubled.map((src, i) => (

            <div key={`${side}-m-${i}`} className="jwp__about-slide">

              <img src={src} alt="" loading="lazy" decoding="async" />

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}



type JunniWorksPageProps = {
  footerRef?: React.RefObject<HTMLElement | null>
  onReadyChange?: (ready: boolean) => void
}

export default function JunniWorksPage({ footerRef, onReadyChange }: JunniWorksPageProps) {

  const worksListRef = useRef<HTMLDivElement>(null)
  const drumrollSectionRef = useRef<HTMLElement>(null)

  const [ready, setReady] = useState(false)

  const [pageHead, setPageHead] = useState(false)

  const [view, setView] = useState<ViewMode>(readPortfolioView)

  const [page, setPage] = useState(1)

  const [drumrollActive, setDrumrollActive] = useState(0)
  const drumrollActiveRef = useRef(0)

  const [toggleVisible, setToggleVisible] = useState(false)

  const [toggleMounted, setToggleMounted] = useState(false)

  const updateToggleVisibility = useCallback(() => {

    const worksListEl = worksListRef.current

    const footerEl = footerRef.current

    if (!worksListEl || !footerEl) return

    const viewportH = window.innerHeight

    const toggleOffset = window.innerWidth >= 769 ? 100 : 50

    const toggleHeight = window.innerWidth >= 769 ? 80 : 50

    const worksRect = worksListEl.getBoundingClientRect()

    const footerRect = footerEl.getBoundingClientRect()

    const worksInView = worksRect.top < viewportH * 0.85 && worksRect.bottom > viewportH * 0.2

    const footerCoversToggle = footerRect.top < viewportH - toggleOffset - toggleHeight * 0.5

    setToggleVisible(worksInView && !footerCoversToggle)

  }, [])



  const lenis = useLenis(updateToggleVisibility)



  useEffect(() => {

    updateToggleVisibility()

    window.addEventListener("scroll", updateToggleVisibility, { passive: true })

    window.addEventListener("resize", updateToggleVisibility)

    return () => {

      window.removeEventListener("scroll", updateToggleVisibility)

      window.removeEventListener("resize", updateToggleVisibility)

    }

  }, [updateToggleVisibility])



  const items = WORKS_PAGE_DATA[page - 1] ?? WORKS_PAGE_DATA[0]

  const setDrumrollPhase = useCallback((next: number) => {
    drumrollActiveRef.current = next
    setDrumrollActive(next)
  }, [])

  useEffect(() => {
    drumrollActiveRef.current = drumrollActive
  }, [drumrollActive])

  useEffect(() => {
    if (view !== "drumroll") return

    const section = drumrollSectionRef.current
    if (!section) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setDrumrollPhase(0)
      return
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.45,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        setDrumrollPhase(scrollProgressToPhase(self.progress, items.length))
      },
    })

    const onScroll = () => ScrollTrigger.update()
    lenis?.on("scroll", onScroll)
    ScrollTrigger.refresh()

    return () => {
      lenis?.off("scroll", onScroll)
      trigger.kill()
    }
  }, [view, items.length, lenis, setDrumrollPhase])



  useEffect(() => {

    setReady(true)

    const t = window.requestAnimationFrame(() => setPageHead(true))

    return () => window.cancelAnimationFrame(t)

  }, [])



  useEffect(() => {

    onReadyChange?.(ready)

  }, [ready, onReadyChange])



  useEffect(() => {

    setToggleMounted(true)

  }, [])



  useEffect(() => {

    setDrumrollPhase(0)
    requestAnimationFrame(() => ScrollTrigger.refresh())

  }, [page, setDrumrollPhase])

  useEffect(() => {
    sessionStorage.setItem(PORTFOLIO_VIEW_KEY, view)
  }, [view])

  useEffect(() => {

    drumrollActiveRef.current = 0
    setDrumrollActive(0)

  }, [view])



  const goPage = (next: number) => {

    setPage(Math.max(1, Math.min(WORKS_PAGE_TOTAL, next)))

  }



  const toggleNode = (

    <div className="jwp__toggle" data-visible={toggleVisible ? "true" : "false"} aria-label="视图切换">

      <div className="jwp__toggle-wrap">

        <button

          type="button"

          className="jwp__toggle-checkbox"

          id="jwp-view-toggle"

          data-type={view}

          onClick={() => setView((prev) => (prev === "list" ? "drumroll" : "list"))}

          aria-label={view === "list" ? "列表视图" : "滚筒视图"}

        />

        <div className="jwp__toggle-knobs">

          <span className="jwp__toggle-icon" data-icon="list">

            <img alt="" src="/assets/images/works/toggle/list.png" />

          </span>

          <span className="jwp__toggle-icon" data-icon="drumroll">

            <img alt="" src="/assets/images/works/toggle/drumroll.png" />

          </span>

        </div>

      </div>

    </div>

  )



  return (

    <div

      className="jwp"

      data-transitioned={ready}

      data-pagehead={pageHead}

      data-view={view}

    >

      <header className="jwp__head">

        <h1 className="jwp__head-title" aria-label={PAGE_TITLE}>

          {PAGE_TITLE.split("").map((char, i) => (

            <span

              key={i}

              className="jwp__head-char"

              style={{ "--char-i": i } as CSSProperties}

            >

              {char === " " ? "\u00A0" : char}

            </span>

          ))}

        </h1>

      </header>



      <div className="jwp__works-container">

        <section className="jwp__about jwp__fade" aria-label="关于作品">

          <div className="jwp__about-inner">

            <AboutSliderDesktop side="left" images={WORKS_PAGE_ABOUT_IMAGES} />

            <AboutSliderDesktop side="right" images={WORKS_PAGE_ABOUT_IMAGES} />

            <AboutSliderMobile side="left" images={WORKS_PAGE_ABOUT_IMAGES} />

            <AboutSliderMobile side="right" images={WORKS_PAGE_ABOUT_IMAGES} />

            <p className="jwp__about-text">

              {WORKS_PAGE_ABOUT_TEXT.join("").split("").map((char, i) => (

                <span key={i} className="jwp__about-char" translate="no">

                  {char}

                </span>

              ))}

            </p>

          </div>

        </section>



        <div className="jwp__works-list" ref={worksListRef} data-type={view}>

          <div className="jwp__list-inner" aria-label="作品列表">

            {items.map((work) => (

              <article key={work.slug} className="jwp__list-item-wrap">

                <div className="jwp__list-item">

                  <div className="jwp__list-item-main">

                    <div

                      className="jwp__list-item-image"

                      style={{ backgroundImage: `url(${work.image})` }}

                      role="img"

                      aria-label={work.title}

                    />

                  </div>

                  <div className="jwp__list-item-detail">

                    <p className="jwp__list-item-title">{work.title}</p>

                    <p className="jwp__list-item-desc">{work.description}</p>

                  </div>

                </div>

              </article>

            ))}

          </div>



          <section className="jwp__drumroll" ref={drumrollSectionRef} aria-label="3D 作品轮播">

            <JunniWorksDrumroll

              items={items}

              active={drumrollActive}

              page={page}

              totalPages={WORKS_PAGE_TOTAL}

              onPageChange={goPage}

            />

          </section>



          <nav className="jwp__pagination" aria-label="分页导航">

              <button

                type="button"

                className="jwp__pagination-arrow"

                disabled={page <= 1}

                aria-label="上一页"

                onClick={() => goPage(page - 1)}

              >

                <svg viewBox="0 0 37.77 66.93" xmlns="http://www.w3.org/2000/svg">

                  <path d="M34.77,3L3,32.57l31.77,31.36" />

                </svg>

              </button>

              <div className="jwp__pagination-list">

                {Array.from({ length: WORKS_PAGE_TOTAL }, (_, i) => {

                  const n = i + 1

                  return (

                    <button

                      key={n}

                      type="button"

                      className="jwp__pagination-item"

                      data-current={page === n}

                      onClick={() => goPage(n)}

                    >

                      {n}

                    </button>

                  )

                })}

              </div>

              <button

                type="button"

                className="jwp__pagination-arrow"

                disabled={page >= WORKS_PAGE_TOTAL}

                aria-label="下一页"

                onClick={() => goPage(page + 1)}

              >

                <svg viewBox="0 0 37.77 66.93" xmlns="http://www.w3.org/2000/svg">

                  <path d="M3,3l31.77,29.57L3,63.93" />

                </svg>

              </button>

          </nav>

        </div>

      </div>



      {toggleMounted ? createPortal(toggleNode, document.body) : null}

    </div>

  )

}


