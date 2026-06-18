import { useEffect, useState, type CSSProperties, type ReactNode } from "react"

import { useInView } from "@/hooks/useInView"

import {
  RECRUIT_MESSAGE_CHARS,
  RECRUIT_OFFICE,
  RECRUIT_PAGE_TITLE,
  RECRUIT_SPECIAL,
  RECRUIT_THEME_DESKTOP,
  RECRUIT_THEME_MOBILE,
} from "./junniRecruitPageData"

import "./JunniRecruitPage.css"

function ArrowIcon() {
  return (
    <svg viewBox="0 0 15.77 24.93" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m2,2l11.77,10.47L2,22.93"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4px"
      />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 29.17 28.24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.37,2l9.73.08.08,9.72"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4px"
      />
      <path
        d="M11,17.24l12-12"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4px"
      />
      <path
        d="M10,7.24H2v19h19.9v-8.9"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4px"
      />
    </svg>
  )
}

function FlipBtn({
  href,
  onClick,
  label,
  dark = false,
  icon = "arrow",
  children,
}: {
  href?: string
  onClick?: () => void
  label?: string
  dark?: boolean
  icon?: "arrow" | "external" | "none"
  children?: ReactNode
}) {
  const content = children ?? label
  const inner = (
    <div className="jrp__flip-btn-inner">
      <span className="jrp__flip-btn-face jrp__flip-btn-face--front">
        {content}
        {icon !== "none" && (
          <i className="jrp__flip-btn-icon" aria-hidden>
            {icon === "external" ? <ExternalIcon /> : <ArrowIcon />}
          </i>
        )}
      </span>
      <span className="jrp__flip-btn-face jrp__flip-btn-face--back">
        {content}
        {icon !== "none" && (
          <i className="jrp__flip-btn-icon" aria-hidden>
            {icon === "external" ? <ExternalIcon /> : <ArrowIcon />}
          </i>
        )}
      </span>
    </div>
  )

  const className = `jrp__flip-btn${dark ? " jrp__flip-btn--dark" : ""}`

  if (href) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {inner}
    </button>
  )
}

function SectionTitle({
  en,
  ja,
  variant = "white",
}: {
  en: string
  ja: string
  variant?: "white" | "black"
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2)

  return (
    <div
      ref={ref}
      className={`jrp__section-title jrp__section-title--${variant}${inView ? " is-anime" : ""}`}
    >
      <h2 className="jrp__section-title-en">
        {en.split("").map((char, i) =>
          char === " " ? (
            <span key={i} className="jrp__section-title-char">
              &nbsp;
            </span>
          ) : (
            <span
              key={i}
              className="jrp__section-title-char"
              style={{ "--delay": `${i * 0.03}s` } as CSSProperties}
            >
              {char}
            </span>
          ),
        )}
      </h2>
      <p className="jrp__section-title-ja">{ja}</p>
    </div>
  )
}

function SpacedHead({ title }: { title: string }) {
  return (
    <h1 className="jrp__head-title" aria-label={title.replace(/\s/g, "")}>
      {title.split("").map((char, i) => (
        <span
          key={i}
          className="jrp__head-char"
          style={{ "--char-i": i } as CSSProperties}
        >
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </h1>
  )
}

function OfficeSlider() {
  const slides = [...RECRUIT_OFFICE.images, ...RECRUIT_OFFICE.images]

  return (
    <div className="jrp__office-slider" aria-hidden>
      <div className="jrp__office-track">
        {slides.map((src, i) => (
          <div key={i} className="jrp__office-slide">
            <img src={src} alt="" loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
      <div className="jrp__office-track" aria-hidden>
        {slides.map((src, i) => (
          <div key={`dup-${i}`} className="jrp__office-slide">
            <img src={src} alt="" loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** junni.co.jp/recruit/ 完整复刻（内嵌于 experience 页顶部） */
export default function JunniRecruitPage() {
  const [pageHead, setPageHead] = useState(false)
  const office = useInView<HTMLDivElement>(0.1)

  useEffect(() => {
    const t = requestAnimationFrame(() => setPageHead(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const messageChars = [...RECRUIT_MESSAGE_CHARS]

  return (
    <div className="jrp" data-menu-bg="dark" data-pagehead={pageHead ? "true" : "false"} data-namespace="recruit">
      <header className="jrp__head">
        <SpacedHead title={RECRUIT_PAGE_TITLE.split("").join(" ")} />
      </header>

      <section className="jrp__message">
        <div className="jrp__message-theme">
          <div className={`jrp__message-theme-item jrp__message-theme-item--mobile${pageHead ? " is-anime" : ""}`}>
            <span className="jrp__message-theme-text">{RECRUIT_THEME_MOBILE}</span>
          </div>
          {RECRUIT_THEME_DESKTOP.map((line) => (
            <div
              key={line}
              className={`jrp__message-theme-item jrp__message-theme-item--desktop${pageHead ? " is-anime" : ""}`}
            >
              <span className="jrp__message-theme-text">{line}</span>
            </div>
          ))}
        </div>
        <p className="jrp__message-text">
          {messageChars.map((char, i) => (
            <span key={i}>{char}</span>
          ))}
        </p>
      </section>

      <section className="jrp__special">
        <SectionTitle en="S P E C I A L" ja="コラボ動画" variant="white" />
        <div className="jrp__special-inner">
          <h3 className="jrp__special-heading">
            {RECRUIT_SPECIAL.title.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h3>
          <div className="jrp__video">
            <iframe
              src={RECRUIT_SPECIAL.youtube}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <p className="jrp__special-text">{RECRUIT_SPECIAL.text}</p>
        </div>
      </section>

      <section className="jrp__office">
        <SectionTitle en="O F F I C E  T O U R" ja="360度オフィスツアー" variant="black" />
        <div ref={office.ref} className={`jrp__office-inner${office.inView ? " is-anime" : ""}`}>
          <div className="jrp__office-map">
            <iframe
              src={RECRUIT_OFFICE.tour}
              title="360度オフィスツアー"
              loading="lazy"
              allowFullScreen
            />
          </div>
          <p className="jrp__office-text">{RECRUIT_OFFICE.text}</p>
          <OfficeSlider />
        </div>
      </section>
    </div>
  )
}
