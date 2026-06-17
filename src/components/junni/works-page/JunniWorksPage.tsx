import { CSSProperties, useCallback, useEffect, useRef, useState } from "react"

import { createPortal } from "react-dom"

import { useLenis } from "lenis/react"

import { navigate } from "@/hooks/useRoute"

import JunniWorksDrumroll from "./JunniWorksDrumroll"

import {

  WORKS_PAGE_ABOUT_IMAGES,

  WORKS_PAGE_ABOUT_TEXT,

  WORKS_PAGE_DATA,

  WORKS_PAGE_TOTAL,

} from "./junniWorksPageData"

import "./JunniWorksPage.css"



const PAGE_TITLE = "OUR WORKS"

type ViewMode = "drumroll" | "list"



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



const FOOTER_LINKS: { id: string; label: string; active?: boolean }[] = [

  { id: "portfolio", label: "作品" },

  { id: "projects", label: "服务" },

  { id: "experience", label: "招募" },

  { id: "contact", label: "接触" },

]



export default function JunniWorksPage() {

  const worksListRef = useRef<HTMLDivElement>(null)

  const footerRef = useRef<HTMLElement>(null)

  const [ready, setReady] = useState(false)

  const [pageHead, setPageHead] = useState(false)

  const [view, setView] = useState<ViewMode>("drumroll")

  const [page, setPage] = useState(1)

  const [drumrollActive, setDrumrollActive] = useState(0)

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



  useEffect(() => {

    setReady(true)

    const t = window.requestAnimationFrame(() => setPageHead(true))

    return () => window.cancelAnimationFrame(t)

  }, [])



  useEffect(() => {

    setToggleMounted(true)

  }, [])



  useEffect(() => {

    setDrumrollActive(0)

  }, [page])



  const scrollTop = () => {

    if (lenis) lenis.scrollTo(0, { duration: 1.1 })

    else window.scrollTo({ top: 0, behavior: "smooth" })

  }



  const goPage = (next: number) => {

    setPage(Math.max(1, Math.min(WORKS_PAGE_TOTAL, next)))

  }



  const toggleNode = (

    <div className="jwp__toggle" data-visible={toggleVisible ? "true" : "false"} aria-label="表示切替">

      <div className="jwp__toggle-wrap">

        <button

          type="button"

          className="jwp__toggle-checkbox"

          id="jwp-view-toggle"

          data-type={view}

          onClick={() => setView((prev) => (prev === "list" ? "drumroll" : "list"))}

          aria-label={view === "list" ? "リスト表示" : "ドラムロール表示"}

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

        <section className="jwp__about jwp__fade" aria-label="制作実績について">

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

          <div className="jwp__list-inner" aria-label="作品一覧">

            {items.map((work) => (

              <article key={work.slug} className="jwp__list-item-wrap">

                <a className="jwp__list-item" href={`#work/${work.slug}`}>

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

                </a>

              </article>

            ))}

          </div>



          <section className="jwp__drumroll" aria-label="3D 作品轮播">

            <JunniWorksDrumroll

              items={items}

              active={drumrollActive}

              onActiveChange={setDrumrollActive}

              page={page}

              totalPages={WORKS_PAGE_TOTAL}

              onPageChange={goPage}

            />

          </section>



          <nav className="jwp__pagination" aria-label="ページネーション">

              <button

                type="button"

                className="jwp__pagination-arrow"

                disabled={page <= 1}

                aria-label="前のページ"

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

                aria-label="次のページ"

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



      <aside className="jwp__copyright" aria-hidden="true">

        <small className="jwp__copyright-text">

          Copyright © IFU.YUN · Inspired by JUNNI

        </small>

      </aside>



      <footer className="jwp__footer" ref={footerRef}>

        <div className="jwp__footer-inner">

          <ul className="jwp__footer-menu">

            {FOOTER_LINKS.map((link) => (

              <li key={link.id}>

                <button

                  type="button"

                  className="jwp__footer-menu-link"

                  data-active={link.active ?? false}

                  onClick={() => !link.active && navigate(link.id)}

                >

                  {link.label}

                </button>

              </li>

            ))}

          </ul>

          <div className="jwp__footer-brand">

            <p className="jwp__footer-logo">IFUYUN</p>

            <p className="jwp__footer-tagline">自由地、独特地。</p>

          </div>

          <button type="button" className="jwp__page-top" onClick={scrollTop}>

            <svg viewBox="0 0 48.3 54.54" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">

              <path

                d="M5,26.54L24.15,5l19.15,21.54"

                fill="none"

                stroke="currentColor"

                strokeLinecap="round"

                strokeLinejoin="round"

                strokeWidth="10"

              />

              <path

                d="M5,49.54l19.15-21.54,19.15,21.54"

                fill="none"

                stroke="currentColor"

                strokeLinecap="round"

                strokeLinejoin="round"

                strokeWidth="10"

              />

            </svg>

            <span>页面顶部</span>

          </button>

        </div>

      </footer>

    </div>

  )

}


