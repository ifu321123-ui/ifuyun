import { junniHero } from "./junniData"

/**
 * home_about：荧光绿底 + 黑字大段日文文案 + ABOUT JUNNI 按钮。
 * 翻面完成后自然滚入的下一层（独立区块，非翻转露出的底层）。
 */
export default function JunniAbout() {
  return (
    <section className="junni-about" aria-label="ABOUT JUNNI">
      <div className="junni-about__inner">
        <span className="junni-about__label">{junniHero.aboutLabel}</span>
        <div className="junni-about__copy junni-about__copy--lead">
          {junniHero.manifesto.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="junni-about__copy">
          {junniHero.manifestoExtended.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <button type="button" className="junni-about__cta">
          {junniHero.aboutCta}
        </button>
      </div>
    </section>
  )
}
