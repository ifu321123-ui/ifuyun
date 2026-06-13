import { heroIntro } from "@/data"

export default function HeroIntro() {
  return (
    <section className="hi-intro" aria-label={`${heroIntro.nameCjk} 个人主页`}>
      <div className="hi-grid-bg" aria-hidden />
      <div className="hi-scanline" aria-hidden />

      <span className="hi-side" aria-hidden>
        {heroIntro.sideText}
      </span>

      <div className="hi-inner">
        <div className="hi-name-row">
          <h1 className="hi-name-cjk">{heroIntro.nameCjk}</h1>
          <span className="hi-name-latin">{heroIntro.nameLatin}</span>
          <span className="hi-version">{heroIntro.version}</span>
        </div>

        <p className="hi-breadcrumb">
          <span className="hi-arrow">&gt;&gt;</span>
          {heroIntro.breadcrumb.map((seg, i) => (
            <span key={seg} className="hi-crumb">
              {i > 0 && <span className="hi-slash">/</span>}
              {seg}
            </span>
          ))}
        </p>

        <div className="hi-display" aria-label={heroIntro.displayLines.join(" ")}>
          {heroIntro.displayLines.map((line, i) => (
            <span
              key={line}
              className={`hi-display-line${
                i === heroIntro.displayLines.length - 1 ? " hi-display-line--mark" : ""
              }`}
            >
              {line}
            </span>
          ))}
        </div>

        <p className="hi-subtitle">{heroIntro.subtitle}</p>
        <p className="hi-caption">{heroIntro.caption}</p>

        <div className="hi-scroll">
          <span className="hi-scroll-en">{heroIntro.scroll.en}</span>
          <span className="hi-scroll-dot">·</span>
          <span className="hi-scroll-cn">{heroIntro.scroll.cn}</span>
          <span className="hi-scroll-chev" aria-hidden>
            ▾
          </span>
        </div>
      </div>

      <div className="hi-statusbar" aria-hidden>
        <div className="hi-status-left">
          {heroIntro.status.map((s) => (
            <span key={s.label} className="hi-status-item">
              <span className={`hi-dot hi-dot--${s.tone}`} />
              {s.label}
            </span>
          ))}
        </div>
        <span className="hi-signature">{heroIntro.signature}</span>
      </div>
    </section>
  )
}
