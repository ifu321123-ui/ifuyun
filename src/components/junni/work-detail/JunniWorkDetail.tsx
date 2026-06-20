import { CSSProperties, useEffect, useRef, useState, type ReactNode } from "react"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { navigate } from "@/hooks/useRoute"
import { useInView } from "@/hooks/useInView"
import {
  getAdjacentWorks,
  getWorkDetail,
  type WorkDetail,
  type WorkMedia,
  type WorkSection,
} from "./junniWorkDetailData"
import "./JunniWorkDetail.css"

function Reveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.12,
}: {
  children: ReactNode
  className?: string
  delay?: 0 | 1 | 2 | 3
  threshold?: number
}) {
  const { ref, inView } = useInView<HTMLDivElement>(threshold)
  return (
    <div
      ref={ref}
      className={`jwd__reveal ${delay ? `jwd__reveal--delay-${delay}` : ""} ${className}`.trim()}
      data-visible={inView}
    >
      {children}
    </div>
  )
}

function TitleChars({ text }: { text: string }) {
  return (
    <h1 className="jwd__title" aria-label={text}>
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="jwd__title-char"
          style={{ "--char-i": i } as CSSProperties}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  )
}

function HeroMedia({ work }: { work: WorkDetail }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  const togglePlayback = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play()
    else video.pause()
  }

  if (work.heroVideo && !failed) {
    return (
      <div className="jwd__hero-player">
        <video
          ref={videoRef}
          className="jwd__hero-video"
          src={work.heroVideo}
          poster={work.heroImage}
          controls
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
          aria-label={`${work.title} 作品交互视频`}
        />
        <button
          type="button"
          className="jwd__hero-play-btn"
          data-playing={playing}
          onClick={togglePlayback}
          aria-label={playing ? "暂停视频" : "播放视频"}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" aria-hidden>
              <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>
    )
  }

  return (
    <img src={work.heroImage} alt={`${work.title} 作品主视觉`} loading="eager" decoding="async" />
  )
}

function MediaBlock({ media }: { media: WorkMedia }) {
  if (media.type === "video") {
    return (
      <div className="jwd__video-wrap">
        <video
          className="jwd__section-video"
          src={media.src}
          poster={media.poster}
          controls
          playsInline
          preload="metadata"
          aria-label={media.alt ?? "项目视频"}
        />
      </div>
    )
  }

  if (media.type === "youtube") {
    const id = media.src.includes("youtu.be/")
      ? media.src.split("youtu.be/")[1]?.split("?")[0]
      : media.src.split("v=")[1]?.split("&")[0]
    return (
      <div className="jwd__video-wrap">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={media.alt ?? "项目视频"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <figure className={`jwd__figure${media.fit === "full" ? " jwd__figure--full" : ""}`}>
      <img src={media.src} alt={media.alt ?? ""} loading="lazy" decoding="async" />
    </figure>
  )
}

function WorkSectionBlock({ section, index }: { section: WorkSection; index: number }) {
  return (
    <article className="jwd__section">
      {section.heading ? (
        <Reveal>
          <h2 className="jwd__section-heading">{section.heading}</h2>
        </Reveal>
      ) : null}

      {section.body?.length ? (
        <Reveal className="jwd__section-body" delay={1}>
          {section.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </Reveal>
      ) : null}

      {section.media ? (
        <Reveal
          className={`jwd__section-media${index === 0 ? " jwd__section-media--wide" : ""}${
            section.media.type === "image" && section.media.fit === "full"
              ? " jwd__section-media--full"
              : ""
          }`}
          delay={2}
        >
          <MediaBlock media={section.media} />
        </Reveal>
      ) : null}
    </article>
  )
}

function WorkNotFound() {
  return (
    <main className="jwd-not-found" data-menu-bg="light">
      <div>
        <p>Work not found</p>
        <h1>没有找到这个作品</h1>
        <button type="button" onClick={() => navigate("portfolio")}>
          返回作品集
        </button>
      </div>
    </main>
  )
}

function WorkDetailPage({ work }: { work: WorkDetail }) {
  const [ready, setReady] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const { prev, next, current } = getAdjacentWorks(work.slug)

  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(t)
  }, [work.slug])

  const goWork = (slug: string) => {
    navigate(`work/${slug}`)
  }

  return (
    <main ref={rootRef} className="jwd" data-ready={ready} data-menu-bg="light">
      <header className="jwd__backbar">
        <button type="button" className="jwd__backlink" onClick={() => navigate("portfolio")}>
          <ArrowLeft aria-hidden />
          Back to Index
        </button>
      </header>

      <section className="jwd__hero" aria-label={`${work.title} 主视觉`}>
        <div className="jwd__hero-media">
          <HeroMedia work={work} />
          <div className="jwd__hero-scrim" aria-hidden />
        </div>
        <div className="jwd__scroll-hint" aria-hidden>
          <span className="jwd__scroll-hint-line" />
          <span className="jwd__scroll-hint-text">Scroll</span>
        </div>
      </section>

      <section className="jwd__head">
        <div className="jwd__head-inner">
          <TitleChars text={work.title} />
          <p className="jwd__subtitle">{work.subtitle}</p>

          <div className="jwd__meta">
            <Reveal className="jwd__meta-grid">
              <span className="jwd__meta-label">Client</span>
              <p className="jwd__meta-value">{work.client}</p>
              <span className="jwd__meta-label">Scope</span>
              <p className="jwd__meta-value">{work.scope}</p>
              <span className="jwd__meta-label">Release</span>
              <p className="jwd__meta-value">{work.release}</p>
              {work.website ? (
                <>
                  <span className="jwd__meta-label">Website</span>
                  <p className="jwd__meta-value jwd__meta-value--link">
                    <a href={work.website} target="_blank" rel="noreferrer">
                      {work.website}
                    </a>
                  </p>
                </>
              ) : null}
            </Reveal>

            <Reveal className="jwd__credits" delay={1}>
              <p className="jwd__credits-title">Credit</p>
              {work.credits.map((credit) => (
                <div key={credit.role} className="jwd__credit-row">
                  <span className="jwd__credit-role">{credit.role}</span>
                  <p className="jwd__credit-name">{credit.name}</p>
                </div>
              ))}
            </Reveal>
          </div>

          <Reveal className="jwd__intro" delay={2}>
            <p>{work.intro}</p>
          </Reveal>
        </div>
      </section>

      <section className="jwd__content" aria-label="案例正文">
        {work.sections.map((section, index) => (
          <WorkSectionBlock key={index} section={section} index={index} />
        ))}
      </section>

      {work.website ? (
        <section className="jwd__visit">
          <Reveal className="jwd__visit-inner">
            <p className="jwd__visit-label">{work.title} 项目链接</p>
            <a className="jwd__visit-url" href={work.website} target="_blank" rel="noreferrer">
              {work.website}
            </a>
            <br />
            <a className="jwd__visit-cta" href={work.website} target="_blank" rel="noreferrer">
              Visit Site
              <ArrowUpRight aria-hidden />
            </a>
          </Reveal>
        </section>
      ) : null}

      <section className="jwd__adjacent" aria-label="相邻作品">
        <div className="jwd__adjacent-track">
          {prev ? (
            <a
              className="jwd__adjacent-side"
              href={`#work/${prev.slug}`}
              onClick={(e) => {
                e.preventDefault()
                goWork(prev.slug)
              }}
              aria-label={`上一个作品：${prev.title}`}
            >
              <img src={prev.image} alt="" />
              <span className="jwd__adjacent-side-label">PREV</span>
            </a>
          ) : (
            <div className="jwd__adjacent-side" aria-hidden />
          )}

          <div className="jwd__adjacent-center">
            {current ? (
              <img src={current.image} alt={current.title} />
            ) : (
              <img src={work.heroImage} alt={work.title} />
            )}
          </div>

          {next ? (
            <a
              className="jwd__adjacent-side"
              href={`#work/${next.slug}`}
              onClick={(e) => {
                e.preventDefault()
                goWork(next.slug)
              }}
              aria-label={`下一个作品：${next.title}`}
            >
              <img src={next.image} alt="" />
              <span className="jwd__adjacent-side-label">NEXT</span>
            </a>
          ) : (
            <div className="jwd__adjacent-side" aria-hidden />
          )}
        </div>

        <nav className="jwd__adjacent-nav" aria-label="作品切换">
          {prev ? (
            <a
              className="jwd__adjacent-link"
              href={`#work/${prev.slug}`}
              onClick={(e) => {
                e.preventDefault()
                goWork(prev.slug)
              }}
            >
              <ArrowLeft size={14} aria-hidden />
              {prev.title}
            </a>
          ) : (
            <span className="jwd__adjacent-link jwd__adjacent-link--disabled">—</span>
          )}
          {next ? (
            <a
              className="jwd__adjacent-link"
              href={`#work/${next.slug}`}
              onClick={(e) => {
                e.preventDefault()
                goWork(next.slug)
              }}
            >
              {next.title}
              <ArrowUpRight size={14} aria-hidden />
            </a>
          ) : (
            <span className="jwd__adjacent-link jwd__adjacent-link--disabled">—</span>
          )}
        </nav>
      </section>
    </main>
  )
}

export default function JunniWorkDetail({ slug }: { slug: string }) {
  const work = getWorkDetail(slug)
  if (!work) return <WorkNotFound />
  return <WorkDetailPage key={slug} work={work} />
}
